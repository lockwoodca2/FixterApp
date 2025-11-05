import { BookingStatus } from '@prisma/client';
import type { PrismaClient } from '@prisma/client/edge';

/**
 * Calculate available booking slots for a contractor on a specific date
 *
 * This function dynamically calculates availability by:
 * 1. Checking contractor's general schedule for that day of week
 * 2. Checking for specific date overrides (vacation, holidays)
 * 3. Counting confirmed bookings for that date
 * 4. Calculating remaining slots
 */
export async function getContractorAvailability(
  prisma: PrismaClient,
  contractorId: number,
  date: Date
) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  // Check for specific date override first (vacation, holiday, etc.)
  const specificOverride = await prisma.availability.findFirst({
    where: {
      contractorId,
      isRecurring: false,
      specificDate: dateOnly
    }
  });

  // If there's a specific date override, use it
  if (specificOverride) {
    if (!specificOverride.isAvailable) {
      return {
        date: dateOnly,
        dayOfWeek,
        isAvailable: false,
        reason: 'Contractor unavailable on this date',
        availableSlots: 0,
        maxBookings: 0,
        confirmedBookings: 0,
        startTime: null,
        endTime: null
      };
    }

    // Count confirmed bookings for this date
    const confirmedBookings = await prisma.booking.count({
      where: {
        contractorId,
        scheduledDate: dateOnly,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS]
        }
      }
    });

    const availableSlots = specificOverride.maxBookings - confirmedBookings;

    return {
      date: dateOnly,
      dayOfWeek,
      isAvailable: availableSlots > 0,
      reason: availableSlots > 0 ? 'Available' : 'Fully booked',
      availableSlots,
      maxBookings: specificOverride.maxBookings,
      confirmedBookings,
      startTime: specificOverride.startTime,
      endTime: specificOverride.endTime
    };
  }

  // No specific override - check general recurring schedule
  const generalSchedule = await prisma.availability.findFirst({
    where: {
      contractorId,
      isRecurring: true,
      dayOfWeek
    }
  });

  // If no schedule defined for this day of week, contractor is unavailable
  if (!generalSchedule || !generalSchedule.isAvailable) {
    return {
      date: dateOnly,
      dayOfWeek,
      isAvailable: false,
      reason: 'Contractor does not work on this day',
      availableSlots: 0,
      maxBookings: 0,
      confirmedBookings: 0,
      startTime: null,
      endTime: null
    };
  }

  // Count confirmed bookings for this date
  const confirmedBookings = await prisma.booking.count({
    where: {
      contractorId,
      scheduledDate: dateOnly,
      status: {
        in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS]
      }
    }
  });

  const availableSlots = generalSchedule.maxBookings - confirmedBookings;

  return {
    date: dateOnly,
    dayOfWeek,
    isAvailable: availableSlots > 0,
    reason: availableSlots > 0 ? 'Available' : 'Fully booked',
    availableSlots,
    maxBookings: generalSchedule.maxBookings,
    confirmedBookings,
    startTime: generalSchedule.startTime,
    endTime: generalSchedule.endTime
  };
}

/**
 * Get availability for a contractor across a date range
 */
export async function getContractorAvailabilityRange(
  prisma: PrismaClient,
  contractorId: number,
  startDate: Date,
  endDate: Date
) {
  const availabilities = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (currentDate <= end) {
    const availability = await getContractorAvailability(prisma, contractorId, new Date(currentDate));
    availabilities.push(availability);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availabilities;
}

/**
 * Check if a contractor can accept a booking on a specific date
 */
export async function canAcceptBooking(
  prisma: PrismaClient,
  contractorId: number,
  date: Date
): Promise<boolean> {
  const availability = await getContractorAvailability(prisma, contractorId, date);
  return availability.isAvailable && availability.availableSlots > 0;
}

/**
 * Get next available date for a contractor
 */
export async function getNextAvailableDate(
  prisma: PrismaClient,
  contractorId: number,
  startDate: Date = new Date(),
  maxDaysAhead: number = 30
): Promise<Date | null> {
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < maxDaysAhead; i++) {
    const availability = await getContractorAvailability(prisma, contractorId, currentDate);
    if (availability.isAvailable && availability.availableSlots > 0) {
      return new Date(currentDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return null; // No availability found in next maxDaysAhead days
}
