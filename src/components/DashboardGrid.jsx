import WorkcenterHeader from './WorkcenterHeader';
import TimeSlotRow from './TimeSlotRow';

const DashboardGrid = ({ productionData, activeShift }) => {
  const { workcenters = [], data = {} } = productionData;
  const shiftData = data[activeShift] || [];
  
  console.log('Workcenters:', workcenters);
  console.log('Shift Data:', shiftData);
  
  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div className="min-w-max p-2 space-y-2">
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