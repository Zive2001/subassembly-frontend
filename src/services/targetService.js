// services/targetService.js
import api from './api';

// Set a target for a workcenter
export const setTarget = async (targetData) => {
  try {
    const response = await api.post('/api/targets', targetData);
    return response.data;
  } catch (error) {
    console.error('Error setting target:', error);
    throw error;
  }
};

// Get targets for a specific date
export const getTargetsByDate = async (date) => {
  try {
    const response = await api.get(`/api/targets/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching targets:', error);
    throw error;
  }
};

// Get hourly targets for a specific date
export const getHourlyTargetsByDate = async (date) => {
  try {
    const response = await api.get(`/api/hourly-targets/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hourly targets:', error);
    throw error;
  }
};

// Get production data with targets comparison
export const getProductionWithTargets = async (date) => {
  try {
    const response = await api.get(`/api/production-targets/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching production with targets:', error);
    throw error;
  }
};

// Export all the functions
export default {
  setTarget,
  getTargetsByDate,
  getHourlyTargetsByDate,
  getProductionWithTargets
};