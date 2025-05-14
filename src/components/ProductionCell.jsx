import { motion } from 'framer-motion';

const ProductionCell = ({ value, workcenter, timeSlot, setHoverData, onCellTap, isSelected, mobileView, target = 0 }) => {
  // Define color scale based on production value compared to target
  const getColorClass = (val, targetVal) => {
    if (targetVal === 0) return 'bg-[#1f1f1f] text-[#9e9e9e] border-[#2d2d2d]';
    if (val === 0) return 'bg-[#1f1f1f] text-[#9e9e9e] border-[#2d2d2d]'; 
    
    // Calculate percentage of target achieved
    const percentage = (val / targetVal) * 100;
    
    if (percentage < 50) return 'bg-red-700 text-white'; 
    if (percentage < 90) return 'bg-amber-500 text-white'; 
    return 'bg-emerald-600 text-white'; 
  };

  // For mobile, we handle tap events instead of hover
  const handleInteraction = (e) => {
    if (mobileView) {
      // For mobile, trigger the tap handler with data about this cell
      if (onCellTap) {
        onCellTap({
          workcenter,
          timeSlot,
          value,
          target,
          // Not actually used for position in mobile mode
          position: { x: 0, y: 0 }
        });
      }
    } else {
      // Desktop hover behavior
      if (setHoverData) {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverData({
          workcenter,
          timeSlot,
          value,
          target,
          position: { x: rect.x, y: rect.y }
        });
      }
    }
  };
  
  const handleMouseLeave = () => {
    if (!mobileView && setHoverData) {
      setHoverData(null);
    }
  };

  // Safe target value
  const safeTarget = target || 0;

  return (
    <motion.div 
      className={`h-14 w-full rounded-md flex items-center justify-center font-mono text-xl font-bold border ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-slate-900' : ''
      } ${getColorClass(value || 0, safeTarget)}`}
      whileHover={!mobileView ? { scale: 1.05, transition: { duration: 0.2 } } : {}}
      whileTap={mobileView ? { scale: 0.95, transition: { duration: 0.1 } } : {}}
      onMouseEnter={handleInteraction}
      onMouseLeave={handleMouseLeave}
      onClick={mobileView ? handleInteraction : undefined}
    >
      <div className="flex flex-col items-center">
        <span>{value || 0}</span>
        {safeTarget > 0 && (
          <span className="text-xs opacity-80 -mt-1">{`/${safeTarget}`}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ProductionCell;