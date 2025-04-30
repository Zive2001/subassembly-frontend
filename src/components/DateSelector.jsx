// src/components/DateSelector.jsx
import { useState, useEffect, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { getAvailableDates } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const DateSelector = ({ selectedDate, onDateChange, mobileView }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectDate = (date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-slate-800 hover:bg-slate-700 text-white rounded-md flex items-center transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 ${
          mobileView ? 'p-2' : 'px-3 py-2'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-blue-400 ${!mobileView && 'mr-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {!mobileView && <span>{selectedDate === today ? 'Today' : format(parseISO(selectedDate), 'MMM dd, yyyy')}</span>}
        {!mobileView && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`ml-2 h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`absolute z-30 mt-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden ${
              mobileView ? 'w-screen max-w-xs -right-2' : 'right-0 w-64'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Select Date</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={() => handleSelectDate(today)}
              className={`w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center transition-colors duration-150 ${
                selectedDate === today ? 'bg-blue-600/20 text-blue-300' : 'text-slate-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Today
              {selectedDate === today && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <div className="border-t border-slate-700 py-1">
              <div className="text-xs text-slate-500 px-4 py-1">Available dates</div>
            </div>
            
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-slate-400">Loading dates...</span>
                </div>
              ) : availableDates.length === 0 ? (
                <div className="px-4 py-3 text-slate-400 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    No dates available
                  </div>
                </div>
              ) : (
                availableDates.map((date) => {
                  const formattedDate = format(new Date(date), 'yyyy-MM-dd');
                  return (
                    <button
                      key={formattedDate}
                      onClick={() => handleSelectDate(formattedDate)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors duration-150 ${
                        selectedDate === formattedDate ? 'bg-blue-600/20 text-blue-300' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-sm">{format(new Date(date), 'MMMM dd, yyyy')}</span>
                        {formattedDate === today && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-900/50 text-blue-300 rounded">Today</span>
                        )}
                        {selectedDate === formattedDate && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateSelector;