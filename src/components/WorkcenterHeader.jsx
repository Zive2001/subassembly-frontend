// src/components/WorkcenterHeader.jsx
import { motion } from 'framer-motion';

const WorkcenterHeader = ({ workcenters, totals = {} }) => {
  return (
    <div className="grid grid-cols-[120px_repeat(auto-fill,minmax(100px,1fr))] gap-1.5">
      <div className="h-12 flex flex-col justify-center items-center bg-slate-800/80 rounded-lg border border-slate-700/80 backdrop-blur-sm">
        <div className="text-xs text-slate-400">Time Slot</div>
        <div className="text-sm font-semibold text-white">Hour</div>
      </div>
      
      {workcenters.map((workcenter) => (
        <motion.div 
          key={workcenter} 
          className="h-12 flex flex-col justify-center items-center bg-slate-800/80 rounded-lg border border-slate-700/80 backdrop-blur-sm relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-xs text-slate-400 mb-0.5">Workcenter</div>
          <div className="text-sm font-bold text-white">{workcenter}</div>
          
          {/* Show total if available */}
          {totals && totals[workcenter] !== undefined && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-700">
              <motion.div 
                className={`h-full ${
                  (totals[workcenter] || 0) < 150 ? 'bg-red-500' :
                  (totals[workcenter] || 0) < 400 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((totals[workcenter] || 0) / 600) * 100, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default WorkcenterHeader;