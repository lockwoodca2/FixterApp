import { Hono } from 'hono';
import { BookingStatus } from '@prisma/client';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';
import { calculateJobSlots } from '../utils/timeSlots.js';

type Variables = {
  prisma: PrismaClient;
};

const bookings = new Hono<{ Bindings: Env; Variables: Variables }>();

// POST /api/bookings - Create a new booking
bookings.post('/bookings', async (c) => {
  try {
    const prisma = c.get('prisma');
    const {
      contractorId,
      clientId,
      serviceId,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      price,
      estimatedDuration = 90
    } = await c.req.json();

    // Validate required fields
    if (!contractorId || !clientId || !serviceId || !serviceAddress || !scheduledDate || !scheduledTime) {
      return c.json({
        success: false,
        error: 'All booking fields are required'
      }, 400);
    }

    // Verify contractor exists and check subscription limits
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        subscription: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
                }
              }
            }
          }
        }
      }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    // Check job limit for free tier contractors
    const FREE_JOB_LIMIT = 5;
    const isPremium = contractor.subscription?.tier === 'PREMIUM' && contractor.subscription?.status === 'ACTIVE';
    const activeJobCount = contractor._count.bookings;

    if (!isPremium && activeJobCount >= FREE_JOB_LIMIT) {
      return c.json({
        success: false,
        error: 'Job limit reached. Upgrade to Premium for unlimited jobs.',
        code: 'JOB_LIMIT_REACHED',
        limit: FREE_JOB_LIMIT,
        currentCount: activeJobCount
      }, 403);
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return c.json({
        success: false,
        error: 'Client not found'
      }, 404);
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return c.json({
        success: false,
        error: 'Service not found'
      }, 404);
    }

    // Check service area (soft validation - returns warning but allows booking)
    const addressLower = serviceAddress.toLowerCase();
    const jobDate = new Date(scheduledDate);
    const dayOfWeek = jobDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Get contractor's service areas
    const contractorServiceAreas = await prisma.contractorServiceArea.findMany({
      where: {
        contractorId,
        isActive: true
      }
    });

    let serviceAreaWarning: string | null = null;

    if (contractorServiceAreas.length > 0) {
      // Check global service areas
      const allAreas = [...new Set(contractorServiceAreas.map((sa: any) => sa.area))];
      const inGlobalArea = allAreas.some((area: string) =>
        addressLower.includes(area.toLowerCase())
      );

      if (!inGlobalArea) {
        serviceAreaWarning = `Address may be outside contractor's service areas (${allAreas.join(', ')})`;
      } else {
        // Check day-specific service areas
        const dayAreas = contractorServiceAreas
          .filter((sa: any) => sa.dayOfWeek === dayOfWeek)
          .map((sa: any) => sa.area);

        if (dayAreas.length > 0) {
          const inDayArea = dayAreas.some((area: string) =>
            addressLower.includes(area.toLowerCase())
          );

          if (!inDayArea) {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            serviceAreaWarning = `On ${dayNames[dayOfWeek]}s, contractor only services: ${dayAreas.join(', ')}`;
          }
        }
      }
    }

    // Parse scheduledTime to get start time (e.g., "09:00 - 11:30" -> "09:00")
    const startTime = scheduledTime.split(' - ')[0] || scheduledTime;

    // Parse date without timezone shift (treat as local date)
    const [year, month, day] = scheduledDate.split('-').map(Number);
    const scheduledDateObj = new Date(year, month - 1, day);

    // Create booking and time slots in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          contractorId,
          clientId,
          serviceId,
          serviceAddress,
          scheduledDate: scheduledDateObj,
          scheduledTime,
          estimatedDuration,
          price: price || null,
          status: BookingStatus.PENDING
        },
        include: {
          contractor: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          }
        }
      });

      // Calculate job and travel slots
      const { jobSlots, travelSlots } = calculateJobSlots(startTime, estimatedDuration, true);

      // Use the already parsed date object with hours set to midnight
      const dateObj = new Date(scheduledDateObj);
      dateObj.setHours(0, 0, 0, 0);

      // Create job slots
      const jobSlotRecords = jobSlots.map(slot => ({
        contractorId,
        date: dateObj,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotType: 'JOB' as const,
        bookingId: newBooking.id,
        reason: `Booking #${newBooking.id}`
      }));

      // Create travel slots
      const travelSlotRecords = travelSlots.map(slot => ({
        contractorId,
        date: dateObj,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotType: 'TRAVEL' as const,
        reason: 'Travel time to next job'
      }));

      const allSlots = [...jobSlotRecords, ...travelSlotRecords];

      // Create all time slots
      await Promise.all(
        allSlots.map(slot => tx.timeSlot.create({ data: slot }))
      );

      return newBooking;
    });

    return c.json({
      success: true,
      booking,
      message: 'Booking and time slots created successfully',
      serviceAreaWarning
    }, 201);
  } catch (error) {
    console.error('Create booking error:', error);
    return c.json({
      success: false,
      error: 'Failed to create booking'
    }, 500);
  }
});

