// src/utils/timeUtils.js
/**
 * Utility functions for time-related operations
 */

// Determine current shift based on time in Sri Lanka
export const determineCurrentShift = () => {
    // Create date object for Sri Lanka time (UTC+5:30)
    const now = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const utcOffset = now.getTimezoneOffset() * 60 * 1000; // Local offset in milliseconds
    const sriLankaTime = new Date(now.getTime() + utcOffset + sriLankaOffset);
    
    // Get hours and minutes in Sri Lanka time
    const hours = sriLankaTime.getHours();
    const minutes = sriLankaTime.getMinutes();
    
    // Convert to decimal for easier comparison
    const timeDecimal = hours + (minutes / 60);
    
    // Morning shift: 5:30 AM - 1:30 PM (5.5 - 13.5)
    // Evening shift: 1:30 PM - 9:30 PM (13.5 - 21.5)
    // Outside regular shifts (night), default to Evening
    if (timeDecimal >= 5.5 && timeDecimal < 13.5) {
      return 'Morning';
    } else {
      return 'Evening';
    }
  };
  
  // Format Sri Lanka time for display
  export const getSriLankaTime = () => {
    const now = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000; 
    const utcOffset = now.getTimezoneOffset() * 60 * 1000;
    const sriLankaTime = new Date(now.getTime() + utcOffset + sriLankaOffset);
    
    return sriLankaTime;
  };