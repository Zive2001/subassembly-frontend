// pages/TargetSettings.jsx
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TargetForm from '../components/TargetForm';
import TargetList from '../components/TargetList';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const TargetSettings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [weekDates, setWeekDates] = useState([]);

  // Generate week dates
  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    
    const dates = [];
    let current = start;
    
    while (current <= end) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }
    
    setWeekDates(dates);
  }, [selectedDate]);

  const handleTargetAdded = () => {
    // Trigger a refresh of the target list
    setRefreshTrigger(prev => prev + 1);
    
    // Show success message and hide it after 3 seconds
    setSuccessMessage('Target successfully added!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-6 max-w-6xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with back button */}
      <div className="mb-4 flex items-center">
        <Link 
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span>Dashboard</span>
        </Link>
      </div>
      
      {/* Main heading with gradient */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Production Target Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and monitor production targets for your workcenters
        </p>
      </div>
      
      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className="fixed top-6 right-6 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-md border border-green-200 flex items-center z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Date Selection Bar */}
      <motion.div 
        className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-gray-800">
                Production Targets
              </h2>
              <div className="ml-3 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                {format(selectedDate, 'MMMM yyyy')}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshData}
                className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh data"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <div className="flex items-center rounded-md overflow-hidden border border-gray-200">
                  <button 
                    onClick={goToPreviousDay}
                    className="p-1.5 bg-white text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-200"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="font-medium">{format(selectedDate, 'dd MMM yyyy')}</span>
                  </button>
                  
                  <button 
                    onClick={goToNextDay}
                    className="p-1.5 bg-white text-gray-500 hover:bg-gray-50 transition-colors border-l border-gray-200"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {showCalendar && (
                  <div className="absolute right-0 mt-2 z-10">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      inline
                      calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Week date selector */}
          <div className="mt-3 grid grid-cols-7 gap-1">
            {weekDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(date)}
                className={`flex flex-col items-center py-1.5 rounded-md transition-colors ${
                  format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xs font-medium">
                  {format(date, 'EEE')}
                </span>
                <span className={`text-base ${
                  format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    ? 'font-bold'
                    : ''
                }`}>
                  {format(date, 'd')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      
      <div className="space-y-6">
        {/* Target Form */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Set Production Target
                  </h2>
                  
                  <button
                    onClick={toggleForm}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Hide Form
                  </button>
                </div>
                
                <div className="p-4">
                  <TargetForm 
                    onTargetAdded={handleTargetAdded} 
                    selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Target List */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Targets for {format(selectedDate, 'dd MMMM yyyy')}
              </h2>
              
              {!isFormVisible && (
                <button
                  onClick={toggleForm}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  Show Form
                </button>
              )}
            </div>
            
            <div className="p-4">
              <TargetList 
                selectedDate={format(selectedDate, 'yyyy-MM-dd')} 
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TargetSettings;