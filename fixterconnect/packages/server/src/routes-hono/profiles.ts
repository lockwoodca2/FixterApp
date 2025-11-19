import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const profiles = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/client/:id - Get client profile
profiles.get('/client/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        }
      }
    });

    if (!client) {
      return c.json({
        success: false,
        error: 'Client not found'
      }, 404);
    }

    return c.json({
      success: true,
      client
    });
  } catch (error) {
    console.error('Get client profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch client profile'
    }, 500);
  }
});

// PUT /api/client/:id - Update client profile
profiles.put('/client/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      notificationEmail,
      notificationSms
    } = await c.req.json();

    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zip !== undefined) updateData.zip = zip;
    if (notificationEmail !== undefined) updateData.notificationEmail = notificationEmail;
    if (notificationSms !== undefined) updateData.notificationSms = notificationSms;

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return c.json({
      success: true,
      client,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update client profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to update profile'
    }, 500);
  }
});

// GET /api/contractor/:id - Get contractor profile
profiles.get('/contractor/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                icon: true,
                description: true
              }
            }
          }
        },
        reviews: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    // Calculate trust signals
    const contractorId = parseInt(id);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

    // Get total jobs completed
    const jobsCompleted = await prisma.booking.count({
      where: {
        contractorId,
        status: 'COMPLETED'
      }
    });

    // Get jobs completed in last 45 days for Rising Star badge
    const recentJobsCompleted = await prisma.booking.count({
      where: {
        contractorId,
        status: 'COMPLETED',
        updatedAt: {
          gte: fortyFiveDaysAgo
        }
      }
    });

    // Get last booking date
    const lastBooking = await prisma.booking.findFirst({
      where: {
        contractorId,
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        createdAt: true
      }
    });

    // Calculate average response time (hours) from bookings created to confirmed
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        contractorId,
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
        }
      },
      select: {
        createdAt: true,
        updatedAt: true
      },
      take: 20 // Last 20 bookings for average
    });

    let avgResponseHours = null;
    if (confirmedBookings.length > 0) {
      const totalHours = confirmedBookings.reduce((sum, booking) => {
        const diffMs = booking.updatedAt.getTime() - booking.createdAt.getTime();
        return sum + (diffMs / (1000 * 60 * 60)); // Convert ms to hours
      }, 0);
      avgResponseHours = Math.round(totalHours / confirmedBookings.length);
    }

    // Calculate badge eligibility
    const accountAge = now.getTime() - contractor.createdAt.getTime();
    const daysSinceJoined = Math.floor(accountAge / (24 * 60 * 60 * 1000));

    const isJustJoined = daysSinceJoined <= 30;
    const isRisingStar = recentJobsCompleted >= 1 && recentJobsCompleted <= 5;

    return c.json({
      success: true,
      contractor: {
        ...contractor,
        trustSignals: {
          jobsCompleted,
          lastBookedAt: lastBooking?.createdAt || null,
          avgResponseHours,
          verified: contractor.verified,
          licensed: contractor.licensed,
          insured: contractor.insured,
          afterHoursAvailable: contractor.afterHoursAvailable,
          isJustJoined,
          isRisingStar
        }
      }
    });
  } catch (error) {
    console.error('Get contractor profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractor profile'
    }, 500);
  }
});

// PUT /api/contractor/:id - Update contractor profile
profiles.put('/contractor/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const {
      name,
      email,
      phone,
      description,
      yearsInBusiness,
      location,
      googleBusinessUrl,
      verified,
      licensed,
      insured,
      afterHoursAvailable
    } = await c.req.json();

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (description !== undefined) updateData.description = description;
    if (yearsInBusiness !== undefined) updateData.yearsInBusiness = yearsInBusiness;
    if (location !== undefined) updateData.location = location;
    if (googleBusinessUrl !== undefined) updateData.googleBusinessUrl = googleBusinessUrl;
    if (verified !== undefined) updateData.verified = verified;
    if (licensed !== undefined) updateData.licensed = licensed;
    if (insured !== undefined) updateData.insured = insured;
    if (afterHoursAvailable !== undefined) updateData.afterHoursAvailable = afterHoursAvailable;

    const contractor = await prisma.contractor.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return c.json({
      success: true,
      contractor,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update contractor profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to update profile'
    }, 500);
  }
});

// GET /api/contractor/:id/availability - Get contractor availability
profiles.get('/contractor/:id/availability', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { startDate, endDate } = c.req.query();

    const where: any = {
      contractorId: parseInt(id)
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const availability = await prisma.availability.findMany({
      where,
      orderBy: {
        date: 'asc'
      }
    });

    return c.json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch availability'
    }, 500);
  }
});

// POST /api/contractor/:id/availability - Add availability slot
profiles.post('/contractor/:id/availability', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { date, startTime, endTime, isAvailable } = await c.req.json();

    if (!date || !startTime || !endTime) {
      return c.json({
        success: false,
        error: 'Date, start time, and end time are required'
      }, 400);
    }

    const availability = await prisma.availability.create({
      data: {
        contractorId: parseInt(id),
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true
      }
    });

    return c.json({
      success: true,
      availability,
      message: 'Availability added successfully'
    }, 201);
  } catch (error) {
    console.error('Add availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to add availability'
    }, 500);
  }
});

// DELETE /api/contractor/availability/:availabilityId - Delete availability slot
profiles.delete('/contractor/availability/:availabilityId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { availabilityId } = c.req.param();

    await prisma.availability.delete({
      where: { id: parseInt(availabilityId) }
    });

    return c.json({
      success: true,
      message: 'Availability deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete availability'
    }, 500);
  }
});

export default profiles;
