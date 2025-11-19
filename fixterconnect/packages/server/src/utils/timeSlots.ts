/**
 * Time Slot Utilities
 * Handles 30-minute time slot calculations and conflict detection
 */

export interface TimeSlot {
  date: Date;
  startTime: string;  // "HH:MM" format
  endTime: string;    // "HH:MM" format
  slotType: 'JOB' | 'TRAVEL' | 'BLOCKED';
  bookingId?: number;
  reason?: string;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

/**
 * Generate 30-minute time slots for a given time range
 * @param startTime - Start time in "HH:MM" format (e.g., "09:00")
 * @param endTime - End time in "HH:MM" format (e.g., "10:30")
 * @returns Array of 30-minute time slots
 */
export function generateTimeSlots(startTime: string, endTime: string): TimeRange[] {
  const slots: TimeRange[] = [];
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  let currentMinutes = start;

  while (currentMinutes < end) {
    const slotStart = formatMinutes(currentMinutes);
    const slotEnd = formatMinutes(currentMinutes + 30);

    slots.push({
      startTime: slotStart,
      endTime: slotEnd
    });

    currentMinutes += 30;
  }

  return slots;
}

/**
 * Calculate time slots needed for a job including travel time
 * @param jobStartTime - Job start time in "HH:MM" format
 * @param durationMinutes - Job duration in minutes
 * @param includeTravelAfter - Whether to include 10-min travel buffer after job
 * @returns Object with job slots and travel slots
 */
export function calculateJobSlots(
  jobStartTime: string,
  durationMinutes: number,
  includeTravelAfter: boolean = true
): { jobSlots: TimeRange[], travelSlots: TimeRange[] } {
  const startMinutes = parseTime(jobStartTime);
  const endMinutes = startMinutes + durationMinutes;

  // Generate job slots (30-min blocks)
  const jobSlots = generateTimeSlots(
    formatMinutes(startMinutes),
    formatMinutes(endMinutes)
  );

  // Generate travel slot if needed (10 minutes)
  const travelSlots: TimeRange[] = [];
  if (includeTravelAfter) {
    travelSlots.push({
      startTime: formatMinutes(endMinutes),
      endTime: formatMinutes(endMinutes + 10)
    });
  }

  return { jobSlots, travelSlots };
}

/**
 * Check if a time range conflicts with existing slots
 * @param proposedStart - Proposed start time in "HH:MM" format
 * @param proposedEnd - Proposed end time in "HH:MM" format
 * @param existingSlots - Array of existing time slots
 * @returns true if there's a conflict, false otherwise
 */
export function hasConflict(
  proposedStart: string,
  proposedEnd: string,
  existingSlots: TimeRange[]
): boolean {
  const propStart = parseTime(proposedStart);
  const propEnd = parseTime(proposedEnd);

  for (const slot of existingSlots) {
    const slotStart = parseTime(slot.startTime);
    const slotEnd = parseTime(slot.endTime);

    // Check for overlap
    // Two ranges overlap if: start1 < end2 AND start2 < end1
    if (propStart < slotEnd && slotStart < propEnd) {
      return true;
    }
  }

  return false;
}

/**
 * Find next available time slot on a given date
 * @param desiredStart - Desired start time in "HH:MM" format
 * @param durationMinutes - Required duration in minutes
 * @param workdayStart - Workday start time (default "08:00")
 * @param workdayEnd - Workday end time (default "17:00")
 * @param existingSlots - Existing booked slots
 * @returns Next available start time or null if no availability
 */
export function findNextAvailableSlot(
  desiredStart: string,
  durationMinutes: number,
  workdayStart: string = '08:00',
  workdayEnd: string = '17:00',
  existingSlots: TimeRange[] = []
): string | null {
  const startMinutes = Math.max(parseTime(desiredStart), parseTime(workdayStart));
  const endOfDay = parseTime(workdayEnd);
  const requiredMinutes = durationMinutes + 10; // Include 10-min travel buffer

  // Try each 30-minute increment
  for (let tryStart = startMinutes; tryStart + requiredMinutes <= endOfDay; tryStart += 30) {
    const tryEnd = tryStart + durationMinutes;
    const proposedStart = formatMinutes(tryStart);
    const proposedEnd = formatMinutes(tryEnd);

    if (!hasConflict(proposedStart, proposedEnd, existingSlots)) {
      return proposedStart;
    }
  }

  return null; // No availability found
}

/**
 * Get all conflicting slots for a proposed time range
 * @param proposedStart - Proposed start time
 * @param proposedEnd - Proposed end time
 * @param existingSlots - Existing slots with metadata
 * @returns Array of conflicting slots
 */
export function getConflictingSlots(
  proposedStart: string,
  proposedEnd: string,
  existingSlots: TimeSlot[]
): TimeSlot[] {
  const propStart = parseTime(proposedStart);
  const propEnd = parseTime(proposedEnd);

  return existingSlots.filter(slot => {
    const slotStart = parseTime(slot.startTime);
    const slotEnd = parseTime(slot.endTime);
    return propStart < slotEnd && slotStart < propEnd;
  });
}

// ============================================
// Helper Functions
// ============================================

/**
 * Parse time string "HH:MM" to minutes since midnight
 */
function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to "HH:MM" string
 */
function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Add minutes to a time string
 */
export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const totalMinutes = parseTime(time) + minutesToAdd;
  return formatMinutes(totalMinutes);
}

/**
 * Calculate duration between two times in minutes
 */
export function calculateDuration(startTime: string, endTime: string): number {
  return parseTime(endTime) - parseTime(startTime);
}

/**
 * Round time to nearest 30-minute interval
 */
export function roundToNearestSlot(time: string): string {
  const minutes = parseTime(time);
  const rounded = Math.round(minutes / 30) * 30;
  return formatMinutes(rounded);
}
