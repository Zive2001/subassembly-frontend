// services/api.js
import axios from 'axios';

// For local development, use http://localhost:3000
// In production, use the Azure URL
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://sg-prod-bdyapp-subdashback.azurewebsites.net';

console.log('Using API URL:', API_URL); // Helpful for debugging

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Production Data Services
export const getProductionData = async () => {
  try {
    const response = await api.get('/api/production');
    return response.data;
  } catch (error) {
    console.error('Error fetching production data:', error);
    throw error;
  }
};

export const refreshProductionData = async () => {
  try {
    const response = await api.post('/api/refresh');
    return response.data;
  } catch (error) {
    console.error('Error refreshing production data:', error);
    throw error;
  }
};

export const getProductionDataByDate = async (date) => {
  try {
    const response = await api.get(`/api/production/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching production data by date:', error);
    throw error;
  }
};

export const getAvailableDates = async () => {
  try {
    const response = await api.get('/api/available-dates');
    return response.data;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw error;
  }
};

export const getWorkcenters = async () => {
  try {
    const response = await api.get('/api/workcenters');
    return response.data;
  } catch (error) {
    console.error('Error fetching workcenters:', error);
    throw error;
  }
};

// We'll remove the duplicate target-related functions from here
// and import them from targetService.js instead

export default api;