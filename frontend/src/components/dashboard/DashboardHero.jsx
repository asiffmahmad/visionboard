import React from 'react'
import { Box, Typography, Divider } from '@mui/material'
import FlagIcon from '@mui/icons-material/Flag'
import StarIcon from '@mui/icons-material/Star'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import AssignmentIcon from '@mui/icons-material/Assignment'

const StatItem = ({ icon, label, value, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: `${color}.main`, 
      color: 'white',
      borderRadius: 1.5,
      width: 36,
      height: 36
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  </Box>
)

const DashboardHero = ({ user, activeVision, activeGoal, topTask, streak }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, letterSpacing: '-0.02em', color: 'text.primary' }}>
        Good Morning, {user?.username || 'User'}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: { xs: 2, sm: 4 }, 
        bgcolor: 'background.paper', 
        p: 3, 
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}>
        <StatItem 
          icon={<StarIcon fontSize="small" />} 
          label="Active Vision" 
          value={activeVision?.title || 'No active vision'} 
          color="primary"
        />
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
        <StatItem 
          icon={<FlagIcon fontSize="small" />} 
          label="Active Goal" 
          value={activeGoal?.title || 'No active goal'} 
          color="secondary"
        />
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
        <StatItem 
          icon={<AssignmentIcon fontSize="small" />} 
          label="Top Priority" 
          value={topTask?.title || 'No pending tasks'} 
          color="info"
        />
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
        <StatItem 
          icon={<LocalFireDepartmentIcon fontSize="small" />} 
          label="Current Streak" 
          value={`${streak || 0} Days`} 
          color="warning"
        />
      </Box>
    </Box>
  )
}

export default DashboardHero
