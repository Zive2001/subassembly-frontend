const WorkcenterHeader = ({ workcenters }) => {
    return (
      <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(80px,1fr))] gap-2">
        <div className="h-16 font-bold text-center flex items-center justify-center bg-gray-800/70 text-gray-200 rounded-lg shadow-md border border-gray-700/40">
          Time
        </div>
        
        {workcenters.map((workcenter) => (
          <div 
            key={workcenter} 
            className="h-16 font-bold text-center flex items-center justify-center bg-gray-800/70 text-gray-200 rounded-lg shadow-md border border-gray-700/40 overflow-hidden backdrop-blur-sm"
          >
            <div className="text-lg">{workcenter}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default WorkcenterHeader;