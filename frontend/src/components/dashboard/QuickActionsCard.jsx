import React from 'react'
import { Box, Button } from '@mui/material'
import DashboardCard from './DashboardCard'
import AddIcon from '@mui/icons-material/Add'
import { Link } from 'react-router-dom'

const QuickActionsCard = () => {
  const actions = [
    { label: 'Create Task', path: '/tasks/create', color: 'primary' },
    { label: 'Create Goal', path: '/goals', color: 'secondary' },
    { label: 'Create Vision', path: '/visions', color: 'info' },
    { label: 'Create Habit', path: '/habits', color: 'success' },
    { label: 'Create Note', path: '/notes', color: 'warning' },
  ]

  return (
    <DashboardCard title="Quick Actions">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {actions.map((action) => (
          <Button
            key={action.label}
            component={Link}
            to={action.path}
            variant="outlined"
            color={action.color}
            startIcon={<AddIcon />}
            sx={{ 
              justifyContent: 'flex-start',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderWidth: '1px',
              '&:hover': { borderWidth: '1px' }
            }}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </DashboardCard>
  )
}

export default QuickActionsCard
