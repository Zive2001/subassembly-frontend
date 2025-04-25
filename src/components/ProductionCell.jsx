import { motion } from 'framer-motion';
import { getProductionColor } from '../utils/formatters';

const ProductionCell = ({ value }) => {
  const displayValue = value === 0 ? '-' : value;
  const cellColor = getProductionColor(value);
  
  return (
    <motion.div 
      className={`${cellColor} rounded-lg shadow-md flex items-center justify-center text-2xl font-bold h-full text-gray-800`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue}
    </motion.div>
  );
};

export default ProductionCell;