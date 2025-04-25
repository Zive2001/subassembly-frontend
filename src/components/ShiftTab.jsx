import { motion } from 'framer-motion';

const ShiftTab = ({ activeShift, setActiveShift }) => {
  return (
    <div className="flex bg-gray-800/30 rounded-xl w-full max-w-md mx-auto mb-6 relative overflow-hidden border border-gray-700/30 shadow-lg p-1">
      <motion.div 
        className="absolute h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg"
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
          activeShift === 'Morning' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        Morning Shift
      </button>
      
      <button
        onClick={() => setActiveShift('Evening')}
        className={`py-3 w-1/2 text-center font-medium relative z-10 transition-colors ${
          activeShift === 'Evening' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        Evening Shift
      </button>
    </div>
  );
};

export default ShiftTab;