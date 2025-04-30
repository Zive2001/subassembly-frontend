import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://sg-prod-bdyapp-subdashback.azurewebsites.net';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
// Add these new functions
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
  

export default api;