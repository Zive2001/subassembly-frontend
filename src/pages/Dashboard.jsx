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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header 
          lastUpdated={null} 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
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
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
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
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              className="bg-slate-900 w-64 border-r border-slate-800"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="p-4">
                <h2 className="text-lg font-medium text-slate-300 mb-2">Controls</h2>
                
                <div className="space-y-6">
                  {/* Shift Selection */}
                  <div>
                    <h3 className="text-sm text-slate-400 mb-2">Shift</h3>
                    <ShiftTab activeShift={activeShift} setActiveShift={setActiveShift} />
                  </div>
                  
                  {/* Section Selection */}
                  <div>
                    <h3 className="text-sm text-slate-400 mb-2">Section</h3>
                    <SectionSelector 
                      activeSection={activeSection} 
                      setActiveSection={setActiveSection} 
                    />
                  </div>
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
              
              <div className="bg-slate-900 rounded-lg shadow-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
                  <h2 className="text-xl font-bold text-slate-200">
                    {activeSection} Section - {activeShift} Shift
                  </h2>
                  
                  <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1.5 rounded-md text-sm text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Productivity Report</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <DashboardGrid 
                    productionData={filteredProductionData} 
                    activeShift={activeShift} 
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-slate-900 border-t border-slate-800 text-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/MAS White.png" 
              alt="FCA App Logo" 
              className="h-8 w-auto"
            />
            <div className="ml-4 h-8 w-px bg-slate-700"></div>
            <span className="ml-4 text-slate-400 text-sm">Sub-assembly Dashboard</span>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} BPL3 Production. Bodyline Digital Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;