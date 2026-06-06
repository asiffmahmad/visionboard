import React from 'react'
import { Box, Typography } from '@mui/material'
import DashboardCard from './DashboardCard'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const FocusInsightsCard = ({ tasks, goals, stats }) => {
  const completedTasks = Array.isArray(tasks) ? tasks.filter(t => t.status === 'COMPLETED').length : 0
  const activeGoals = Array.isArray(goals) ? goals.length : 0

  return (
    <DashboardCard title="Focus Insights">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, p: 2, bgcolor: 'primary.50', borderRadius: 2, color: 'primary.900' }}>
          <TrendingUpIcon fontSize="small" sx={{ color: 'primary.main', mt: 0.25 }} />
          <Typography variant="body2" fontWeight={500}>
            Your active visions progressed by an estimated {Math.round(stats?.avgVisionProgress || 0)}% this week based on completed sub-tasks.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, p: 2, bgcolor: 'success.50', borderRadius: 2, color: 'success.900' }}>
          <LightbulbIcon fontSize="small" sx={{ color: 'success.main', mt: 0.25 }} />
          <Typography variant="body2" fontWeight={500}>
            You completed {completedTasks} tasks recently! You are currently tracking {activeGoals} long-term goals.
          </Typography>
        </Box>
      </Box>
    </DashboardCard>
  )
}

export default FocusInsightsCard
