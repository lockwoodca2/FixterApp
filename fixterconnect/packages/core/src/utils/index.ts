// Date utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatTime = (timeString: string): string => {
  // Handle "10:00 AM" format
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString;
  }
  
  // Handle "10:00" format (24-hour)
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const convertTimeToMinutes = (timeStr: string): number => {
  // Convert "9:00 AM" to minutes since midnight
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const isPM = match[3].toUpperCase() === 'PM';
  
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

export const convertToAmPm = (timeStr: string): string => {
  if (!timeStr) return '';
  
  // If already in AM/PM format
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    return timeStr;
  }
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};