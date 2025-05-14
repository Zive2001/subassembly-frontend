import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { getWorkcenters } from '../services/api';
import { setTarget, getTargetsByDate } from '../services/targetService';

const TargetForm = ({ onTargetAdded, selectedDate }) => {
  const initialFormState = {
    targetDate: selectedDate || format(new Date(), 'yyyy-MM-dd'),
    workcenter: '',
    shift: 'Morning',
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
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {currentTargets ? 'Update Production Target' : 'Set New Production Target'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Target {currentTargets ? 'updated' : 'set'} successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Workcenter
            </label>
            <select
              name="workcenter"
              value={formData.workcenter}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Shift
            </label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Plan Quantity
            </label>
            <input
              type="number"
              name="planQty"
              value={formData.planQty}
              onChange={handleChange}
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hours
            </label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              min="1"
              max="24"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Team Member Count
            </label>
            <input
              type="number"
              name="teamMemberCount"
              value={formData.teamMemberCount}
              onChange={handleChange}
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Standard Minute Value (SMV)
            </label>
            <input
              type="number"
              name="smv"
              value={formData.smv}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold">Hourly Targets</h3>
            <div className="flex items-center">
              <span className="text-sm mr-2">Enable Advanced Mode</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={advancedMode}
                  onChange={() => setAdvancedMode(!advancedMode)}
                />
                <span className="slider rounded"></span>
              </label>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            {advancedMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hourlyTargets.map((target, index) => (
                  <div key={target.timeSlot} className="flex items-center">
                    <span className="w-28 text-sm font-medium">{target.timeSlot}</span>
                    <input
                      type="number"
                      value={target.targetQty}
                      onChange={(e) => handleHourlyTargetChange(index, e.target.value)}
                      min="0"
                      className="ml-2 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hourlyTargets.map((target) => (
                  <div key={target.timeSlot} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                    <span className="font-medium">{target.timeSlot}</span>
                    <span className="font-mono">{target.targetQty}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {advancedMode 
                ? "Set custom targets for each time slot. These will override the auto-calculated values."
                : "Hourly targets are automatically calculated based on the total plan quantity and duration of each time slot."}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || loadingWorkcenters}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              (loading || loadingWorkcenters) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading 
              ? 'Saving...' 
              : loadingWorkcenters 
                ? 'Loading Workcenters...' 
                : currentTargets 
                  ? 'Update Target' 
                  : 'Set Target'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        .slider.rounded {
          border-radius: 20px;
        }
        .slider.rounded:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default TargetForm;