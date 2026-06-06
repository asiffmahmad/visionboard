import React from 'react';
import { Lightbulb } from 'lucide-react';

const HabitInsights = ({ analytics, habit }) => {
  // Mock insights based on analytics
  const insights = [
    `You are most consistent on ${analytics?.mostSuccessfulDay || 'Mondays'}.`,
    `"${analytics?.mostCommonSkipReason || 'Busy'}" is your most common reason for skipping.`,
    `Your current streak is ${habit.bestStreak - habit.streak > 0 ? (habit.bestStreak - habit.streak) + ' days away from' : 'matching'} your all-time record.`
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-yellow-50/50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          AI Insights
        </h2>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 mr-3 shrink-0"></span>
              <p className="text-gray-700 leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HabitInsights;
