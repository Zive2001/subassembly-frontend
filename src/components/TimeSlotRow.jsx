import ProductionCell from './ProductionCell';
import { timeSlotToLabel } from '../utils/formatters';

const TimeSlotRow = ({ slotNumber, workcenters, data, shift }) => {
  const timeSlotLabel = timeSlotToLabel(slotNumber)[shift.toLowerCase()];
  
  // Debug log to see what data we're receiving
  console.log(`Time Slot ${slotNumber} Data:`, data);
  
  return (
    <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(120px,1fr))] gap-2 h-16">
      {/* Time slot label */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center border border-indigo-500/30">
        <div className="text-xl font-bold">{slotNumber}</div>
        <div className="text-xs opacity-80">{timeSlotLabel}</div>
      </div>
      
      {/* Production cells for each workcenter */}
      {workcenters.map((workcenter) => (
        <div key={workcenter} className="h-full">
          <ProductionCell value={data[workcenter] || 0} />
        </div>
      ))}
    </div>
  );
};

export default TimeSlotRow;