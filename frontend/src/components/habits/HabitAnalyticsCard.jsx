import React from 'react';
import { Activity, Target, TrendingUp, CalendarDays } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HabitAnalyticsCard = ({ habit, analytics }) => {
  // Mock trend data if analytics not fully wired
  const data = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 70 },
    { name: 'Wed', score: 85 },
    { name: 'Thu', score: 80 },
    { name: 'Fri', score: 90 },
    { name: 'Sat', score: 95 },
    { name: 'Sun', score: 100 },
  ];

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-500 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  const healthStyle = getHealthColor(habit.healthScore || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Habit Intelligence
        </h2>
        <div className={`px-4 py-1.5 rounded-full border font-bold ${healthStyle}`}>
          Health Score: {Math.round(habit.healthScore || 0)}/100
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="p-6">
          <div className="text-sm font-medium text-gray-500 mb-1 flex items-center">
            <Target className="w-4 h-4 mr-1 text-gray-400" /> Current Streak
          </div>
          <div className="text-3xl font-bold text-gray-900">{habit.streak} <span className="text-lg text-gray-400 font-normal">days</span></div>
        </div>
        <div className="p-6">
          <div className="text-sm font-medium text-gray-500 mb-1 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-gray-400" /> Best Streak
          </div>
          <div className="text-3xl font-bold text-gray-900">{habit.bestStreak || 0} <span className="text-lg text-gray-400 font-normal">days</span></div>
        </div>
        <div className="p-6">
          <div className="text-sm font-medium text-gray-500 mb-1 flex items-center">
            <Activity className="w-4 h-4 mr-1 text-gray-400" /> Completion Rate
          </div>
          <div className="text-3xl font-bold text-gray-900">{Math.round(habit.completionRate || 0)}<span className="text-lg text-gray-400 font-normal">%</span></div>
        </div>
        <div className="p-6">
          <div className="text-sm font-medium text-gray-500 mb-1 flex items-center">
            <CalendarDays className="w-4 h-4 mr-1 text-gray-400" /> Days Active
          </div>
          <div className="text-3xl font-bold text-gray-900">{habit.daysActive || 0} <span className="text-lg text-gray-400 font-normal">days</span></div>
        </div>
      </div>

      {/* Mini Trend Chart */}
      <div className="h-48 w-full p-6 pt-0 bg-gray-50/50">
        <div className="text-sm font-medium text-gray-500 mb-4">7-Day Success Trend</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HabitAnalyticsCard;
