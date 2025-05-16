import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTargetsByDate } from '../services/targetService';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ExclamationCircleIcon, 
  ArrowsUpDownIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TargetList = ({ selectedDate, refreshTrigger }) => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTarget, setExpandedTarget] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'workcenter', direction: 'ascending' });

  useEffect(() => {
    fetchTargets();
  }, [selectedDate, refreshTrigger]);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const data = await getTargetsByDate(selectedDate);
      setTargets(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching targets:', err);
      setError('Failed to load targets');
      setLoading(false);
    }
  };

  const toggleExpand = (targetId) => {
    if (expandedTarget === targetId) {
      setExpandedTarget(null);
    } else {
      setExpandedTarget(targetId);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedTargets = () => {
    if (!sortConfig.key) return targets;
    
    return [...targets].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowsUpDownIcon className="h-3 w-3 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <ChevronUpIcon className="h-3 w-3 ml-1" /> : 
      <ChevronDownIcon className="h-3 w-3 ml-1" />;
  };

  // Calculate efficiency percentage
  const calculateEfficiency = (target) => {
    if (!target.smv || !target.teamMemberCount || !target.hours || !target.planQty) {
      return null;
    }
    
    const minutesAvailable = target.hours * 60 * target.teamMemberCount;
    const minutesRequired = target.planQty * target.smv;
    return (minutesRequired / minutesAvailable) * 100;
  };

  // Get appropriate color class based on efficiency
  const getEfficiencyColorClass = (efficiency) => {
    if (efficiency === null) return 'text-gray-400';
    if (efficiency < 75) return 'text-red-500';
    if (efficiency < 90) return 'text-yellow-500';
    if (efficiency < 100) return 'text-gray-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading targets...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
        {error}
      </motion.div>
    );
  }

  if (targets.length === 0) {
    return (
      <motion.div 
        className="text-center py-10 text-gray-500 bg-gray-50 rounded-md border border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ClipboardIcon className="h-10 w-10 mx-auto text-gray-300 mb-3" />
        <p className="text-base font-medium mb-1">No targets set for this date</p>
        <p className="text-sm text-gray-400">Use the form above to set new production targets</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-md border border-gray-100 overflow-hidden">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-xs leading-normal">
            <th 
              className="py-2 px-3 text-left font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('workcenter')}
            >
              <div className="flex items-center">
                <span>Workcenter</span>
                {getSortIcon('workcenter')}
              </div>
            </th>
            <th 
              className="py-2 px-3 text-left font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('shift')}
            >
              <div className="flex items-center">
                <span>Shift</span>
                {getSortIcon('shift')}
              </div>
            </th>
            <th 
              className="py-2 px-3 text-right font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('planQty')}
            >
              <div className="flex items-center justify-end">
                <span>Plan Qty</span>
                {getSortIcon('planQty')}
              </div>
            </th>
            <th 
              className="py-2 px-3 text-right font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('hours')}
            >
              <div className="flex items-center justify-end">
                <span>Hours</span>
                {getSortIcon('hours')}
              </div>
            </th>
            <th 
              className="py-2 px-3 text-right font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('teamMemberCount')}
            >
              <div className="flex items-center justify-end">
                <span>Team</span>
                {getSortIcon('teamMemberCount')}
              </div>
            </th>
            <th 
              className="py-2 px-3 text-right font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('smv')}
            >
              <div className="flex items-center justify-end">
                <span>SMV</span>
                {getSortIcon('smv')}
              </div>
            </th>
            <th 
              className="py-2 px-3 text-center font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort('efficiency')}
            >
              <div className="flex items-center justify-center">
                <span>Efficiency</span>
                {getSortIcon('efficiency')}
              </div>
            </th>
            <th className="py-2 px-3 text-center font-medium">
              <span>Details</span>
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-xs">
          {getSortedTargets().map((target) => {
            const efficiency = calculateEfficiency(target);
            const efficiencyColorClass = getEfficiencyColorClass(efficiency);
            
            return (
              <React.Fragment key={target.targetId}>
                <motion.tr 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="py-2 px-3 text-left font-medium">{target.workcenter}</td>
                  <td className="py-2 px-3 text-left">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      target.shift === 'Morning' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {target.shift}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-medium">{target.planQty}</td>
                  <td className="py-2 px-3 text-right font-mono">{target.hours}</td>
                  <td className="py-2 px-3 text-right font-mono">{target.teamMemberCount || 1}</td>
                  <td className="py-2 px-3 text-right font-mono">{target.smv || 0}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${efficiencyColorClass} ${
                      efficiency !== null ? 
                        (efficiency < 75 ? 'bg-red-50 border border-red-200' : 
                         efficiency < 90 ? 'bg-yellow-50 border border-yellow-200' : 
                         efficiency < 100 ? 'bg-gray-100 border border-gray-200' : 
                         'bg-green-50 border border-green-200')
                      : 'bg-gray-50 border border-gray-200'
                    }`}>
                      {efficiency !== null ? `${efficiency.toFixed(1)}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => toggleExpand(target.targetId)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        expandedTarget === target.targetId 
                          ? 'bg-gray-800 text-white hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {expandedTarget === target.targetId ? 'Hide' : 'View'}
                    </button>
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {expandedTarget === target.targetId && target.timeSlotTargets && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td colSpan="8" className="px-4 py-3 bg-gray-50">
                        <div className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                          Hourly Breakdown
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                          {target.timeSlotTargets.map((slot) => (
                            <div 
                              key={slot.timeSlot} 
                              className="bg-white rounded-md border border-gray-200 p-2 flex justify-between shadow-sm"
                            >
                              <span className="text-xs font-medium text-gray-600">{slot.timeSlot}</span>
                              <span className="text-xs font-mono font-bold text-gray-800">{slot.targetQty}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Target statistics */}
                        <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-white p-2 rounded-md border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Hourly Rate</div>
                            <div className="text-base font-mono font-medium text-gray-800">
                              {Math.round(target.planQty / target.hours)}
                            </div>
                          </div>
                          
                          <div className="bg-white p-2 rounded-md border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Per Person</div>
                            <div className="text-base font-mono font-medium text-gray-800">
                              {Math.round(target.planQty / target.teamMemberCount)}
                            </div>
                          </div>
                          
                          <div className="bg-white p-2 rounded-md border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Total Minutes</div>
                            <div className="text-base font-mono font-medium text-gray-800">
                              {Math.round(target.planQty * (target.smv || 0))}
                            </div>
                          </div>
                          
                          <div className="bg-white p-2 rounded-md border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                            <div className={`text-base font-mono font-medium ${efficiencyColorClass}`}>
                              {efficiency !== null ? `${efficiency.toFixed(1)}%` : 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <button className="flex items-center text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                            <DocumentDuplicateIcon className="h-3.5 w-3.5 mr-1" />
                            Duplicate Target
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TargetList;