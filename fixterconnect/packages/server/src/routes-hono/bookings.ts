import { Hono } from 'hono';
import { BookingStatus } from '@prisma/client';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

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
      price
    } = await c.req.json();

    // Validate required fields
    if (!contractorId || !clientId || !serviceId || !serviceAddress || !scheduledDate || !scheduledTime) {
      return c.json({
        success: false,
        error: 'All booking fields are required'
      }, 400);
    }

    // Verify contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
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

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        contractorId,
        clientId,
        serviceId,
        serviceAddress,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
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

    return c.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    }, 201);
  } catch (error) {
    console.error('Create booking error:', error);
    return c.json({
      success: false,
      error: 'Failed to create booking'
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
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      where.scheduledDate = {
        gte: targetDate,
        lt: nextDay
      };
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

// POST /api/bookings/:id/complete - Mark job as complete with details
bookings.post('/bookings/:id/complete', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { startTime, endTime, materials, notes } = await c.req.json();

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return c.json({
        success: false,
        error: 'Booking not found'
      }, 404);
    }

    // Create job completion and update booking status in transaction
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

      const updatedBooking = await tx.booking.update({
        where: { id: parseInt(id) },
        data: { status: BookingStatus.COMPLETED }
      });

      return { completion, booking: updatedBooking };
    });

    return c.json({
      success: true,
      completion: result.completion,
      message: 'Job marked as complete'
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

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: BookingStatus.CANCELLED }
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

export default bookings;
