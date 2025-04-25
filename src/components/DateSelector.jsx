import { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { getAvailableDates } from '../services/api';

const DateSelector = ({ selectedDate, onDateChange }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        setLoading(true);
        const dates = await getAvailableDates();
        setAvailableDates(dates);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dates:', error);
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  const handleSelectDate = (date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center"
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        {selectedDate === today ? 'Today' : format(parseISO(selectedDate), 'MMM dd, yyyy')}
      </button>

      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 rounded shadow py-1 border border-gray-700">
          <div className="px-4 py-2 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-white">Select Date</h3>
          </div>
          
          <button
            onClick={() => handleSelectDate(today)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
              selectedDate === today ? 'bg-indigo-600' : ''
            }`}
          >
            Today
          </button>
          
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-2 text-gray-400 text-sm">Loading dates...</div>
            ) : availableDates.length === 0 ? (
              <div className="px-4 py-2 text-gray-400 text-sm">No dates available</div>
            ) : (
              availableDates.map((date) => {
                const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                return (
                  <button
                    key={formattedDate}
                    onClick={() => handleSelectDate(formattedDate)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                      selectedDate === formattedDate ? 'bg-indigo-600' : ''
                    }`}
                  >
                    {format(new Date(date), 'MMM dd, yyyy')}
                    {formattedDate === today && ' (Today)'}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;