// POST /api/bookings/manual - Create a manual booking (for contractors)
bookings.post('/bookings/manual', async (c) => {
  try {
    const prisma = c.get('prisma');
    const {
      contractorId,
      clientName,
      clientEmail,
      clientPhone,
      serviceName,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      estimatedDuration = 90,
      price
    } = await c.req.json();

    // Validate required fields
    if (!contractorId || !clientName || !serviceName || !serviceAddress || !scheduledDate || !scheduledTime) {
      return c.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Check contractor subscription limits
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        subscription: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
                }
              }
            }
          }
        }
      }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    // Check job limit for free tier contractors
    const FREE_JOB_LIMIT = 5;
    const isPremium = contractor.subscription?.tier === 'PREMIUM' && contractor.subscription?.status === 'ACTIVE';
    const activeJobCount = contractor._count.bookings;

    if (!isPremium && activeJobCount >= FREE_JOB_LIMIT) {
      return c.json({
        success: false,
        error: 'Job limit reached. Upgrade to Premium for unlimited jobs.',
        code: 'JOB_LIMIT_REACHED',
        limit: FREE_JOB_LIMIT,
        currentCount: activeJobCount
      }, 403);
    }

    // Parse date without timezone shift
    const [year, month, day] = scheduledDate.split('-').map(Number);
    const scheduledDateObj = new Date(year, month - 1, day);

    // For manual bookings, find or create a client
    let clientId: number;
    const nameParts = clientName.split(' ');
    const firstName = nameParts[0] || clientName;
    const lastName = nameParts.slice(1).join(' ') || '';
    const emailToUse = clientEmail || `manual_${Date.now()}@placeholder.local`;

    // Check if client exists by email
    const existingClient = await prisma.client.findFirst({
      where: { email: emailToUse }
    });

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      // Create a new user and client for manual entries
      const newUser = await prisma.user.create({
        data: {
          username: emailToUse,
          password: '', // Manual clients don't have passwords
          type: 'CLIENT'
        }
      });

      const newClient = await prisma.client.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
          email: emailToUse,
          phone: clientPhone || ''
        }
      });
      clientId = newClient.id;
    }

    // Find or create a service based on name
    let service = await prisma.service.findFirst({
      where: { name: serviceName }
    });

    if (!service) {
      // Create a generic service if it doesn't exist
      service = await prisma.service.create({
        data: {
          name: serviceName,
          icon: 'Briefcase'
        }
      });
    }

    const serviceId = service.id;

    // Create booking with time slots
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          contractorId,
          clientId,
          serviceId,
          serviceAddress,
          scheduledDate: scheduledDateObj,
          scheduledTime,
          estimatedDuration,
          price: price || null,
          status: BookingStatus.CONFIRMED // Manual bookings are auto-confirmed
        },
        include: {
          contractor: {
            select: {
              id: true,
              name: true
            }
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          service: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      // Calculate and create time slots
      const { jobSlots, travelSlots } = calculateJobSlots(scheduledTime, estimatedDuration, true);

      const dateObj = new Date(scheduledDateObj);
      dateObj.setHours(0, 0, 0, 0);

      const jobSlotRecords = jobSlots.map(slot => ({
        contractorId,
        date: dateObj,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotType: 'JOB' as const,
        bookingId: newBooking.id,
        reason: `Booking #${newBooking.id}`
      }));

      const travelSlotRecords = travelSlots.map(slot => ({
        contractorId,
        date: dateObj,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotType: 'TRAVEL' as const,
        reason: 'Travel time to next job'
      }));

      const allSlots = [...jobSlotRecords, ...travelSlotRecords];

      await Promise.all(
        allSlots.map(slot => tx.timeSlot.create({ data: slot }))
      );

      return newBooking;
    });

    return c.json({
      success: true,
      booking,
      message: 'Manual booking created successfully'
    });
  } catch (error) {
    console.error('Manual booking error:', error);
    return c.json({
      success: false,
      error: 'Failed to create manual booking'
    }, 500);
  }
});

