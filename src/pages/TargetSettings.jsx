//pages/TargetSettings.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import TargetForm from '../components/TargetForm';
import TargetList from '../components/TargetList';

// Simple date selector without external dependency
const SimpleDatePicker = ({ selectedDate, onChange }) => {
  return (
    <input
      type="date"
      value={format(selectedDate, 'yyyy-MM-dd')}
      onChange={(e) => onChange(new Date(e.target.value))}
      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  );
};

const TargetSettings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTargetAdded = () => {
    // Trigger a refresh of the target list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Production Target Settings</h1>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 sm:mb-0">
            Viewing Targets for Date:
          </h2>
          <div className="w-full sm:w-auto">
            <SimpleDatePicker
              selectedDate={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TargetForm 
            onTargetAdded={handleTargetAdded} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Targets for {format(selectedDate, 'yyyy-MM-dd')}
            </h2>
            <TargetList 
              selectedDate={format(selectedDate, 'yyyy-MM-dd')} 
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetSettings;