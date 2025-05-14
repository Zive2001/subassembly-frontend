// hooks/useProductionData.js (adjusted for compatibility)
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getProductionData, getProductionDataByDate } from '../services/api';
import { getProductionWithTargets, getHourlyTargetsByDate } from '../services/targetService';
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
    workcenters: [],
    data: {
      Morning: [],
      Evening: []
    }
  });
  
  // Also keep the old target format for backward compatibility
  const [oldTargetData, setOldTargetData] = useState({
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
        
        // Convert date to ISO format for API calls
        const isoDateString = new Date(selectedDate).toISOString();
        
        // Get production data
        let productionData;
        if (isToday) {
          productionData = await getProductionData();
        } else {
          productionData = await getProductionDataByDate(isoDateString);
        }
        
        setProductionData(productionData);
        
        // Try to get production with targets (new format)
        try {
          const combinedData = await getProductionWithTargets(isoDateString);
          
          if (combinedData && combinedData.workcenters) {
            // New format
            if (combinedData.actualData && combinedData.targetData) {
              setTargetData({
                workcenters: combinedData.workcenters,
                data: combinedData.targetData
              });
            } 
            // Old format - try to extract targets
            else if (combinedData.data) {
              const dailyTargets = {};
              const hourlyTargets = {
                Morning: {},
                Evening: {}
              };
              
              // Process combined data to extract targets
              if (combinedData.targets && Array.isArray(combinedData.targets)) {
                combinedData.targets.forEach(target => {
                  if (target.workcenter && target.planQty) {
                    dailyTargets[target.workcenter] = {
                      planQty: target.planQty,
                      hours: target.hours || 8,
                      shift: target.shift
                    };
                    
                    // Calculate hourly target
                    const hourlyTarget = Math.round(target.planQty / (target.hours || 8));
                    
                    if (target.shift === 'Morning' || target.shift === 'Evening') {
                      hourlyTargets[target.shift][target.workcenter] = hourlyTarget;
                    }
                  }
                });
                
                setOldTargetData({
                  dailyTargets,
                  hourlyTargets
                });
              }
            }
          }
        } catch (targetErr) {
          console.warn('Error fetching target data, trying hourly targets:', targetErr);
          
          // Fallback to hourly targets
          try {
            const hourlyTargets = await getHourlyTargetsByDate(isoDateString);
            if (hourlyTargets && hourlyTargets.data) {
              setTargetData(hourlyTargets);
            }
          } catch (hourlyErr) {
            console.warn('Error fetching hourly targets:', hourlyErr);
          }
        }
        
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

  // Return both the new and old target formats for compatibility
  return { 
    productionData, 
    targetData, 
    hourlyTargets: oldTargetData.hourlyTargets, // For backward compatibility
    dailyTargets: oldTargetData.dailyTargets,   // For backward compatibility
    loading, 
    error, 
    lastUpdated 
  };
};

export default useProductionData;