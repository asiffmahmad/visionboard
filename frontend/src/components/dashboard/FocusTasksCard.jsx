import React from 'react'
import { Box, Typography, IconButton, Button, Tooltip } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DashboardCard from './DashboardCard'
import { Link } from 'react-router-dom'

const FocusTasksCard = ({ tasks, onComplete }) => {
  const topTasks = Array.isArray(tasks) 
    ? tasks.filter(t => t.status !== 'COMPLETED').slice(0, 3) 
    : []

  return (
    <DashboardCard title="Focus Today">
      {topTasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No pressing tasks today. Great job!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {topTasks.map(task => (
            <Box 
              key={task.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={() => onComplete(task.id, task.status)}
                  sx={{ border: '1px solid', borderColor: 'primary.main', p: 0.25 }}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                </IconButton>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {task.title}
                  </Typography>
                </Box>
              </Box>
              
              <Tooltip title="Open Task">
                <IconButton size="small" component={Link} to={`/tasks`} sx={{ color: 'text.secondary' }}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
    </DashboardCard>
  )
}

export default FocusTasksCard
