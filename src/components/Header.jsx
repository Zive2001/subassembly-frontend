// src/components/Header.jsx
import { useState } from 'react';
import { refreshProductionData } from '../services/api';
import { formatDate } from '../utils/formatters';
import DateSelector from './DateSelector';

const Header = ({ lastUpdated, selectedDate, onDateChange, setSidebarOpen, sidebarOpen, mobileView }) => {
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
    <header className="bg-slate-900 border-b border-slate-800 shadow-md z-20">
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* Sidebar toggle */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            {sidebarOpen && mobileView ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            )}
          </button>

          {/* Logo and title */}
          <div className="ml-3 sm:ml-4">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent truncate">
              Sub-assembly Dashboard
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 flex items-center">
              {lastUpdated ? (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  <span className="hidden sm:inline">Updated: {formatDate(lastUpdated)} at {new Date(lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="sm:hidden">Updated: {new Date(lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                  <span>Loading data...</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Summary stats - only on desktop */}
          <div className="hidden lg:flex items-center space-x-4 mr-4">
            <div className="px-3 py-1 bg-slate-800/60 rounded-md">
              <div className="text-xs text-slate-400">Total Units</div>
              <div className="text-lg font-semibold text-white">..</div>
            </div>
            <div className="px-3 py-1 bg-slate-800/60 rounded-md">
              <div className="text-xs text-slate-400">Efficiency</div>
              <div className="text-lg font-semibold text-emerald-400">..</div>
            </div>
          </div>
          
          {/* Mobile optimized controls */}
          <div className="flex items-center space-x-2">
            {/* Date selector */}
            <DateSelector 
              selectedDate={selectedDate} 
              onDateChange={onDateChange}
              mobileView={mobileView}
            />
            
            {/* Refresh button - simplified on mobile */}
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh data"
              className={`${mobileView ? 'p-2' : 'px-4 py-2'} bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''} ${mobileView ? '' : 'mr-2'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              {!mobileView && (refreshing ? 'Refreshing...' : 'Refresh')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;