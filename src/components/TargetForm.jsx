import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorkcenters } from '../services/api';
import { setTarget, getTargetsByDate } from '../services/targetService';
import { determineCurrentShift } from '../utils/timeUtils'; // Import the utility function
import { 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon,
  BoltIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const TargetForm = ({ onTargetAdded, selectedDate }) => {
  // Use determineCurrentShift to get the current shift based on Sri Lanka time
  const initialFormState = {
    targetDate: selectedDate || format(new Date(), 'yyyy-MM-dd'),
    workcenter: '',
    shift: determineCurrentShift(), // Use the utility function here
    planQty: 240,
    hours: 8,
    teamMemberCount: 1,
    smv: 0,
    createdBy: 'user',
    timeSlotTargets: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [workcenters, setWorkcenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWorkcenters, setLoadingWorkcenters] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [currentTargets, setCurrentTargets] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(true);
  const [shiftManuallySelected, setShiftManuallySelected] = useState(false);
  
  // Time slots based on shift
  const morningTimeSlots = ['05:30-06:00', '06:00-07:00', '07:00-08:00', '08:00-09:30', '09:30-10:30', '10:30-11:30', '11:30-12:30', '12:30-13:30'];
  const eveningTimeSlots = ['13:30-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:30', '18:30-19:30', '19:30-20:30', '20:30-21:30'];
  
  // Time slot durations in minutes
  const timeSlotDurations = {
    '05:30-06:00': 30, '13:30-14:00': 30,
    '08:00-09:30': 90, '17:00-18:30': 90,
    '06:00-07:00': 60, '07:00-08:00': 60, '09:30-10:30': 60, '10:30-11:30': 60, '11:30-12:30': 60, '12:30-13:30': 60,
    '14:00-15:00': 60, '15:00-16:00': 60, '16:00-17:00': 60, '18:30-19:30': 60, '19:30-20:30': 60, '20:30-21:30': 60
  };
  
  // Get time slots based on selected shift
  const getTimeSlots = () => {
    return formData.shift === 'Morning' ? morningTimeSlots : eveningTimeSlots;
  };

  // Initialize hourly targets state
  const [hourlyTargets, setHourlyTargets] = useState(() => {
    const slots = formData.shift === 'Morning' ? morningTimeSlots : eveningTimeSlots;
    return slots.map(timeSlot => ({
      timeSlot,
      targetQty: 0
    }));
  });

  // Set up automatic shift detection
  useEffect(() => {
    // Only update shift automatically if it hasn't been manually selected
    if (!shiftManuallySelected) {
      // Check initial shift
      const currentShift = determineCurrentShift();
      if (currentShift !== formData.shift) {
        setFormData(prev => ({
          ...prev,
          shift: currentShift
        }));
      }
      
      // Set up interval to check shift changes every minute
      const shiftCheckInterval = setInterval(() => {
        const updatedShift = determineCurrentShift();
        if (updatedShift !== formData.shift && !shiftManuallySelected) {
          setFormData(prev => ({
            ...prev,
            shift: updatedShift
          }));
        }
      }, 60000); // Check every minute
      
      // Clean up interval on unmount
      return () => clearInterval(shiftCheckInterval);
    }
  }, [formData.shift, shiftManuallySelected]);

  // Fetch workcenters on component mount
  useEffect(() => {
    const fetchWorkcenters = async () => {
      try {
        setLoadingWorkcenters(true);
        const fetchedWorkcenters = await getWorkcenters();
        
        if (fetchedWorkcenters && fetchedWorkcenters.length > 0) {
          setWorkcenters(fetchedWorkcenters);
          setFormData(prev => ({
            ...prev,
            workcenter: fetchedWorkcenters[0]
          }));
        } else {
          // Fallback
          const placeholderWorkcenters = ['S2CU4', 'S2LU', 'S2MU', 'S2CU1', 'S2CU3'];
          setWorkcenters(placeholderWorkcenters);
          setFormData(prev => ({
            ...prev,
            workcenter: placeholderWorkcenters[0]
          }));
        }
        setLoadingWorkcenters(false);
      } catch (err) {
        console.error('Error fetching workcenters:', err);
        setError('Failed to load workcenters');
        setLoadingWorkcenters(false);
        
        // Fallback
        const placeholderWorkcenters = ['S2CU4', 'S2LU', 'S2MU', 'S2CU1', 'S2CU3'];
        setWorkcenters(placeholderWorkcenters);
        setFormData(prev => ({
          ...prev,
          workcenter: placeholderWorkcenters[0]
        }));
      }
    };
    
    fetchWorkcenters();
  }, []);

  // Update form data when selected date changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      targetDate: selectedDate || format(new Date(), 'yyyy-MM-dd')
    }));
  }, [selectedDate]);

  // Update hourly targets when shift changes
  useEffect(() => {
    const slots = getTimeSlots();
    calculateHourlyTargets(formData.planQty, formData.hours);
  }, [formData.shift]);

  // Fetch existing targets when workcenter and date change
  useEffect(() => {
    if (formData.workcenter && formData.targetDate) {
      fetchExistingTargets();
    }
  }, [formData.workcenter, formData.targetDate, formData.shift]);

  // Fetch existing targets for the selected workcenter and date
  const fetchExistingTargets = async () => {
    try {
      const targets = await getTargetsByDate(formData.targetDate);
      if (targets && targets.length > 0) {
        const target = targets.find(t => 
          t.workcenter === formData.workcenter && 
          t.shift === formData.shift
        );
        
        if (target) {
          setCurrentTargets(target);
          setFormData(prev => ({
            ...prev,
            planQty: target.planQty,
            hours: target.hours,
            teamMemberCount: target.teamMemberCount || 1,
            smv: target.smv || 0
          }));
          
          if (target.timeSlotTargets && target.timeSlotTargets.length > 0) {
            setHourlyTargets(target.timeSlotTargets);
            setAdvancedMode(true);
          } else {
            calculateHourlyTargets(target.planQty, target.hours);
            setAdvancedMode(false);
          }
        } else {
          setCurrentTargets(null);
          resetFormToDefaults();
        }
      } else {
        setCurrentTargets(null);
        resetFormToDefaults();
      }
    } catch (err) {
      console.error('Error fetching existing targets:', err);
      setCurrentTargets(null);
    }
  };

  // Reset form to defaults
  const resetFormToDefaults = () => {
    setFormData(prev => ({
      ...prev,
      planQty: 240,
      hours: 8,
      teamMemberCount: 1,
      smv: 0
    }));
    calculateHourlyTargets(240, 8);
    setAdvancedMode(false);
  };

  // Calculate hourly targets based on total quantity and hours
  const calculateHourlyTargets = (totalQty, hours) => {
    const slots = getTimeSlots();
    
    const newHourlyTargets = slots.map(timeSlot => {
      const duration = timeSlotDurations[timeSlot] || 60;
      const targetQty = Math.round((totalQty * (duration / 60.0)) / hours);
      
      return {
        timeSlot,
        targetQty
      };
    });
    
    setHourlyTargets(newHourlyTargets);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert numbers to integers
    if (['planQty', 'hours', 'teamMemberCount'].includes(name)) {
      processedValue = parseInt(value, 10) || 0;
    } else if (name === 'smv') {
      processedValue = parseFloat(value) || 0;
    }
    
    // If shift is being manually changed, set the manual selection flag
    if (name === 'shift') {
      setShiftManuallySelected(true);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    // Recalculate hourly targets when planQty or hours change
    if (name === 'planQty' || name === 'hours') {
      const planQty = name === 'planQty' ? processedValue : formData.planQty;
      const hours = name === 'hours' ? processedValue : formData.hours;
      calculateHourlyTargets(planQty, hours);
    }
  };

  // Handle hourly target changes in advanced mode
  const handleHourlyTargetChange = (index, value) => {
    const newTargets = [...hourlyTargets];
    newTargets[index].targetQty = parseInt(value, 10) || 0;
    setHourlyTargets(newTargets);
    
    // Update total plan quantity based on hourly targets
    const totalQty = newTargets.reduce((sum, target) => sum + target.targetQty, 0);
    setFormData({
      ...formData,
      planQty: totalQty
    });
  };

  // Calculate efficiency
  const calculateEfficiency = () => {
    if (!formData.smv || !formData.teamMemberCount || !formData.hours || !formData.planQty) {
      return null;
    }
    
    const minutesAvailable = formData.hours * 60 * formData.teamMemberCount;
    const minutesRequired = formData.planQty * formData.smv;
    return (minutesRequired / minutesAvailable) * 100;
  };

  // Get efficiency color
  const getEfficiencyColor = () => {
    const efficiency = calculateEfficiency();
    if (efficiency === null) return 'text-gray-400';
    if (efficiency < 75) return 'text-red-500';
    if (efficiency < 90) return 'text-yellow-500';
    if (efficiency < 100) return 'text-gray-600';
    return 'text-green-600';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Prepare data for API
      const apiFormData = {
        ...formData,
        targetDate: new Date(formData.targetDate).toISOString(),
        timeSlotTargets: advancedMode ? hourlyTargets : null
      };
      
      const result = await setTarget(apiFormData);
      setSuccess(true);
      setLoading(false);
      
      // Notify parent component
      if (onTargetAdded) {
        onTargetAdded(result);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to set target');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-3 flex items-center text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ExclamationCircleIcon className="h-4 w-4 mr-1.5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {success && (
          <motion.div 
            className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md mb-3 flex items-center text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CheckCircleIcon className="h-4 w-4 mr-1.5 text-green-500 flex-shrink-0" />
            <span>Target {currentTargets ? 'updated' : 'set'} successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handleSubmit}>
        <div className="md:grid md:grid-cols-2 md:gap-6">
          {/* Left Column - Basic Target Settings */}
          <div className="space-y-4">
            {/* Shift Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">
                Shift
              </label>
              <div className="flex">
                <label 
                  className={`flex-1 flex items-center justify-center cursor-pointer py-2 rounded-l-md border transition-all ${
                    formData.shift === 'Morning' 
                      ? 'bg-gray-800 border-gray-800 text-white font-medium' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="shift"
                    value="Morning"
                    checked={formData.shift === 'Morning'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm">Morning</span>
                </label>
                
                <label 
                  className={`flex-1 flex items-center justify-center cursor-pointer py-2 rounded-r-md border transition-all ${
                    formData.shift === 'Evening' 
                      ? 'bg-gray-800 border-gray-800 text-white font-medium' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="shift"
                    value="Evening"
                    checked={formData.shift === 'Evening'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm">Evening</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * Active shift is automatically determined based on the current time
              </p>
            </div>
            
            {/* Workcenter & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">
                  Workcenter
                </label>
                <div className="relative">
                  <select
                    name="workcenter"
                    value={formData.workcenter}
                    onChange={handleChange}
                    className="appearance-none shadow-sm border border-gray-200 rounded-md w-full py-2 px-3 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all bg-white"
                    required
                    disabled={loadingWorkcenters}
                  >
                    {loadingWorkcenters ? (
                      <option value="">Loading workcenters...</option>
                    ) : workcenters.length === 0 ? (
                      <option value="">No workcenters available</option>
                    ) : (
                      workcenters.map(wc => (
                        <option key={wc} value={wc}>{wc}</option>
                      ))
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5 flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                  Date
                </label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-200 rounded-md w-full py-2 px-3 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            
            {/* Basic info - Plan Qty, Hours, Team Members */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">
                  Plan Quantity
                </label>
                <input
                  type="number"
                  name="planQty"
                  value={formData.planQty}
                  onChange={handleChange}
                  min="1"
                  className="shadow-sm border border-gray-200 rounded-md w-full py-2 px-3 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                  Hours
                </label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  min="1"
                  max="24"
                  className="shadow-sm border border-gray-200 rounded-md w-full py-2 px-3 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5 flex items-center">
                  <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                  Team Size
                </label>
                <input
                  type="number"
                  name="teamMemberCount"
                  value={formData.teamMemberCount}
                  onChange={handleChange}
                  min="1"
                  className="shadow-sm border border-gray-200 rounded-md w-full py-2 px-3 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            
            {/* SMV Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">
                SMV (Standard Minute Value)
              </label>
              <input
                type="number"
                name="smv"
                value={formData.smv}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="shadow-sm border border-gray-200 rounded-md w-full py-2 px-3 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">Minutes required per unit</p>
            </div>
            
            {/* Efficiency Indicator */}
            <div className="mt-2">
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LightBulbIcon className="h-4 w-4 text-yellow-500 mr-1.5" />
                    <span className="text-sm font-medium text-gray-700">Efficiency</span>
                  </div>
                  <div className={`text-base font-bold ${getEfficiencyColor()}`}>
                    {calculateEfficiency() !== null 
                      ? `${calculateEfficiency().toFixed(1)}%` 
                      : 'N/A'}
                  </div>
                </div>
                
                {calculateEfficiency() !== null && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        calculateEfficiency() < 75 ? 'bg-red-500' :
                        calculateEfficiency() < 90 ? 'bg-yellow-500' :
                        calculateEfficiency() < 100 ? 'bg-gray-600' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(calculateEfficiency(), 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Hourly Targets */}
          <div className="mt-6 md:mt-0">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-gray-700 text-sm font-medium">
                Hourly Targets
              </label>
              <div className="flex items-center">
                <span className="text-xs mr-2 text-gray-500">
                  {showTimeSlots ? 'Hide' : 'Show'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowTimeSlots(!showTimeSlots)}
                  className="p-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {showTimeSlots ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {showTimeSlots && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-medium text-gray-600">
                        Time Slots ({formData.shift} Shift)
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs mr-2 text-gray-500">
                          Manual Edit
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={advancedMode}
                            onChange={() => setAdvancedMode(!advancedMode)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gray-700"></div>
                        </label>
                      </div>
                    </div>
                    
                    {advancedMode ? (
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto">
                        {hourlyTargets.map((target, index) => (
                          <div key={target.timeSlot} className="flex items-center">
                            <span className="w-20 text-xs font-medium text-gray-600">
                              {target.timeSlot}
                            </span>
                            <input
                              type="number"
                              value={target.targetQty}
                              onChange={(e) => handleHourlyTargetChange(index, e.target.value)}
                              min="0"
                              className="shadow-sm border border-gray-200 rounded-md w-full py-1 px-2 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto">
                        {hourlyTargets.map((target) => (
                          <div key={target.timeSlot} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-500">{target.timeSlot}</div>
                            <div className="text-sm font-medium text-gray-800">{target.targetQty}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-3 flex items-center">
                      <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span>
                        {advancedMode 
                          ? "Customize targets for each time slot"
                          : "Auto-calculated based on plan quantity and hours"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || loadingWorkcenters}
            className={`w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-colors ${
              (loading || loadingWorkcenters) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading && <ArrowPathIcon className="animate-spin h-4 w-4 mr-2 flex-shrink-0" />}
            <span>
              {loading 
                ? 'Saving...' 
                : loadingWorkcenters 
                  ? 'Loading Workcenters...' 
                  : currentTargets 
                    ? 'Update Target' 
                    : 'Set Target'}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TargetForm;