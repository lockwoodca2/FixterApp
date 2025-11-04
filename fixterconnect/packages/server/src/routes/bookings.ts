import express, { Request, Response, Router } from 'express';
import prisma from '../lib/prisma.js';
import { BookingStatus } from '@prisma/client';

const router: Router = express.Router();

// POST /api/bookings - Create a new booking
router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const {
      contractorId,
      clientId,
      serviceId,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      price
    } = req.body;

    // Validate required fields
    if (!contractorId || !clientId || !serviceId || !serviceAddress || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        error: 'All booking fields are required'
      });
    }

    // Verify contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
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

    return res.status(201).json({
      success: true,
      booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// GET /api/bookings/client/:clientId - Get all bookings for a client
router.get('/bookings/client/:clientId', async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const { status } = req.query;

    const where: any = {
      clientId: parseInt(clientId)
    };

    if (status) {
      where.status = status as BookingStatus;
    }

    const bookings = await prisma.booking.findMany({
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

    return res.json({
      success: true,
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get client bookings error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// GET /api/bookings/contractor/:contractorId - Get all bookings for a contractor
router.get('/bookings/contractor/:contractorId', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;
    const { status, date } = req.query;

    const where: any = {
      contractorId: parseInt(contractorId)
    };

    if (status) {
      where.status = status as BookingStatus;
    }

    if (date) {
      const targetDate = new Date(date as string);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      where.scheduledDate = {
        gte: targetDate,
        lt: nextDay
      };
    }

    const bookings = await prisma.booking.findMany({
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

    return res.json({
      success: true,
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get contractor bookings error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// GET /api/bookings/:id - Get booking by ID
router.get('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    return res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// PATCH /api/bookings/:id/status - Update booking status and optionally price
router.patch('/bookings/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, price } = req.body;

    if (!status || !Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required'
      });
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

    return res.json({
      success: true,
      booking,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
});

// POST /api/bookings/:id/complete - Mark job as complete with details
router.post('/bookings/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, materials, notes } = req.body;

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
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

    return res.json({
      success: true,
      completion: result.completion,
      message: 'Job marked as complete'
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete booking'
    });
  }
});

// DELETE /api/bookings/:id - Cancel/delete a booking
router.delete('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: BookingStatus.CANCELLED }
    });

    return res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to cancel booking'
    });
  }
});

export default router;
