import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';
import {
  getContractorAvailability,
  getContractorAvailabilityRange,
  canAcceptBooking,
  getNextAvailableDate
} from '../utils/availability-edge.js';

type Variables = {
  prisma: PrismaClient;
};

const availability = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/availability/contractor/:contractorId/date/:date - Get availability for specific date
availability.get('/availability/contractor/:contractorId/date/:date', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, date } = c.req.param();
    const targetDate = new Date(date);

    const availabilityData = await getContractorAvailability(
      prisma,
      parseInt(contractorId),
      targetDate
    );

    return c.json({
      success: true,
      availability: availabilityData
    });
  } catch (error) {
    console.error('Get contractor availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch availability'
    }, 500);
  }
});

// GET /api/availability/contractor/:contractorId/range - Get availability for date range
availability.get('/availability/contractor/:contractorId/range', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { startDate, endDate } = c.req.query();

    if (!startDate || !endDate) {
      return c.json({
        success: false,
        error: 'Start date and end date are required'
      }, 400);
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const availabilities = await getContractorAvailabilityRange(
      prisma,
      parseInt(contractorId),
      start,
      end
    );

    return c.json({
      success: true,
      availabilities,
      count: availabilities.length
    });
  } catch (error) {
    console.error('Get contractor availability range error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch availability range'
    }, 500);
  }
});

// GET /api/availability/contractor/:contractorId/next - Get next available date
availability.get('/availability/contractor/:contractorId/next', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { startDate, maxDays } = c.req.query();

    const start = startDate ? new Date(startDate as string) : new Date();
    const maxDaysAhead = maxDays ? parseInt(maxDays as string) : 30;

    const nextAvailable = await getNextAvailableDate(
      prisma,
      parseInt(contractorId),
      start,
      maxDaysAhead
    );

    if (!nextAvailable) {
      return c.json({
        success: true,
        available: false,
        message: `No availability found in the next ${maxDaysAhead} days`
      });
    }

    return c.json({
      success: true,
      available: true,
      date: nextAvailable
    });
  } catch (error) {
    console.error('Get next available date error:', error);
    return c.json({
      success: false,
      error: 'Failed to find next available date'
    }, 500);
  }
});

// POST /api/availability/contractor/:contractorId/check - Check if booking can be accepted
availability.post('/availability/contractor/:contractorId/check', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { date } = await c.req.json();

    if (!date) {
      return c.json({
        success: false,
        error: 'Date is required'
      }, 400);
    }

    const targetDate = new Date(date);
    const canBook = await canAcceptBooking(prisma, parseInt(contractorId), targetDate);

    return c.json({
      success: true,
      canBook,
      date: targetDate
    });
  } catch (error) {
    console.error('Check booking availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to check booking availability'
    }, 500);
  }
});

// GET /api/availability/contractor/:contractorId/schedule - Get contractor's general schedule
availability.get('/availability/contractor/:contractorId/schedule', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    const schedule = await prisma.availability.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: true
      },
      orderBy: {
        dayOfWeek: 'asc'
      }
    });

    // Get service areas for each day
    const serviceAreas = await prisma.contractorServiceArea.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isActive: true
      }
    });

    // Group service areas by day of week
    const areasByDay: { [key: number]: string[] } = {};
    serviceAreas.forEach(sa => {
      if (sa.dayOfWeek !== null) {
        if (!areasByDay[sa.dayOfWeek]) {
          areasByDay[sa.dayOfWeek] = [];
        }
        areasByDay[sa.dayOfWeek].push(sa.area);
      }
    });

    // Add service areas to schedule
    const scheduleWithAreas = schedule.map(entry => ({
      ...entry,
      serviceAreas: areasByDay[entry.dayOfWeek || 0] || []
    }));

    return c.json({
      success: true,
      schedule: scheduleWithAreas
    });
  } catch (error) {
    console.error('Get contractor schedule error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractor schedule'
    }, 500);
  }
});