// GET /api/bookings/client/:clientId - Get all bookings for a client
bookings.get('/bookings/client/:clientId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { clientId } = c.req.param();
    const { status } = c.req.query();

    const where: any = {
      clientId: parseInt(clientId)
    };

    if (status) {
      where.status = status as BookingStatus;
    }

    const bookingsList = await prisma.booking.findMany({
      where,
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            rating: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        completion: true
      },
      orderBy: {
        scheduledDate: 'desc'
      }
    });

    return c.json({
      success: true,
      bookings: bookingsList,
      count: bookingsList.length
    });
  } catch (error) {
    console.error('Get client bookings error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch bookings'
    }, 500);
  }
});

// GET /api/bookings/contractor/:contractorId - Get all bookings for a contractor
bookings.get('/bookings/contractor/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { status, date } = c.req.query();

    const where: any = {
      contractorId: parseInt(contractorId)
    };

    if (status) {
      where.status = status as BookingStatus;
    }

    if (date) {
      // Parse date without timezone shift
      const [year, month, day] = date.split('-').map(Number);
      const targetDate = new Date(year, month - 1, day);
      const nextDay = new Date(year, month - 1, day + 1);

      where.scheduledDate = {
        gte: targetDate,
        lt: nextDay
      };

      // Exclude cancelled bookings when filtering by date (for today's jobs view)
      if (!status) {
        where.status = {
          not: BookingStatus.CANCELLED
        };
      }
    }

    const bookingsList = await prisma.booking.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            address: true,
            city: true,
            state: true,
            zip: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        completion: true
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    });

    return c.json({
      success: true,
      bookings: bookingsList,
      count: bookingsList.length
    });
  } catch (error) {
    console.error('Get contractor bookings error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch bookings'
    }, 500);
  }
});

// GET /api/bookings/:id - Get booking by ID
bookings.get('/bookings/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            rating: true,
            reviewCount: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            address: true,
            city: true,
            state: true,
            zip: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true
          }
        },
        completion: true,
        photos: true,
        invoice: true
      }
    });

    if (!booking) {
      return c.json({
        success: false,
        error: 'Booking not found'
      }, 404);
    }

    return c.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch booking'
    }, 500);
  }
});

