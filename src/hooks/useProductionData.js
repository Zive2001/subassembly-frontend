import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getProductionData, getProductionDataByDate } from '../services/api';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'https://sg-prod-bdyapp-subdashback.azurewebsites.net';

export const useProductionData = (selectedDate) => {
  const [productionData, setProductionData] = useState({
    workcenters: [],
    data: {
      Morning: [],
      Evening: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const isToday = selectedDate === today;

  useEffect(() => {
    let socket;

    // Only connect to socket for real-time updates if viewing today's data
    if (isToday) {
      socket = io(API_URL);
    }
    
    // Fetch data for the selected date
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        
        // Convert the date to ISO format for the API if it's not today
        // This is the only change needed - convert the date format for API calls
        if (isToday) {
          data = await getProductionData();
        } else {
          // Convert to ISO format for the API
          const isoDateString = new Date(selectedDate).toISOString();
          data = await getProductionDataByDate(isoDateString);
        }
        
        setProductionData(data);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Listen for real-time updates (only for today's data)
    if (isToday && socket) {
      socket.on('productionData', (data) => {
        setProductionData(data);
        setLastUpdated(new Date());
      });
    }

    // Clean up on component unmount or when date changes
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [selectedDate, isToday]);

  return { productionData, loading, error, lastUpdated };
};

export default useProductionData;