// POST /api/availability/contractor/:contractorId/schedule - Set contractor's general schedule
availability.post('/availability/contractor/:contractorId/schedule', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { schedule } = await c.req.json();

    if (!Array.isArray(schedule)) {
      return c.json({
        success: false,
        error: 'Schedule must be an array'
      }, 400);
    }

    // Delete existing recurring schedule
    await prisma.availability.deleteMany({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: true
      }
    });

    // Delete existing service areas
    await prisma.contractorServiceArea.deleteMany({
      where: {
        contractorId: parseInt(contractorId)
      }
    });

    // Create new schedule entries
    const created = await prisma.availability.createMany({
      data: schedule.map((entry: any) => ({
        contractorId: parseInt(contractorId),
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        maxBookings: entry.maxBookings || 8,
        isAvailable: entry.isAvailable !== false,
        isRecurring: true
      }))
    });

    // Create service area entries for each day
    const serviceAreaData: any[] = [];
    schedule.forEach((entry: any) => {
      if (entry.serviceAreas && Array.isArray(entry.serviceAreas)) {
        entry.serviceAreas.forEach((area: string) => {
          serviceAreaData.push({
            contractorId: parseInt(contractorId),
            dayOfWeek: entry.dayOfWeek,
            area: area,
            isActive: true
          });
        });
      }
    });

    let serviceAreasCreated = 0;
    if (serviceAreaData.length > 0) {
      const result = await prisma.contractorServiceArea.createMany({
        data: serviceAreaData
      });
      serviceAreasCreated = result.count;
    }

    return c.json({
      success: true,
      message: 'Schedule and service areas updated successfully',
      scheduleCount: created.count,
      serviceAreasCount: serviceAreasCreated
    });
  } catch (error) {
    console.error('Update contractor schedule error:', error);
    return c.json({
      success: false,
      error: 'Failed to update schedule'
    }, 500);
  }
});

// POST /api/availability/contractor/:contractorId/override - Add specific date override
availability.post('/availability/contractor/:contractorId/override', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { specificDate, startTime, endTime, maxBookings, isAvailable, reason } = await c.req.json();

    if (!specificDate) {
      return c.json({
        success: false,
        error: 'Date is required'
      }, 400);
    }

    const targetDate = new Date(specificDate);
    targetDate.setHours(0, 0, 0, 0);

    // Check if override already exists
    const existing = await prisma.availability.findFirst({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: false,
        specificDate: targetDate
      }
    });

    if (existing) {
      // Update existing override
      const updated = await prisma.availability.update({
        where: { id: existing.id },
        data: {
          startTime: startTime || existing.startTime,
          endTime: endTime || existing.endTime,
          maxBookings: maxBookings || existing.maxBookings,
          isAvailable: isAvailable !== undefined ? isAvailable : existing.isAvailable,
          reason: reason !== undefined ? reason : existing.reason
        }
      });

      return c.json({
        success: true,
        message: 'Date override updated',
        override: updated
      });
    }

    // Create new override
    const override = await prisma.availability.create({
      data: {
        contractorId: parseInt(contractorId),
        specificDate: targetDate,
        startTime: startTime || '08:00',
        endTime: endTime || '17:00',
        maxBookings: maxBookings || 8,
        isAvailable: isAvailable !== false,
        isRecurring: false,
        reason: reason || null
      }
    });

    return c.json({
      success: true,
      message: 'Date override created',
      override
    });
  } catch (error) {
    console.error('Create date override error:', error);
    return c.json({
      success: false,
      error: 'Failed to create date override'
    }, 500);
  }
});

// DELETE /api/availability/contractor/:contractorId/override/:overrideId - Delete specific date override
availability.delete('/availability/contractor/:contractorId/override/:overrideId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, overrideId } = c.req.param();

    // Verify the override exists and belongs to this contractor
    const existing = await prisma.availability.findFirst({
      where: {
        id: parseInt(overrideId),
        contractorId: parseInt(contractorId),
        isRecurring: false
      }
    });

    if (!existing) {
      return c.json({
        success: false,
        error: 'Override not found'
      }, 404);
    }

    // Delete the override
    await prisma.availability.delete({
      where: { id: parseInt(overrideId) }
    });

    return c.json({
      success: true,
      message: 'Override deleted successfully'
    });
  } catch (error) {
    console.error('Delete date override error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete date override'
    }, 500);
  }
});

// GET /api/availability/contractor/:contractorId/overrides - Get date overrides for a date range
availability.get('/availability/contractor/:contractorId/overrides', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { startDate, endDate } = c.req.query();

    if (!startDate || !endDate) {
      return c.json({
        success: false,
        error: 'startDate and endDate are required'
      }, 400);
    }

    const start = new Date(startDate as string);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    const overrides = await prisma.availability.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: false,
        specificDate: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        specificDate: 'asc'
      }
    });

    // Format dates for frontend
    const formattedOverrides = overrides.map(override => ({
      ...override,
      specificDate: override.specificDate?.toISOString().split('T')[0]
    }));

    return c.json({
      success: true,
      overrides: formattedOverrides
    });
  } catch (error) {
    console.error('Fetch date overrides error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch date overrides'
    }, 500);
  }
});

export default availability;
