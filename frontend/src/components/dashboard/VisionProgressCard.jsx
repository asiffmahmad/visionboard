import React from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import DashboardCard from './DashboardCard'

const VisionProgressCard = ({ vision }) => {
  if (!vision) {
    return (
      <DashboardCard title="Vision Progress">
        <Typography variant="body2" color="text.secondary">
          No active vision found.
        </Typography>
      </DashboardCard>
    )
  }

  const progress = vision.progress || 0
  const healthScore = progress > 50 ? 'Good' : 'Needs Focus'
  
  // Calculate days remaining roughly from today to targetDate if it exists
  let daysRemaining = 'N/A'
  if (vision.targetDate) {
    const diffTime = Math.abs(new Date(vision.targetDate) - new Date())
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + ' days'
  }

  return (
    <DashboardCard title="Vision Progress Center">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            {vision.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {vision.description || 'Executing daily to build the future.'}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={100} sx={{ color: 'action.hover' }} size={64} thickness={5} />
          <CircularProgress variant="determinate" value={progress} sx={{ color: 'primary.main', position: 'absolute', left: 0 }} size={64} thickness={5} />
          <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {progress}%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, '& > div': { flex: 1, p: 2, bgcolor: 'action.hover', borderRadius: 2 } }}>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Target Date</Typography>
          <Typography variant="body2" fontWeight={600}>{vision.targetDate || 'Ongoing'}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Time Remaining</Typography>
          <Typography variant="body2" fontWeight={600}>{daysRemaining}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Health Score</Typography>
          <Typography variant="body2" fontWeight={600} color="success.main">{healthScore}</Typography>
        </Box>
      </Box>
    </DashboardCard>
  )
}

export default VisionProgressCard
