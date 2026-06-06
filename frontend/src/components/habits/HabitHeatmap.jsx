import React from 'react';
import { CalendarDays } from 'lucide-react';

const HabitHeatmap = ({ heatmap = [] }) => {
  // Generate 365 days of dummy data if empty
  const days = heatmap.length > 0 ? heatmap : Array.from({ length: 365 }).map(() => Math.floor(Math.random() * 5));

  const getColor = (level) => {
    switch (level) {
      case 1: return 'bg-blue-200';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-blue-600';
      case 4: return 'bg-blue-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <CalendarDays className="w-5 h-5 mr-2 text-blue-500" />
          Consistency Heatmap
        </h2>
      </div>
      <div className="p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}>
            {days.map((level, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-sm ${getColor(level)}`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-end items-center mt-4 text-xs text-gray-500 gap-2">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded-sm bg-gray-100" />
            <div className="w-3.5 h-3.5 rounded-sm bg-blue-200" />
            <div className="w-3.5 h-3.5 rounded-sm bg-blue-400" />
            <div className="w-3.5 h-3.5 rounded-sm bg-blue-600" />
            <div className="w-3.5 h-3.5 rounded-sm bg-blue-800" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitHeatmap;
