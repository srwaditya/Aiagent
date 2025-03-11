import { format, isToday, isTomorrow, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

/**
 * Format a date for display
 */
export const formatDate = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM d, yyyy');
};

/**
 * Format a date with time for display
 */
export const formatDateTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

/**
 * Get a relative date string (Today, Tomorrow, Yesterday, etc.)
 */
export const getRelativeDateString = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE'); // Day of week
  }
  
  if (isThisMonth(dateObj)) {
    return format(dateObj, 'MMMM d');
  }
  
  return formatDate(dateObj);
};

/**
 * Check if a date is overdue (in the past)
 */
export const isOverdue = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  
  // Set time to end of day for comparison
  dateObj.setHours(23, 59, 59, 999);
  
  return dateObj < now;
};