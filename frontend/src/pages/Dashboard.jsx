import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Grid } from '@mui/material'
import { Alert } from '@mui/material'

import LoadingSpinner from '../components/LoadingSpinner'
import ToastNotification from '../components/ToastNotification'

import { fetchDashboardStats } from '../services/dashboardService'
import { updateTaskStatus } from '../services/taskService'
import { fetchActiveAnnouncements } from '../features/announcementSlice'
import { fetchVisions } from '../features/visionSlice'
import { fetchGoals } from '../features/goalSlice'
import { fetchHabits } from '../features/habitSlice'
import { fetchTasks } from '../services/taskService'

// Custom Components
import DashboardHero from '../components/dashboard/DashboardHero'
import VisionProgressCard from '../components/dashboard/VisionProgressCard'
import FocusTasksCard from '../components/dashboard/FocusTasksCard'
import GoalRadarCard from '../components/dashboard/GoalRadarCard'
import HabitHeatmapCard from '../components/dashboard/HabitHeatmapCard'
import WeeklyProgressCard from '../components/dashboard/WeeklyProgressCard'
import RecentWinsCard from '../components/dashboard/RecentWinsCard'
import QuickActionsCard from '../components/dashboard/QuickActionsCard'
import FocusInsightsCard from '../components/dashboard/FocusInsightsCard'
import UpcomingDeadlinesCard from '../components/dashboard/UpcomingDeadlinesCard'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { stats, loading, error } = useSelector((state) => state.dashboard)
  const { activeAnnouncements } = useSelector((state) => state.announcements)
  const { visions } = useSelector((state) => state.visions)
  const { goals } = useSelector((state) => state.goals)
  const { items: tasks } = useSelector((state) => state.tasks || { items: [] })
  const { habits } = useSelector((state) => state.habits || { habits: [] })

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  useEffect(() => {
    fetchDashboardStats()
    fetchTasks()
    dispatch(fetchActiveAnnouncements())
    dispatch(fetchVisions())
    dispatch(fetchGoals())
    dispatch(fetchHabits())
  }, [dispatch])

  const handleTaskComplete = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
      await updateTaskStatus(id, nextStatus)
      fetchDashboardStats()
      fetchTasks()
      setToastMessage('Task status updated!')
      setToastSeverity('success')
      setToastOpen(true)
    } catch (err) {
      setToastMessage('Failed to update task status.')
      setToastSeverity('error')
      setToastOpen(true)
    }
  }

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>{error}</Box>
  if (!stats) return null

  // Safe mappings
  const safeVisions = Array.isArray(visions) ? visions : []
  const safeGoals = Array.isArray(goals) ? goals : []
  const safeTasks = Array.isArray(tasks) ? tasks : []
  const safeHabits = Array.isArray(habits) ? habits : []
  
  const activeVision = safeVisions.length > 0 ? safeVisions[0] : null
  const activeGoal = safeGoals.length > 0 ? safeGoals[0] : null
  const topTask = safeTasks.filter(t => t.status !== 'COMPLETED')[0]

  return (
    <Box sx={{ pb: 6, bgcolor: 'background.default', minHeight: '100vh', mt: -3, pt: 3, px: { xs: 0, sm: 2 } }}>
      {/* Announcements Banner */}
      {activeAnnouncements && activeAnnouncements.map(announcement => (
        <Alert severity="info" sx={{ mb: 3 }} key={announcement.id}>
          <strong>{announcement.title}</strong>: {announcement.content}
        </Alert>
      ))}

      {/* Hero Section */}
      <DashboardHero 
        user={user} 
        activeVision={activeVision} 
        activeGoal={activeGoal} 
        topTask={topTask} 
        streak={stats.bestStreak} 
      />

      {/* 3-Column Layout (Carousel on Mobile) */}
      <Box 
        role="region" 
        aria-label="Dashboard widgets carousel"
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'row', md: 'row' },
          overflowX: { xs: 'auto', md: 'visible' }, 
          scrollSnapType: { xs: 'x mandatory', md: 'none' },
          gap: 3,
          pb: { xs: 2, md: 0 },
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 0 },
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}
      >
        {/* Column 1 */}
        <Box sx={{ 
          minWidth: { xs: '85vw', sm: '320px', md: '0' }, 
          flexShrink: { xs: 0, md: 1 },
          flex: { md: 1 }, 
          scrollSnapAlign: 'center',
          display: 'flex', flexDirection: 'column', gap: 3 
        }}>
          <VisionProgressCard vision={activeVision} />
          <FocusTasksCard tasks={safeTasks} onComplete={handleTaskComplete} />
          <QuickActionsCard />
        </Box>

        {/* Column 2 */}
        <Box sx={{ 
          minWidth: { xs: '85vw', sm: '320px', md: '0' }, 
          flexShrink: { xs: 0, md: 1 },
          flex: { md: 1 }, 
          scrollSnapAlign: 'center',
          display: 'flex', flexDirection: 'column', gap: 3 
        }}>
          <GoalRadarCard goals={safeGoals} />
          <WeeklyProgressCard tasks={safeTasks} />
          <FocusInsightsCard tasks={safeTasks} goals={safeGoals} stats={stats} />
        </Box>

        {/* Column 3 */}
        <Box sx={{ 
          minWidth: { xs: '85vw', sm: '320px', md: '0' }, 
          flexShrink: { xs: 0, md: 1 },
          flex: { md: 1 }, 
          scrollSnapAlign: 'center',
          display: 'flex', flexDirection: 'column', gap: 3 
        }}>
          <HabitHeatmapCard stats={stats} habits={safeHabits} />
          <UpcomingDeadlinesCard tasks={safeTasks} goals={safeGoals} />
          <RecentWinsCard tasks={safeTasks} goals={safeGoals} habits={safeHabits} />
        </Box>
      </Box>

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  )
}

export default Dashboard
