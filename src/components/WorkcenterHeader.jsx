const WorkcenterHeader = ({ workcenters }) => {
    return (
      <div className="grid grid-cols-[100px_repeat(9,1fr)] gap-1">
        <div className="h-14 font-bold text-center flex items-center justify-center bg-gray-800 text-white rounded">
          Time
        </div>
        
        {workcenters.map((workcenter) => (
          <div 
            key={workcenter} 
            className="h-14 font-bold text-center flex items-center justify-center bg-gray-800 text-white rounded"
          >
            <div className="text-lg">{workcenter}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default WorkcenterHeader;