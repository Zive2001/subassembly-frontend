// src/components/DashboardGrid.jsx
import WorkcenterHeader from './WorkcenterHeader';
import TimeSlotRow from './TimeSlotRow';
import { getSectionForWorkcenter } from '../utils/sectionConfig';

const DashboardGrid = ({ productionData, activeShift }) => {
  const { workcenters = [], data = {} } = productionData;
  const shiftData = data[activeShift] || [];
  
  // No workcenters to display
  if (workcenters.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <p className="text-gray-400 text-lg">No workcenters to display for the selected section.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full overflow-visible">
      <div className="w-full p-2 space-y-1">
        {/* Display workcenters as column headers */}
        <WorkcenterHeader workcenters={workcenters} />
        
        {/* Display time slots as rows with production data for each workcenter */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((slotNumber) => (
          <TimeSlotRow 
            key={slotNumber}
            slotNumber={slotNumber}
            workcenters={workcenters}
            data={shiftData[slotNumber - 1] || {}}
            shift={activeShift}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardGrid;