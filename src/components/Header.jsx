import { useState } from 'react';
import { refreshProductionData } from '../services/api';
import { formatDate } from '../utils/formatters';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import DateSelector from './DateSelector';

const Header = ({ lastUpdated, selectedDate, onDateChange }) => {
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProductionData();
      setTimeout(() => setRefreshing(false), 1000);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setRefreshing(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 shadow">
      <div className="w-full px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">
            Sub-assembly Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {lastUpdated ? `Last updated: ${formatDate(lastUpdated)} at ${new Date(lastUpdated).toLocaleTimeString()}` : 'Loading...'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DateSelector 
            selectedDate={selectedDate} 
            onDateChange={onDateChange} 
          />
          
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;