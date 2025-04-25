const ProductionCell = ({ value }) => {
    // Define color scale based on production value
    // Assuming higher values are better
    const getColorClass = (val) => {
        if (val === 0) return 'bg-[#1f1f1f] text-[#9e9e9e] border-[#2d2d2d]'; 
        if (val < 20) return 'bg-[#ae2012] text-[#edede9]'; 
        if (val < 80) return 'bg-[#fca311] text-[#edede9]'; 
        return 'bg-[#2a9d8f] text-[#edede9]'; 
      };
      
  
    return (
      <div 
        className={`h-full w-full rounded flex items-center justify-center font-mono text-xl font-bold ${getColorClass(value)}`}
      >
        {value || 0}
      </div>
    );
  };
  
  export default ProductionCell;
  