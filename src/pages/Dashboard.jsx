// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useProductionData } from '../hooks/useProductionData';
import Header from '../components/Header';
import ShiftTab from '../components/ShiftTab';
import SectionSelector from '../components/SectionSelector';
import DashboardGrid from '../components/DashboardGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { getWorkcentersBySection } from '../utils/sectionConfig';

const Dashboard = () => {
  const [activeShift, setActiveShift] = useState('Morning');
  const [activeSection, setActiveSection] = useState('All'); // Default to showing all sections
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd')); // Default to today
  const { productionData, loading, error, lastUpdated } = useProductionData(selectedDate);
  const [filteredProductionData, setFilteredProductionData] = useState({
    workcenters: [],
    data: {
      Morning: [],
      Evening: []
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      // Auto-close sidebar on mobile when resizing to mobile view
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to Morning shift when changing dates
  useEffect(() => {
    setActiveShift('Morning');
  }, [selectedDate]);

  // Filter production data when section changes
  useEffect(() => {
    if (productionData && productionData.workcenters) {
      // Filter workcenters based on the selected section
      const filteredWorkcenters = getWorkcentersBySection(activeSection, productionData.workcenters);
      
      // Create a new data object with only the filtered workcenters
      const filteredData = {
        workcenters: filteredWorkcenters,
        data: {
          Morning: productionData.data.Morning.map(hourData => {
            // Create a new object with just the workcenters we want
            const filteredHourData = {};
            filteredWorkcenters.forEach(wc => {
              if (hourData[wc] !== undefined) {
                filteredHourData[wc] = hourData[wc];
              }
            });
            return filteredHourData;
          }),
          Evening: productionData.data.Evening.map(hourData => {
            // Create a new object with just the workcenters we want
            const filteredHourData = {};
            filteredWorkcenters.forEach(wc => {
              if (hourData[wc] !== undefined) {
                filteredHourData[wc] = hourData[wc];
              }
            });
            return filteredHourData;
          })
        }
      };
      
      setFilteredProductionData(filteredData);
    }
  }, [productionData, activeSection]);

  // Handle sidebar toggle and auto-close on selection in mobile view
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    // Close sidebar automatically after selection on mobile
    if (mobileView) {
      setSidebarOpen(false);
    }
  };

  const handleSetActiveShift = (shift) => {
    setActiveShift(shift);
    // Close sidebar automatically after selection on mobile
    if (mobileView) {
      setSidebarOpen(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  // Handle backdrop click to close sidebar on mobile
  const handleBackdropClick = () => {
    if (mobileView) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header 
          lastUpdated={null} 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          setSidebarOpen={handleSidebarToggle}
          sidebarOpen={sidebarOpen}
          mobileView={mobileView}
        />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Loading production data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header 
          lastUpdated={null} 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          setSidebarOpen={handleSidebarToggle}
          sidebarOpen={sidebarOpen}
          mobileView={mobileView}
        />
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-500/20 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-500">Error Loading Data</h2>
                <p className="text-slate-300 mt-2">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header 
        lastUpdated={lastUpdated}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        setSidebarOpen={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
        mobileView={mobileView}
      />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Backdrop for mobile when sidebar is open */}
        {mobileView && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20"
            onClick={handleBackdropClick}
          ></div>
        )}
        
        {/* Sidebar - full height on desktop, sliding drawer on mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              className={`bg-slate-900 border-r border-slate-800 z-30 ${
                mobileView ? 'fixed left-0 top-0 bottom-0 w-72' : 'w-64'
              }`}
              initial={{ x: mobileView ? -280 : -260 }}
              animate={{ x: 0 }}
              exit={{ x: mobileView ? -280 : -260 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Mobile close button */}
              {mobileView && (
                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800">
                  <h2 className="text-lg font-medium text-slate-200">Dashboard Controls</h2>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="p-4">
                {!mobileView && <h2 className="text-lg font-medium text-slate-300 mb-4">Controls</h2>}
                
                <div className="space-y-6">
                  {/* Shift Selection */}
                  <div>
                    <h3 className="text-sm text-slate-400 mb-2">Shift</h3>
                    <ShiftTab activeShift={activeShift} setActiveShift={handleSetActiveShift} />
                  </div>
                  
                  {/* Section Selection */}
                  <div>
                    <h3 className="text-sm text-slate-400 mb-2">Section</h3>
                    <SectionSelector 
                      activeSection={activeSection} 
                      setActiveSection={handleSetActiveSection} 
                    />
                  </div>
                  
                  {/* Mobile controls */}
                  {mobileView && (
                    <div className="mt-6 pt-6 border-t border-slate-800">
                      <button 
                        onClick={() => setSidebarOpen(false)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
                      >
                        <span>Apply & Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <motion.div 
          className="flex-1 overflow-auto p-4"
          layout
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedDate}-${activeShift}-${activeSection}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {!isToday && (
                <div className="bg-blue-950/40 border border-blue-900/50 rounded-lg p-4 mb-6 flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-blue-300">
                    Viewing historical data for {format(new Date(selectedDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
              
              {/* Mobile Quick Controls - Shown above content when sidebar is closed */}
              {mobileView && (
                <div className="mb-4 flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-800">
                  <div className="flex items-center">
                    <span className="text-sm text-slate-400 mr-2">Viewing:</span>
                    <span className="text-sm font-medium text-white">
                      {activeSection} • {activeShift} Shift
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md bg-slate-800 text-slate-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="bg-slate-900 rounded-lg shadow-xl border border-slate-800 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-200">
                    {mobileView ? 'Productivity Report' : `${activeSection} Section - ${activeShift} Shift`}
                  </h2>
                  
                  {!mobileView && (
                    <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1.5 rounded-md text-sm text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Productivity Report</span>
                    </div>
                  )}
                </div>
                
                <div className="p-2 sm:p-4 overflow-x-auto">
                  <DashboardGrid 
                    productionData={filteredProductionData} 
                    activeShift={activeShift}
                    mobileView={mobileView}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-3 sm:py-4 bg-slate-900 border-t border-slate-800 text-center">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center">
            <img 
              src="/MAS White.png" 
              alt="FCA App Logo" 
              className="h-6 sm:h-8 w-auto"
            />
            <div className="ml-3 sm:ml-4 h-6 sm:h-8 w-px bg-slate-700 hidden sm:block"></div>
            <span className="ml-3 sm:ml-4 text-slate-400 text-xs sm:text-sm">Sub-assembly Dashboard</span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            © {new Date().getFullYear()} Bodyline Digital Excellence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;