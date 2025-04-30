// src/components/DashboardGrid.jsx
import { useState, useEffect } from 'react';
import WorkcenterHeader from './WorkcenterHeader';
import TimeSlotRow from './TimeSlotRow';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardGrid = ({ productionData, activeShift, mobileView, targetData = {} }) => {
  const { workcenters = [], data = {} } = productionData;
  const shiftData = data[activeShift] || [];
  const [hoverData, setHoverData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // For mobile tap interaction
  const [hourlyTargets, setHourlyTargets] = useState({});
  
  // Calculate total production for each workcenter
  const totals = workcenters.reduce((acc, workcenter) => {
    const total = shiftData.reduce((sum, hourData) => {
      return sum + (hourData[workcenter] || 0);
    }, 0);
    acc[workcenter] = total;
    return acc;
  }, {});

  // Process target data for each workcenter
  useEffect(() => {
    if (targetData && targetData.hourlyTargets) {
      // Filter for active shift
      const shiftTargets = targetData.hourlyTargets[activeShift] || {};
      setHourlyTargets(shiftTargets);
    }
  }, [targetData, activeShift]);

  // Handle mobile tap on cell
  const handleCellTap = (data) => {
    if (mobileView) {
      if (selectedCell && 
          selectedCell.workcenter === data.workcenter && 
          selectedCell.timeSlot === data.timeSlot) {
        setSelectedCell(null); // Toggle off if tapping the same cell
      } else {
        setSelectedCell(data); // Set new selected cell
      }
    }
  };

  // Calculate daily targets for workcenters
  const dailyTargets = {};
  if (targetData && targetData.dailyTargets) {
    Object.keys(targetData.dailyTargets).forEach(workcenter => {
      // Filter for the active shift
      if (targetData.dailyTargets[workcenter].shift === activeShift) {
        dailyTargets[workcenter] = targetData.dailyTargets[workcenter].planQty;
      }
    });
  }

  // No workcenters to display
  if (workcenters.length === 0) {
    return (
      <div className="w-full py-10 sm:py-16 flex flex-col items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-slate-400 text-sm sm:text-base text-center px-4">No workcenters to display for the selected section.</p>
        <button className="mt-1 sm:mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
          Select Another Section
        </button>
      </div>
    );
  }
  
  // Get target for the specific cell being hovered
  const getTargetForCell = (workcenter, timeSlot) => {
    if (hourlyTargets && hourlyTargets[workcenter]) {
      return hourlyTargets[workcenter];
    }
    return 85; // Default target if not available
  };

  return (
    <div className="w-full h-full">
      <div className="relative">
        {/* Floating info card on hover - Only on tablet and desktop */}
        {!mobileView && (
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
                    <span className="font-mono text-green-400">{hoverData.target || getTargetForCell(hoverData.workcenter, hoverData.timeSlot)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Variance</span>
                    <span className={`font-mono font-medium ${(hoverData.value || 0) >= (hoverData.target || 85) ? 'text-green-400' : 'text-red-400'}`}>
                      {((hoverData.value || 0) - (hoverData.target || 85)).toFixed(0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Mobile cell detail panel - shown when tapping a cell */}
        {mobileView && (
          <AnimatePresence>
            {selectedCell && (
              <motion.div 
                className="mb-4 bg-slate-800 shadow-lg rounded-lg border border-slate-700 p-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">{selectedCell.workcenter}</h3>
                    <span className="text-xs text-slate-400">Hour {selectedCell.timeSlot}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedCell(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="bg-slate-700/60 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Production</div>
                    <div className="font-mono font-bold text-lg">{selectedCell.value || 0}</div>
                  </div>
                  <div className="bg-slate-700/60 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Target</div>
                    <div className="font-mono text-green-400 text-lg">{selectedCell.target || getTargetForCell(selectedCell.workcenter, selectedCell.timeSlot)}</div>
                  </div>
                  <div className="bg-slate-700/60 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Variance</div>
                    <div className={`font-mono font-medium text-lg ${(selectedCell.value || 0) >= (selectedCell.target || 85) ? 'text-green-400' : 'text-red-400'}`}>
                      {((selectedCell.value || 0) - (selectedCell.target || 85)).toFixed(0)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Responsive grid layout */}
        <div className={`w-full space-y-2 ${mobileView ? 'overflow-x-auto pb-2' : ''}`}>
          {/* Scrollable container for mobile */}
          <div className={mobileView ? 'min-w-[600px]' : ''}>
            {/* Workcenters header with totals */}
            <div className="sticky top-0 z-10 bg-slate-900 pb-2">
              <WorkcenterHeader 
                workcenters={workcenters} 
                totals={totals}
                mobileView={mobileView}
                dailyTargets={dailyTargets}
              />
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
                  onCellTap={handleCellTap}
                  isSelected={selectedCell?.timeSlot === slotNumber}
                  selectedWorkcenter={selectedCell?.workcenter}
                  mobileView={mobileView}
                  hourlyTargets={hourlyTargets}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary section - Responsive grid for mobile */}
      <div className="mt-6 sm:mt-8 bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700/50">
        <h3 className="text-sm font-medium text-slate-300 mb-2 sm:mb-3">Shift Production Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {workcenters.map(workcenter => {
            // Get daily target for this workcenter if available
            const dailyTarget = dailyTargets[workcenter] || 600; // Default daily target
            
            return (
              <div key={workcenter} className="bg-slate-800 rounded-md p-2 sm:p-3 border border-slate-700">
                <div className="text-xs text-slate-400 mb-1 truncate">{workcenter}</div>
                <div className="text-lg sm:text-xl font-bold font-mono">{totals[workcenter] || 0}</div>
                <div className="mt-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (totals[workcenter] || 0) < (dailyTarget * 0.25) ? 'bg-red-500' :
                      (totals[workcenter] || 0) < (dailyTarget * 0.75) ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(((totals[workcenter] || 0) / dailyTarget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;