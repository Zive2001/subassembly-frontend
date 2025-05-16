import ProductionCell from './ProductionCell';
import { timeSlotToLabel } from '../utils/formatters';
import { motion } from 'framer-motion';
import { useState } from 'react';

const TimeSlotRow = ({ 
  slotNumber, 
  workcenters, 
  data, 
  targetData = {}, 
  shift, 
  setHoverData, 
  onCellTap,
  isSelected,
  selectedWorkcenter,
  mobileView,
  hourlyTargets = {} 
}) => {
  const [showTimeLabel, setShowTimeLabel] = useState(false);
  const timeSlotLabel = timeSlotToLabel(slotNumber)[shift.toLowerCase()];
  
  // Function to get the target for a workcenter
  const getTargetForWorkcenter = (workcenter) => {
    // First try the new format
    if (targetData && targetData[workcenter] && typeof targetData[workcenter] === 'object') {
      return targetData[workcenter].target || 0;
    }
    
    // Fallback to old format
    return hourlyTargets[workcenter] || 85;
  };

  return (
    <motion.div 
      className="grid grid-cols-[80px_repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[120px_repeat(auto-fill,minmax(100px,1fr))] gap-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: slotNumber * 0.03 }}
    >
      {/* Time slot label - modified to show number and time range on hover */}
      <div 
        className={`bg-slate-800/80 text-white rounded-lg border border-slate-700/50 flex flex-col items-center justify-center py-1.5 ${
          isSelected ? 'bg-slate-700 border-slate-600' : ''
        }`}
        onMouseEnter={() => setShowTimeLabel(true)}
        onMouseLeave={() => setShowTimeLabel(false)}
      >
        <div className="text-lg font-bold text-white">{slotNumber}</div>
        {/* Only show time label on hover */}
        {showTimeLabel && (
          <div className="text-xs text-slate-400">{timeSlotLabel}</div>
        )}
      </div>
      
      {/* Production cells for each workcenter */}
      {workcenters.map((workcenter) => {
        // Get the target value
        const targetValue = getTargetForWorkcenter(workcenter);
        
        // Get status if available
        const status = targetData[workcenter]?.status || 'grey';
        
        return (
          <div key={workcenter} className="h-full">
            <ProductionCell 
              value={data[workcenter] || 0} 
              workcenter={workcenter}
              timeSlot={slotNumber}
              setHoverData={setHoverData}
              onCellTap={onCellTap}
              isSelected={isSelected && selectedWorkcenter === workcenter}
              mobileView={mobileView}
              target={targetValue}
              status={status}
            />
          </div>
        );
      })}
    </motion.div>
  );
};

export default TimeSlotRow;