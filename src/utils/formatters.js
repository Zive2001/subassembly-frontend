import { format } from 'date-fns';

// Format date to display
export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

// Get color based on production value
export const getProductionColor = (value) => {
  if (value === 0 || value === '-') return 'bg-gray-500';
  if (value < 25) return 'bg-red-400';
  if (value < 50) return 'bg-yellow-400';
  if (value < 100) return 'bg-green-400';
  return 'bg-blue-400';
};

// Convert time slot position (1-8) to label
export const timeSlotToLabel = (position) => {
  const morningSlots = [
    '05:30-06:00',
    '06:00-07:00',
    '07:00-08:00',
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:30'
  ];
  
  const eveningSlots = [
    '13:30-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
    '20:00-21:30'
  ];
  
  return { morning: morningSlots[position - 1], evening: eveningSlots[position - 1] };
};