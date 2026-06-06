import React from 'react';
import { Award, Zap } from 'lucide-react';

const HabitAchievements = ({ achievements = [], currentStreak, bestStreak }) => {
  // Mock achievements
  const badges = achievements.length > 0 ? achievements : [
    { title: '7 Day Streak', type: '7_DAY_STREAK', unlocked: true },
    { title: '30 Day Streak', type: '30_DAY_STREAK', unlocked: false },
    { title: 'Perfect Month', type: 'PERFECT_MONTH', unlocked: false },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl border border-indigo-800 shadow-sm overflow-hidden text-white">
      <div className="p-6 border-b border-indigo-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-400" />
          Achievements
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2 text-indigo-200">
            <span>Next Milestone: 30 Days</span>
            <span>{currentStreak} / 30</span>
          </div>
          <div className="w-full bg-indigo-950 rounded-full h-2.5">
            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, i) => (
            <div key={i} className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${badge.unlocked ? 'bg-indigo-800/50 border-indigo-700' : 'bg-indigo-950/50 border-indigo-900/50 opacity-50'}`}>
              <Zap className={`w-8 h-8 mb-2 ${badge.unlocked ? 'text-yellow-400' : 'text-gray-500'}`} />
              <span className="text-sm font-bold">{badge.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitAchievements;
