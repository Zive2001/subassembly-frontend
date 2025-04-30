// src/components/ProductionCell.jsx
import { motion } from 'framer-motion';

const ProductionCell = ({ value, workcenter, timeSlot, setHoverData, onCellTap, isSelected, mobileView }) => {
  // Define color scale based on production value
  const getColorClass = (val) => {
    if (val === 0) return 'bg-[#1f1f1f] text-[#9e9e9e] border-[#2d2d2d]'; 
    if (val < 20) return 'bg-red-700 text-white'; 
    if (val < 80) return 'bg-amber-500 text-white'; 
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

  return (
    <motion.div 
      className={`h-14 w-full rounded-md flex items-center justify-center font-mono text-xl font-bold border ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-slate-900' : ''
      } ${getColorClass(value)}`}
      whileHover={!mobileView ? { scale: 1.05, transition: { duration: 0.2 } } : {}}
      whileTap={mobileView ? { scale: 0.95, transition: { duration: 0.1 } } : {}}
      onMouseEnter={handleInteraction}
      onMouseLeave={handleMouseLeave}
      onClick={mobileView ? handleInteraction : undefined}
    >
      {value || 0}
    </motion.div>
  );
};

export default ProductionCell;