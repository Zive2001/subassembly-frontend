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
    <div className="bg-gray-900/80 backdrop-blur-sm text-gray-100 p-5 shadow-lg border-b border-gray-800/50">
      <div className="w-full px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
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
            className="bg-indigo-600/80 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-md border border-indigo-500/30"
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