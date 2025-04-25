import { motion } from 'framer-motion';

const ShiftTab = ({ activeShift, setActiveShift }) => {
  return (
    <div className="flex bg-gray-800 rounded-lg w-full max-w-xs mx-auto mb-5 relative overflow-hidden">
      <motion.div 
        className="absolute h-full bg-indigo-600 rounded-lg"
        initial={{ width: '50%', x: activeShift === 'Morning' ? 0 : '100%' }}
        animate={{ 
          x: activeShift === 'Morning' ? 0 : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ width: '50%' }}
      />
      
      <button
        onClick={() => setActiveShift('Morning')}
        className={`py-3 w-1/2 text-center font-medium relative z-10 transition-colors ${
          activeShift === 'Morning' ? 'text-white' : 'text-gray-400'
        }`}
      >
        Morning Shift
      </button>
      
      <button
        onClick={() => setActiveShift('Evening')}
        className={`py-3 w-1/2 text-center font-medium relative z-10 transition-colors ${
          activeShift === 'Evening' ? 'text-white' : 'text-gray-400'
        }`}
      >
        Evening Shift
      </button>
    </div>
  );
};

export default ShiftTab;