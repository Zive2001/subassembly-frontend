// src/components/DashboardGrid.jsx
import { useState } from 'react';
import WorkcenterHeader from './WorkcenterHeader';
import TimeSlotRow from './TimeSlotRow';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardGrid = ({ productionData, activeShift }) => {
  const { workcenters = [], data = {} } = productionData;
  const shiftData = data[activeShift] || [];
  const [hoverData, setHoverData] = useState(null);
  
  // Calculate total production for each workcenter
  const totals = workcenters.reduce((acc, workcenter) => {
    const total = shiftData.reduce((sum, hourData) => {
      return sum + (hourData[workcenter] || 0);
    }, 0);
    acc[workcenter] = total;
    return acc;
  }, {});
  
  // No workcenters to display
  if (workcenters.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-slate-400 text-base">No workcenters to display for the selected section.</p>
        <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
          Select Another Section
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <div className="relative">
        {/* Floating info card on hover */}
        <AnimatePresence>
          {hoverData && (
            <motion.div 
              className="absolute z-20 bg-slate-800 shadow-lg rounded-lg border border-slate-700 p-3 w-64"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ 
                top: hoverData.position.y - 100, 
                left: hoverData.position.x + 20 
              }}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white">{hoverData.workcenter}</h3>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                  Hour {hoverData.timeSlot}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Production</span>
                  <span className="font-mono font-bold text-lg">
                    {hoverData.value || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Target</span>
                  <span className="font-mono text-green-400">85</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Variance</span>
                  <span className={`font-mono font-medium ${(hoverData.value || 0) >= 85 ? 'text-green-400' : 'text-red-400'}`}>
                    {((hoverData.value || 0) - 85).toFixed(0)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid with sticky header */}
        <div className="w-full space-y-2">
          {/* Workcenters header with totals */}
          <div className="sticky top-0 z-10 bg-slate-900 pb-2">
            <WorkcenterHeader workcenters={workcenters} totals={totals} />
          </div>
          
          {/* Time slots rows */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((slotNumber) => (
              <TimeSlotRow 
                key={slotNumber}
                slotNumber={slotNumber}
                workcenters={workcenters}
                data={shiftData[slotNumber - 1] || {}}
                shift={activeShift}
                setHoverData={setHoverData}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Summary section */}
      <div className="mt-8 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Shift Production Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {workcenters.map(workcenter => (
            <div key={workcenter} className="bg-slate-800 rounded-md p-3 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">{workcenter}</div>
              <div className="text-xl font-bold font-mono">{totals[workcenter] || 0}</div>
              <div className="mt-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    (totals[workcenter] || 0) < 150 ? 'bg-red-500' :
                    (totals[workcenter] || 0) < 400 ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(((totals[workcenter] || 0) / 600) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;