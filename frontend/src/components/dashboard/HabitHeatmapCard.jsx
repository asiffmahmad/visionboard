import React from 'react'
import { Box, Typography, Divider } from '@mui/material'
import DashboardCard from './DashboardCard'
import { CheckCircle2, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'

const HabitWidget = ({ stats, habits }) => {
  if (!Array.isArray(habits) || habits.length === 0) {
    return (
      <DashboardCard title="Habit Intelligence">
        <Typography color="text.secondary" textAlign="center" py={4}>No habits created yet.</Typography>
      </DashboardCard>
    )
  }

  // Calculate metrics
  const strongestHabit = [...habits].sort((a, b) => (b.healthScore || 0) - (a.healthScore || 0))[0];
  const weakestHabit = [...habits].sort((a, b) => (a.healthScore || 0) - (b.healthScore || 0))[0];
  const habitAtRisk = habits.find(h => h.streak === 0 && h.daysActive > 3) || weakestHabit;
  
  const totalCompletionRate = habits.reduce((acc, h) => acc + (h.completionRate || 0), 0) / habits.length;

  return (
    <DashboardCard title="Habit Intelligence">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        
        {/* Top Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Global Completion</Typography>
            <Typography variant="h4" fontWeight={800} color="primary.main">{Math.round(totalCompletionRate)}%</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Best Global Streak</Typography>
            <Typography variant="h4" fontWeight={800}>{stats?.bestStreak || 0}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Strongest Habit */}
        {strongestHabit && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.50', color: 'success.main' }}>
              <TrendingUp size={20} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}>Strongest Habit</Typography>
              <Typography variant="body2" color="text.secondary">{strongestHabit.title}</Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={700} color="success.main">{Math.round(strongestHabit.healthScore || 0)}/100</Typography>
          </Box>
        )}

        {/* Habit at Risk */}
        {habitAtRisk && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'error.50', color: 'error.main' }}>
              <AlertCircle size={20} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}>At Risk</Typography>
              <Typography variant="body2" color="text.secondary">{habitAtRisk.title}</Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={700} color="error.main">Streak Broken</Typography>
          </Box>
        )}

        {/* Weakest Habit */}
        {weakestHabit && weakestHabit.id !== habitAtRisk?.id && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.50', color: 'warning.main' }}>
              <TrendingDown size={20} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}>Needs Attention</Typography>
              <Typography variant="body2" color="text.secondary">{weakestHabit.title}</Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={700} color="warning.main">{Math.round(weakestHabit.healthScore || 0)}/100</Typography>
          </Box>
        )}
      </Box>
    </DashboardCard>
  )
}

export default HabitWidget
