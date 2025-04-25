import ProductionCell from './ProductionCell';
import { timeSlotToLabel } from '../utils/formatters';

const TimeSlotRow = ({ slotNumber, workcenters, data, shift }) => {
  const timeSlotLabel = timeSlotToLabel(slotNumber)[shift.toLowerCase()];
  
  // Debug log to see what data we're receiving
  console.log(`Time Slot ${slotNumber} Data:`, data);
  
  return (
    <div className="grid grid-cols-[100px_repeat(9,1fr)] gap-1 h-16">
      {/* Time slot label */}
      <div className="bg-[#415a77] text-white rounded flex flex-col items-center justify-center">
        <div className="text-xl font-bold">{slotNumber}</div>
        <div className="text-xs">{timeSlotLabel}</div>
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