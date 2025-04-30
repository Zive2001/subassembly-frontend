import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { setTarget } from '../services/targetService';
import { getWorkcenters } from '../services/api';

const TargetForm = ({ onTargetAdded }) => {
  const [formData, setFormData] = useState({
    targetDate: format(new Date(), 'yyyy-MM-dd'),
    workcenter: '',
    shift: 'Morning',
    planQty: 240,
    hours: 8,
    createdBy: 'user'
  });
  
  const [workcenters, setWorkcenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWorkcenters, setLoadingWorkcenters] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch workcenters from the database
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
          // Fallback if API returns empty array
          const placeholderWorkcenters = ['S2CU4', 'S2LU', 'S2MU', 'S2CU1', 'S2CU3'];
          setWorkcenters(placeholderWorkcenters);
          setFormData(prev => ({
            ...prev,
            workcenter: placeholderWorkcenters[0]
          }));
          console.warn('No workcenters found from API, using placeholders');
        }
        setLoadingWorkcenters(false);
      } catch (err) {
        console.error('Error fetching workcenters:', err);
        setError('Failed to load workcenters');
        setLoadingWorkcenters(false);
        
        // Fallback if API fails
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert numbers to integers
    if (name === 'planQty' || name === 'hours') {
      processedValue = parseInt(value, 10) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Format the date to ISO format for the API
      const apiFormData = {
        ...formData,
        // Convert YYYY-MM-DD to ISO date format that backend expects
        targetDate: new Date(formData.targetDate).toISOString()
      };
      
      const result = await setTarget(apiFormData);
      setSuccess(true);
      setLoading(false);
      
      // Reset form partially
      setFormData({
        ...formData,
        planQty: 240,
        hours: 8
      });
      
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
      <h2 className="text-xl font-semibold mb-4">Set Production Target</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Target set successfully!
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
              Plan Quantity
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
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || loadingWorkcenters}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              (loading || loadingWorkcenters) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : loadingWorkcenters ? 'Loading Workcenters...' : 'Set Target'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TargetForm;