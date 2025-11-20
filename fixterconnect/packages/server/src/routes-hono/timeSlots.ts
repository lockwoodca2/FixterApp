import { Hono } from 'hono';
import type { PrismaClient } from '@prisma/client/edge';
import type { Env } from '../worker';
import {
  calculateJobSlots,
  hasConflict,
  findNextAvailableSlot,
  getConflictingSlots,
  TimeRange,
  TimeSlot
} from '../utils/timeSlots';

type Variables = {
  prisma: PrismaClient;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

/**
 * GET /api/time-slots/contractor/:contractorId/date/:date
 * Get all time slots for a contractor on a specific date
 */
app.get('/contractor/:contractorId/date/:date', async (c) => {
  try {
    const prisma = c.get('prisma');
    const contractorId = parseInt(c.req.param('contractorId'));
    const dateParam = c.req.param('date');

    const date = new Date(dateParam);
    date.setHours(0, 0, 0, 0);

    const slots = await prisma.timeSlot.findMany({
      where: {
        contractorId,
        date: {
          gte: date,
          lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return c.json({ success: true, slots });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return c.json({ success: false, error: 'Failed to fetch time slots' }, 500);
  }
});

/**
 * POST /api/time-slots/check-availability-batch
 * Check multiple time slots at once for availability
 */
app.post('/check-availability-batch', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, date, timeSlots, durationMinutes } = await c.req.json();

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // Get all existing slots for this date once
    const existingSlots = await prisma.timeSlot.findMany({
      where: {
        contractorId,
        date: {
          gte: dateObj,
          lt: new Date(dateObj.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    const existingTimeRanges = existingSlots.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime
    }));

    // Check each time slot
    const results = timeSlots.map((startTime: string) => {
      const { jobSlots, travelSlots } = calculateJobSlots(startTime, durationMinutes, true);
      const allProposedSlots = [...jobSlots, ...travelSlots];

      // Check for conflicts
      const hasAnyConflict = allProposedSlots.some(proposedSlot => {
        const conflictingSlots = getConflictingSlots(
          proposedSlot.startTime,
          proposedSlot.endTime,
          existingSlots.map(s => ({
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
            slotType: s.slotType as 'JOB' | 'TRAVEL' | 'BLOCKED',
            bookingId: s.bookingId || undefined,
            reason: s.reason || undefined
          }))
        );
        return conflictingSlots.length > 0;
      });

      return {
        startTime,
        isAvailable: !hasAnyConflict
      };
    });

    return c.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error checking batch availability:', error);
    return c.json({ success: false, error: 'Failed to check availability' }, 500);
  }
});

/**
 * POST /api/time-slots/check-availability
 * Check if a time slot is available and find conflicts
 */
app.post('/check-availability', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, date, startTime, durationMinutes, excludeBookingId } = await c.req.json();

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // Build where clause to exclude current booking if provided
    const whereClause: any = {
      contractorId,
      date: {
        gte: dateObj,
        lt: new Date(dateObj.getTime() + 24 * 60 * 60 * 1000)
      }
    };

    // Exclude slots for the current booking being edited
    if (excludeBookingId) {
      whereClause.NOT = {
        bookingId: excludeBookingId
      };
    }

    // Get existing slots for this date
    const existingSlots = await prisma.timeSlot.findMany({
      where: whereClause,
      orderBy: {
        startTime: 'asc'
      }
    });

    // Calculate proposed job slots including travel time
    const { jobSlots, travelSlots } = calculateJobSlots(startTime, durationMinutes, true);
    const allProposedSlots = [...jobSlots, ...travelSlots];

    // Check for conflicts
    const conflicts: typeof existingSlots = [];
    for (const proposedSlot of allProposedSlots) {
      const conflictingSlots = getConflictingSlots(
        proposedSlot.startTime,
        proposedSlot.endTime,
        existingSlots.map(s => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          slotType: s.slotType as 'JOB' | 'TRAVEL' | 'BLOCKED',
          bookingId: s.bookingId || undefined,
          reason: s.reason || undefined
        }))
      );
      conflicts.push(...conflictingSlots.map(c => existingSlots.find(
        s => s.startTime === c.startTime && s.endTime === c.endTime
      )!).filter(Boolean));
    }

    const isAvailable = conflicts.length === 0;

    // If not available, find next available slot
    let nextAvailable = null;
    if (!isAvailable) {
      const existingTimeRanges: TimeRange[] = existingSlots.map(s => ({
        startTime: s.startTime,
        endTime: s.endTime
      }));

      nextAvailable = findNextAvailableSlot(
        startTime,
        durationMinutes,
        '08:00',
        '17:00',
        existingTimeRanges
      );
    }

    return c.json({
      success: true,
      isAvailable,
      conflicts: conflicts.map(c => ({
        id: c.id,
        startTime: c.startTime,
        endTime: c.endTime,
        slotType: c.slotType,
        bookingId: c.bookingId,
        reason: c.reason
      })),
      nextAvailable,
      proposedSlots: allProposedSlots
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return c.json({ success: false, error: 'Failed to check availability' }, 500);
  }
});

/**
 * POST /api/time-slots/create
 * Create time slots for a booking
 */
app.post('/create', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, bookingId, date, startTime, durationMinutes } = await c.req.json();

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // Calculate job and travel slots
    const { jobSlots, travelSlots } = calculateJobSlots(startTime, durationMinutes, true);

    // Create job slots
    const jobSlotRecords = jobSlots.map(slot => ({
      contractorId,
      date: dateObj,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotType: 'JOB' as const,
      bookingId,
      reason: `Booking #${bookingId}`
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

    // Create all slots in a transaction
    const createdSlots = await prisma.$transaction(
      allSlots.map(slot => prisma.timeSlot.create({ data: slot }))
    );

    return c.json({ success: true, slots: createdSlots });
  } catch (error) {
    console.error('Error creating time slots:', error);
    return c.json({ success: false, error: 'Failed to create time slots' }, 500);
  }
});

/**
 * DELETE /api/time-slots/booking/:bookingId
 * Delete all time slots associated with a booking
 */
app.delete('/booking/:bookingId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const bookingId = parseInt(c.req.param('bookingId'));

    await prisma.timeSlot.deleteMany({
      where: {
        OR: [
          { bookingId },
          { reason: `Booking #${bookingId}` }
        ]
      }
    });

    return c.json({ success: true, message: 'Time slots deleted' });
  } catch (error) {
    console.error('Error deleting time slots:', error);
    return c.json({ success: false, error: 'Failed to delete time slots' }, 500);
  }
});

/**
 * PUT /api/time-slots/booking/:bookingId
 * Update time slots for a booking (delete old, create new)
 */
app.put('/booking/:bookingId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const bookingId = parseInt(c.req.param('bookingId'));
    const { contractorId, date, startTime, durationMinutes } = await c.req.json();

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // Delete existing slots
    await prisma.timeSlot.deleteMany({
      where: {
        OR: [
          { bookingId },
          { reason: `Booking #${bookingId}` }
        ]
      }
    });

    // Create new slots
    const { jobSlots, travelSlots } = calculateJobSlots(startTime, durationMinutes, true);

    const jobSlotRecords = jobSlots.map(slot => ({
      contractorId,
      date: dateObj,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotType: 'JOB' as const,
      bookingId,
      reason: `Booking #${bookingId}`
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

    const createdSlots = await prisma.$transaction(
      allSlots.map(slot => prisma.timeSlot.create({ data: slot }))
    );

    return c.json({ success: true, slots: createdSlots });
  } catch (error) {
    console.error('Error updating time slots:', error);
    return c.json({ success: false, error: 'Failed to update time slots' }, 500);
  }
});

export default app;