// PATCH /api/bookings/:id/status - Update booking status and optionally price
bookings.patch('/bookings/:id/status', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { status, price } = await c.req.json();

    if (!status || !Object.values(BookingStatus).includes(status)) {
      return c.json({
        success: false,
        error: 'Valid status is required'
      }, 400);
    }

    // Build update data object
    const updateData: any = { status };

    // Only update price if provided
    if (price !== undefined && price !== null) {
      updateData.price = parseFloat(price);
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        contractor: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Note: Availability is now calculated dynamically from confirmed bookings
    // No need to update availability records when booking status changes

    return c.json({
      success: true,
      booking,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return c.json({
      success: false,
      error: 'Failed to update booking status'
    }, 500);
  }
});

// PATCH /api/bookings/:id/schedule - Update booking schedule (time/date/duration)
bookings.patch('/bookings/:id/schedule', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { scheduledDate, scheduledTime, estimatedDuration } = await c.req.json();

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBooking) {
      return c.json({
        success: false,
        error: 'Booking not found'
      }, 404);
    }

    // Parse date without timezone shift if provided
    let scheduledDateObj: Date | undefined;
    if (scheduledDate) {
      const [year, month, day] = scheduledDate.split('-').map(Number);
      scheduledDateObj = new Date(year, month - 1, day);
    }

    // Update booking and time slots in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Update the booking
      const updatedBooking = await tx.booking.update({
        where: { id: parseInt(id) },
        data: {
          scheduledDate: scheduledDateObj || undefined,
          scheduledTime: scheduledTime || undefined,
          estimatedDuration: estimatedDuration || undefined
        },
        include: {
          contractor: {
            select: {
              id: true,
              name: true
            }
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          service: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      // Delete old time slots
      await tx.timeSlot.deleteMany({
        where: {
          OR: [
            { bookingId: parseInt(id) },
            { reason: `Booking #${id}` }
          ]
        }
      });

      // Create new time slots if we have the necessary data
      if (updatedBooking.scheduledTime && updatedBooking.estimatedDuration) {
        const startTime = updatedBooking.scheduledTime.split(' - ')[0] || updatedBooking.scheduledTime;
        const { jobSlots, travelSlots } = calculateJobSlots(
          startTime,
          updatedBooking.estimatedDuration,
          true
        );

        const dateObj = new Date(updatedBooking.scheduledDate);
        dateObj.setHours(0, 0, 0, 0);

        const jobSlotRecords = jobSlots.map(slot => ({
          contractorId: updatedBooking.contractorId,
          date: dateObj,
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotType: 'JOB' as const,
          bookingId: updatedBooking.id,
          reason: `Booking #${updatedBooking.id}`
        }));

        const travelSlotRecords = travelSlots.map(slot => ({
          contractorId: updatedBooking.contractorId,
          date: dateObj,
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotType: 'TRAVEL' as const,
          reason: 'Travel time to next job'
        }));

        const allSlots = [...jobSlotRecords, ...travelSlotRecords];

        await Promise.all(
          allSlots.map(slot => tx.timeSlot.create({ data: slot }))
        );
      }

      return updatedBooking;
    });

    return c.json({
      success: true,
      booking,
      message: 'Booking schedule and time slots updated successfully'
    });
  } catch (error) {
    console.error('Update booking schedule error:', error);
    return c.json({
      success: false,
      error: 'Failed to update booking schedule'
    }, 500);
  }
});

// PATCH /api/bookings/:id/address - Update booking service address
bookings.patch('/bookings/:id/address', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { serviceAddress } = await c.req.json();

    if (!serviceAddress || !serviceAddress.trim()) {
      return c.json({
        success: false,
        error: 'Service address is required'
      }, 400);
    }

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBooking) {
      return c.json({
        success: false,
        error: 'Booking not found'
      }, 404);
    }

    // Update booking address
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        serviceAddress: serviceAddress.trim()
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return c.json({
      success: true,
      booking,
      message: 'Booking address updated successfully'
    });
  } catch (error) {
    console.error('Update booking address error:', error);
    return c.json({
      success: false,
      error: 'Failed to update booking address'
    }, 500);
  }
});

// POST /api/bookings/:id/complete - Mark job as complete with details and generate invoice
bookings.post('/bookings/:id/complete', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const {
      startTime,
      endTime,
      materials,
      notes,
      laborCost = 0,
      materialsCost = 0,
      taxRate = 0 // Tax rate as percentage (e.g., 8.25 for 8.25%)
    } = await c.req.json();

    // Check if booking exists with related data
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: true,
        contractor: true,
        service: true
      }
    });

    if (!booking) {
      return c.json({
        success: false,
        error: 'Booking not found'
      }, 404);
    }

    // Calculate invoice amounts
    const subtotal = (laborCost || 0) + (materialsCost || 0);
    // If no costs provided, use the booking price as the amount
    const amount = subtotal > 0 ? subtotal : (booking.price || 0);
    const taxAmount = amount * (taxRate / 100);
    const totalAmount = amount + taxAmount;

    // Set due date to 30 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create job completion, invoice, and update booking status in transaction
    const result = await prisma.$transaction(async (tx) => {
      const completion = await tx.jobCompletion.create({
        data: {
          bookingId: parseInt(id),
          startTime: startTime ? new Date(startTime) : null,
          endTime: endTime ? new Date(endTime) : null,
          materials,
          notes
        }
      });

      // Create the invoice
      const invoice = await tx.invoice.create({
        data: {
          bookingId: parseInt(id),
          amount,
          taxAmount: taxAmount > 0 ? taxAmount : null,
          totalAmount,
          status: 'PENDING',
          dueDate
        }
      });

      const updatedBooking = await tx.booking.update({
        where: { id: parseInt(id) },
        data: { status: BookingStatus.COMPLETED },
        include: {
          client: true,
          service: true,
          invoice: true
        }
      });

      return { completion, invoice, booking: updatedBooking };
    });

    return c.json({
      success: true,
      completion: result.completion,
      invoice: result.invoice,
      booking: result.booking,
      message: 'Job marked as complete and invoice generated'
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    return c.json({
      success: false,
      error: 'Failed to complete booking'
    }, 500);
  }
});

