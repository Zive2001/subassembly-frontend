// src/components/TimeSlotRow.jsx
import ProductionCell from './ProductionCell';
import { timeSlotToLabel } from '../utils/formatters';
import { motion } from 'framer-motion';

const TimeSlotRow = ({ 
  slotNumber, 
  workcenters, 
  data, 
  shift, 
  setHoverData, 
  onCellTap,
  isSelected,
  selectedWorkcenter,
  mobileView
}) => {
  const timeSlotLabel = timeSlotToLabel(slotNumber)[shift.toLowerCase()];
  
  return (
    <motion.div 
      className="grid grid-cols-[80px_repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[120px_repeat(auto-fill,minmax(100px,1fr))] gap-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: slotNumber * 0.03 }}
    >
      {/* Time slot label */}
      <div className={`bg-slate-800/80 text-white rounded-lg border border-slate-700/50 flex flex-col items-center justify-center py-1.5 ${
        isSelected ? 'bg-slate-700 border-slate-600' : ''
      }`}>
        <div className="text-lg font-bold text-white">{slotNumber}</div>
        <div className="text-xs text-slate-400">{timeSlotLabel}</div>
      </div>
      
      {/* Production cells for each workcenter */}
      {workcenters.map((workcenter) => (
        <div key={workcenter} className="h-full">
          <ProductionCell 
            value={data[workcenter] || 0} 
            workcenter={workcenter}
            timeSlot={slotNumber}
            setHoverData={setHoverData}
            onCellTap={onCellTap}
            isSelected={isSelected && selectedWorkcenter === workcenter}
            mobileView={mobileView}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default TimeSlotRow;