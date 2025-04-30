import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getTargetsByDate } from '../services/targetService';

const TargetList = ({ selectedDate, refreshTrigger }) => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTargets = async () => {
      setLoading(true);
      try {
        // Format date to ISO string for the API
        const dateString = selectedDate || format(new Date(), 'yyyy-MM-dd');
        const isoDateString = new Date(dateString).toISOString();
        
        const data = await getTargetsByDate(isoDateString);
        setTargets(data);
        setError(null);
      } catch (err) {
        setError('Failed to load targets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTargets();
  }, [selectedDate, refreshTrigger]);

  if (loading) {
    return <div className="text-center p-4">Loading targets...</div>;
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
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No targets set for this date. Use the form above to set targets.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workcenter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target/Hour
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {targets.map((target, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {target.workcenter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {target.shift}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {target.planQty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {target.hours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.round(target.planQty / target.hours)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TargetList;