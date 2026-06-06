import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import DashboardCard from './DashboardCard'

const calculateRisk = (targetDate, progress) => {
  if (!targetDate) return 'success'
  const diff = new Date(targetDate) - new Date()
  const daysLeft = diff / (1000 * 60 * 60 * 24)
  if (daysLeft < 7 && progress < 80) return 'error'
  if (daysLeft < 30 && progress < 50) return 'warning'
  return 'success'
}

const GoalRadarCard = ({ goals }) => {
  const activeGoals = Array.isArray(goals) ? goals : []

  return (
    <DashboardCard title="Goal Radar">
      {activeGoals.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No goals found. Set a goal to track your progress!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activeGoals.map(goal => {
            const riskColor = calculateRisk(goal.targetDate, goal.progress || 0)
            return (
              <Box key={goal.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{goal.title}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: `${riskColor}.main` }}>
                    {goal.progress || 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={goal.progress || 0} 
                  color={riskColor}
                  sx={{ height: 6, borderRadius: 3, mb: 1 }} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Due: {goal.targetDate || 'No date'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: `${riskColor}.main`, fontWeight: 600, textTransform: 'capitalize' }}>
                    {riskColor === 'success' ? 'On Track' : riskColor === 'warning' ? 'At Risk' : 'Critical'}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </DashboardCard>
  )
}

export default GoalRadarCard
