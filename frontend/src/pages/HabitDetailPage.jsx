import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHabitAnalytics,
  fetchHabitTimeline,
  fetchHabitHeatmap,
  fetchHabitAchievements,
  logHabit,
  skipHabit,
  clearAnalyticsState
} from '../features/habitSlice';
import HabitAnalyticsCard from '../components/habits/HabitAnalyticsCard';
import HabitTimeline from '../components/habits/HabitTimeline';
import HabitHeatmap from '../components/habits/HabitHeatmap';
import HabitAchievements from '../components/habits/HabitAchievements';
import SkipReasonDialog from '../components/habits/SkipReasonDialog';
import HabitInsights from '../components/habits/HabitInsights';
import { ArrowLeft, Check, X } from 'lucide-react';
import dayjs from 'dayjs';

const HabitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { habits, analytics, timeline, heatmap, achievements, loading } = useSelector((state) => state.habits);
  const habit = habits.find((h) => h.id === parseInt(id));

  const [skipDialogOpen, setSkipDialogOpen] = useState(false);

  useEffect(() => {
    // If we refresh on this page, we might need to fetch all habits first
    // In a real app we'd fetch just the single habit, but we rely on the state here.
    if (habit) {
      dispatch(fetchHabitAnalytics(habit.id));
      dispatch(fetchHabitTimeline(habit.id));
      dispatch(fetchHabitHeatmap(habit.id));
      dispatch(fetchHabitAchievements(habit.id));
    }

    return () => {
      dispatch(clearAnalyticsState());
    };
  }, [dispatch, habit]);

  if (!habit) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Loading habit or habit not found...</p>
      </div>
    );
  }

  const handleCompleteToday = () => {
    dispatch(logHabit({ id: habit.id, date: dayjs().format('YYYY-MM-DD'), completed: true }));
    // Ideally refetch analytics after an action, but we simulate it for now
  };

  const handleSkipSubmit = (reason, notes) => {
    dispatch(skipHabit({ id: habit.id, date: dayjs().format('YYYY-MM-DD'), reason, notes }));
    setSkipDialogOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/habits')}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Habits
        </button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{habit.title}</h1>
            {habit.purpose && (
              <p className="text-gray-600 mt-2 italic text-lg border-l-4 border-blue-500 pl-3">
                "{habit.purpose}"
              </p>
            )}
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>Created: {dayjs(habit.createdAt).format('MMM D, YYYY')}</span>
              <span>•</span>
              <span>Frequency: {habit.frequency}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSkipDialogOpen(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium shadow-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Skip Today
            </button>
            <button
              onClick={handleCompleteToday}
              className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
            >
              <Check className="w-5 h-5 mr-2" />
              Complete Today
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Metrics) */}
        <div className="lg:col-span-2 space-y-6">
          <HabitAnalyticsCard habit={habit} analytics={analytics} />
          <HabitHeatmap heatmap={heatmap} />
          <HabitTimeline timeline={timeline} />
        </div>

        {/* Right Column (Insights & Achievements) */}
        <div className="space-y-6">
          <HabitInsights analytics={analytics} habit={habit} />
          <HabitAchievements achievements={achievements} currentStreak={habit.streak} bestStreak={habit.bestStreak} />
        </div>
      </div>

      <SkipReasonDialog
        open={skipDialogOpen}
        onClose={() => setSkipDialogOpen(false)}
        onSubmit={handleSkipSubmit}
      />
    </div>
  );
};

export default HabitDetailPage;
