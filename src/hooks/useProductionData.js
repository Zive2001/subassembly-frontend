import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getProductionData, getProductionDataByDate } from '../services/api';
import { getProductionWithTargets } from '../services/targetService';
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
  const [targetData, setTargetData] = useState({
    dailyTargets: {},
    hourlyTargets: {
      Morning: {},
      Evening: {}
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
        let productionData;
        let targetInfo;
        
        // Convert date to ISO format for API calls
        const isoDateString = new Date(selectedDate).toISOString();
        
        // Get production data
        if (isToday) {
          productionData = await getProductionData();
        } else {
          productionData = await getProductionDataByDate(isoDateString);
        }
        
        // Get target data - separate call since we want to merge the data
        try {
          targetInfo = await getProductionWithTargets(isoDateString);
          
          // Extract target info if available
          if (targetInfo && targetInfo.targets) {
            const { targets } = targetInfo;
            
            // Process daily targets
            const dailyTargets = {};
            const hourlyTargets = {
              Morning: {},
              Evening: {}
            };
            
            // Parse target data
            if (Array.isArray(targets)) {
              targets.forEach(target => {
                if (target.workcenter && target.planQty && target.hours) {
                  // Store daily target info
                  dailyTargets[target.workcenter] = {
                    planQty: target.planQty,
                    hours: target.hours,
                    shift: target.shift
                  };
                  
                  // Calculate hourly target (total plan divided by hours)
                  const hourlyTarget = Math.round(target.planQty / target.hours);
                  
                  // Store in the appropriate shift
                  if (target.shift === 'Morning') {
                    hourlyTargets.Morning[target.workcenter] = hourlyTarget;
                  } else if (target.shift === 'Evening') {
                    hourlyTargets.Evening[target.workcenter] = hourlyTarget;
                  }
                }
              });
            }
            
            setTargetData({
              dailyTargets,
              hourlyTargets
            });
          }
        } catch (targetErr) {
          console.warn('Error fetching target data:', targetErr);
          // Don't fail the whole operation if target fetch fails
        }
        
        // Set the production data regardless of target fetch success
        setProductionData(productionData);
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

  return { 
    productionData, 
    targetData, 
    loading, 
    error, 
    lastUpdated 
  };
};

export default useProductionData;