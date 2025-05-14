import React, { useState, useEffect } from 'react';
import { getTargetsByDate } from '../services/targetService';

const TargetList = ({ selectedDate, refreshTrigger }) => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTarget, setExpandedTarget] = useState(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (targets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No targets set for this date. Use the form on the left to set targets.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-4 text-left">Workcenter</th>
            <th className="py-3 px-4 text-left">Shift</th>
            <th className="py-3 px-4 text-right">Plan Qty</th>
            <th className="py-3 px-4 text-right">Hours</th>
            <th className="py-3 px-4 text-right">Team Members</th>
            <th className="py-3 px-4 text-right">SMV</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {targets.map((target) => (
            <React.Fragment key={target.targetId}>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-left">{target.workcenter}</td>
                <td className="py-3 px-4 text-left">{target.shift}</td>
                <td className="py-3 px-4 text-right font-mono">{target.planQty}</td>
                <td className="py-3 px-4 text-right font-mono">{target.hours}</td>
                <td className="py-3 px-4 text-right font-mono">{target.teamMemberCount || 1}</td>
                <td className="py-3 px-4 text-right font-mono">{target.smv || 0}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleExpand(target.targetId)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    {expandedTarget === target.targetId ? 'Hide Details' : 'Show Details'}
                  </button>
                </td>
              </tr>
              {expandedTarget === target.targetId && target.timeSlotTargets && (
                <tr>
                  <td colSpan="7" className="px-4 py-3 bg-gray-50">
                    <div className="text-sm font-medium mb-2">Hourly Targets:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {target.timeSlotTargets.sort((a, b) => a.position - b.position).map((slot) => (
                        <div key={slot.timeSlot} className="bg-white rounded border p-2 flex justify-between">
                          <span className="text-xs font-medium">{slot.timeSlot}</span>
                          <span className="text-xs font-mono">{slot.targetQty}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TargetList;