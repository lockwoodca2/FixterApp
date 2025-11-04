import express, { Request, Response, Router } from 'express';
import prisma from '../lib/prisma.js';
import {
  getContractorAvailability,
  getContractorAvailabilityRange,
  canAcceptBooking,
  getNextAvailableDate
} from '../utils/availability.js';

const router: Router = express.Router();

// GET /api/availability/contractor/:contractorId/date/:date - Get availability for specific date
router.get('/availability/contractor/:contractorId/date/:date', async (req: Request, res: Response) => {
  try {
    const { contractorId, date } = req.params;
    const targetDate = new Date(date);

    const availability = await getContractorAvailability(parseInt(contractorId), targetDate);

    return res.json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Get contractor availability error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch availability'
    });
  }
});

// GET /api/availability/contractor/:contractorId/range - Get availability for date range
router.get('/availability/contractor/:contractorId/range', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const availabilities = await getContractorAvailabilityRange(
      parseInt(contractorId),
      start,
      end
    );

    return res.json({
      success: true,
      availabilities,
      count: availabilities.length
    });
  } catch (error) {
    console.error('Get contractor availability range error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch availability range'
    });
  }
});

// GET /api/availability/contractor/:contractorId/next - Get next available date
router.get('/availability/contractor/:contractorId/next', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;
    const { startDate, maxDays } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    const maxDaysAhead = maxDays ? parseInt(maxDays as string) : 30;

    const nextAvailable = await getNextAvailableDate(
      parseInt(contractorId),
      start,
      maxDaysAhead
    );

    if (!nextAvailable) {
      return res.json({
        success: true,
        available: false,
        message: `No availability found in the next ${maxDaysAhead} days`
      });
    }

    return res.json({
      success: true,
      available: true,
      date: nextAvailable
    });
  } catch (error) {
    console.error('Get next available date error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to find next available date'
    });
  }
});

// POST /api/availability/contractor/:contractorId/check - Check if booking can be accepted
router.post('/availability/contractor/:contractorId/check', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const targetDate = new Date(date);
    const canBook = await canAcceptBooking(parseInt(contractorId), targetDate);

    return res.json({
      success: true,
      canBook,
      date: targetDate
    });
  } catch (error) {
    console.error('Check booking availability error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check booking availability'
    });
  }
});

// GET /api/availability/contractor/:contractorId/schedule - Get contractor's general schedule
router.get('/availability/contractor/:contractorId/schedule', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;

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

    return res.json({
      success: true,
      schedule: scheduleWithAreas
    });
  } catch (error) {
    console.error('Get contractor schedule error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contractor schedule'
    });
  }
});

// POST /api/availability/contractor/:contractorId/schedule - Set contractor's general schedule
router.post('/availability/contractor/:contractorId/schedule', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;
    const { schedule } = req.body;

    if (!Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        error: 'Schedule must be an array'
      });
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

    return res.json({
      success: true,
      message: 'Schedule and service areas updated successfully',
      scheduleCount: created.count,
      serviceAreasCount: serviceAreasCreated
    });
  } catch (error) {
    console.error('Update contractor schedule error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update schedule'
    });
  }
});

// POST /api/availability/contractor/:contractorId/override - Add specific date override
router.post('/availability/contractor/:contractorId/override', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;
    const { specificDate, startTime, endTime, maxBookings, isAvailable } = req.body;

    if (!specificDate) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
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
          isAvailable: isAvailable !== undefined ? isAvailable : existing.isAvailable
        }
      });

      return res.json({
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
        isRecurring: false
      }
    });

    return res.json({
      success: true,
      message: 'Date override created',
      override
    });
  } catch (error) {
    console.error('Create date override error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create date override'
    });
  }
});

// GET /api/availability/contractor/:contractorId/overrides - Get date overrides for a date range
router.get('/availability/contractor/:contractorId/overrides', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
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

    return res.json({
      success: true,
      overrides: formattedOverrides
    });
  } catch (error) {
    console.error('Fetch date overrides error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch date overrides'
    });
  }
});

export default router;