// DELETE /api/bookings/:id - Cancel/delete a booking
bookings.delete('/bookings/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    // Check if booking exists first
    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBooking) {
      return c.json({
        success: false,
        error: 'Booking not found'
      }, 404);
    }

    if (existingBooking.status === BookingStatus.CANCELLED) {
      return c.json({
        success: true,
        message: 'Booking is already cancelled',
        booking: existingBooking
      });
    }

    // Update booking and delete time slots in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Delete associated time slots
      await tx.timeSlot.deleteMany({
        where: {
          OR: [
            { bookingId: parseInt(id) },
            { reason: `Booking #${id}` }
          ]
        }
      });

      // Mark booking as cancelled
      return await tx.booking.update({
        where: { id: parseInt(id) },
        data: { status: BookingStatus.CANCELLED }
      });
    });

    return c.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return c.json({
      success: false,
      error: 'Failed to cancel booking'
    }, 500);
  }
});

// DELETE /api/bookings/:id/permanent - Permanently delete a booking
bookings.delete('/bookings/:id/permanent', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    // Check if booking exists first
    const existingBooking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBooking) {
      return c.json({
        success: false,
        error: 'Booking not found'
      }, 404);
    }

    // Delete in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete associated time slots
      await tx.timeSlot.deleteMany({
        where: {
          OR: [
            { bookingId: parseInt(id) },
            { reason: `Booking #${id}` }
          ]
        }
      });

      // Delete associated completion record if exists
      await tx.jobCompletion.deleteMany({
        where: { bookingId: parseInt(id) }
      });

      // Delete the booking
      await tx.booking.delete({
        where: { id: parseInt(id) }
      });
    });

    return c.json({
      success: true,
      message: 'Booking permanently deleted'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete booking'
    }, 500);
  }
});

// ============================================
// INVOICE ENDPOINTS
// ============================================

// GET /api/invoices/contractor/:contractorId - Get all invoices for a contractor
bookings.get('/invoices/contractor/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { status } = c.req.query();

    const where: any = {
      booking: {
        contractorId: parseInt(contractorId)
      }
    };

    if (status && ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].includes(status)) {
      where.status = status;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        booking: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            },
            service: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return c.json({
      success: true,
      invoices
    });
  } catch (error) {
    console.error('Fetch invoices error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch invoices'
    }, 500);
  }
});

// PATCH /api/invoices/:id/status - Update invoice status (e.g., mark as paid)
bookings.patch('/invoices/:id/status', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { status } = await c.req.json();

    if (!status || !['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].includes(status)) {
      return c.json({
        success: false,
        error: 'Invalid status. Must be PENDING, PAID, OVERDUE, or CANCELLED'
      }, 400);
    }

    const updateData: any = { status };

    // If marking as paid, set paidAt timestamp
    if (status === 'PAID') {
      updateData.paidAt = new Date();
    }

    const invoice = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        booking: {
          include: {
            client: true,
            service: true
          }
        }
      }
    });

    return c.json({
      success: true,
      invoice,
      message: `Invoice marked as ${status.toLowerCase()}`
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    return c.json({
      success: false,
      error: 'Failed to update invoice status'
    }, 500);
  }
});

export default bookings;
