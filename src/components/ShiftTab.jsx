// src/components/ShiftTab.jsx
import { motion } from 'framer-motion';

const ShiftTab = ({ activeShift, setActiveShift }) => {
  return (
    <div className="bg-slate-800/80 rounded-lg p-1 w-full relative overflow-hidden">
      <motion.div 
        className="absolute top-1 bottom-1 bg-blue-600 rounded"
        initial={{ width: '50%', x: activeShift === 'Morning' ? 0 : '100%' }}
        animate={{ 
          x: activeShift === 'Morning' ? 0 : '50%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ width: '50%' }}
      />
      
      <div className="grid grid-cols-2 relative z-10">
        <button
          onClick={() => setActiveShift('Morning')}
          className={`py-2 text-center font-medium text-sm transition-colors duration-200 ${
            activeShift === 'Morning' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Morning
          </div>
        </button>
        
        <button
          onClick={() => setActiveShift('Evening')}
          className={`py-2 text-center font-medium text-sm transition-colors duration-200 ${
            activeShift === 'Evening' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Evening
          </div>
        </button>
      </div>
    </div>
  );
};

export default ShiftTab;