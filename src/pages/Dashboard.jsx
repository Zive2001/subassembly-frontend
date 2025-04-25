import { useState, useEffect } from 'react';
import { useProductionData } from '../hooks/useProductionData';
import Header from '../components/Header';
import ShiftTab from '../components/ShiftTab';
import DashboardGrid from '../components/DashboardGrid';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Dashboard = () => {
  const [activeShift, setActiveShift] = useState('Morning');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd')); // Default to today
  const { productionData, loading, error, lastUpdated } = useProductionData(selectedDate);

  // Reset to Morning shift when changing dates
  useEffect(() => {
    setActiveShift('Morning');
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Header 
          lastUpdated={null} 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Header 
          lastUpdated={null} 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        <div className="container mx-auto py-12 px-4">
          <div className="bg-red-900/50 border border-red-800 text-gray-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">Error</h2>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header 
        lastUpdated={lastUpdated}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      
      <motion.div 
        className="container mx-auto py-8 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={selectedDate} // Re-animate when date changes
      >
        {!isToday && (
          <div className="bg-indigo-950/40 border border-indigo-900 text-gray-100 p-4 rounded-lg shadow-lg mb-6">
            <p className="font-medium">
              Viewing historical data for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </p>
          </div>
        )}
        
        <ShiftTab activeShift={activeShift} setActiveShift={setActiveShift} />
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-800/50 p-5">
          <DashboardGrid 
            productionData={productionData} 
            activeShift={activeShift} 
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;