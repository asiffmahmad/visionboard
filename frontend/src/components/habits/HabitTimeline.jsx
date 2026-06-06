import React from 'react';
import { History, CheckCircle2, XCircle, FileText } from 'lucide-react';
import dayjs from 'dayjs';

const HabitTimeline = ({ timeline = [] }) => {
  // If backend not fully wired, use dummy data
  const logs = timeline.length > 0 ? timeline : [
    { date: '2026-06-05', status: 'COMPLETED', skipReason: null, notes: null },
    { date: '2026-06-04', status: 'COMPLETED', skipReason: null, notes: 'Felt great today!' },
    { date: '2026-06-03', status: 'SKIPPED', skipReason: 'Busy', notes: 'Worked until midnight' },
    { date: '2026-06-02', status: 'COMPLETED', skipReason: null, notes: null },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <History className="w-5 h-5 mr-2 text-blue-500" />
          Habit History
        </h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {logs.map((log, i) => {
            const isCompleted = log.status === 'COMPLETED';
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  {i !== logs.length - 1 && <div className="w-0.5 h-full bg-gray-100 mt-2"></div>}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">
                      {isCompleted ? 'Completed' : 'Skipped'}
                    </h3>
                    <span className="text-sm text-gray-500">{dayjs(log.date).format('MMMM D, YYYY')}</span>
                  </div>
                  
                  {log.skipReason && (
                    <div className="inline-block px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold mb-2">
                      Reason: {log.skipReason}
                    </div>
                  )}

                  {log.notes && (
                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 flex items-start border border-gray-100">
                      <FileText className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
                      <p>{log.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HabitTimeline;
