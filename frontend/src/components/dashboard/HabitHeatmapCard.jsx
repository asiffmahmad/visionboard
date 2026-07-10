import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Typography, Divider, IconButton, Tooltip, Menu, MenuItem } from '@mui/material'
import DashboardCard from './DashboardCard'
import { logHabit } from '../../features/habitSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const HabitWidget = ({ habits }) => {
  const dispatch = useDispatch()
  const today = new Date().toISOString().split('T')[0]
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedHabitId, setSelectedHabitId] = useState(null)

  const handleOpenMenu = (event, id) => {
    setSelectedHabitId(id)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedHabitId(null)
  }

  const handleSelectStatus = (status) => {
    if (selectedHabitId) {
      dispatch(logHabit({ id: selectedHabitId, date: today, status }))
    }
    handleCloseMenu()
  }

  const getLogForToday = (habit) => {
    if (!habit.logs) return null
    return habit.logs.find(log => log.date === today)
  }

  const renderIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleIcon color="success" />
      case 'FAILED': return <CancelIcon color="error" />
      case 'SKIPPED': return <RemoveCircleIcon color="error" />
      default: return <RadioButtonUncheckedIcon color="disabled" />
    }
  }

  if (!Array.isArray(habits) || habits.length === 0) {
    return (
      <DashboardCard title="Today's Habits">
        <Typography color="text.secondary" textAlign="center" py={4}>No habits created yet.</Typography>
      </DashboardCard>
    )
  }

  const habitsToDisplay = habits.filter(habit => {
    const log = getLogForToday(habit)
    return !log || log.status !== 'COMPLETED'
  })

  if (habitsToDisplay.length === 0) {
    return (
      <DashboardCard title="Today's Habits">
        <Typography color="text.secondary" textAlign="center" py={4}>All habits completed for today! 🎉</Typography>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title="Today's Habits">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {habitsToDisplay.map((habit, index) => {
          const log = getLogForToday(habit)
          const status = log ? log.status : 'NONE'

          return (
            <Box key={habit.id}>
              {index > 0 && <Divider sx={{ mb: 1.5 }} />}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                  <Tooltip title={`Status: ${status}`}>
                    <IconButton size="small" onClick={(e) => handleOpenMenu(e, habit.id)}>
                      {renderIcon(status)}
                    </IconButton>
                  </Tooltip>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>{habit.title}</Typography>
                    <Typography variant="caption" color="text.secondary">🔥 Streak: {habit.streak}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleSelectStatus('COMPLETED')}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} fontSize="small" /> Mark Completed
        </MenuItem>
        <MenuItem onClick={() => handleSelectStatus('FAILED')}>
          <CancelIcon color="error" sx={{ mr: 1 }} fontSize="small" /> Mark Missed
        </MenuItem>
        <MenuItem onClick={() => handleSelectStatus('NONE')}>
          <RadioButtonUncheckedIcon color="disabled" sx={{ mr: 1 }} fontSize="small" /> Clear
        </MenuItem>
      </Menu>
    </DashboardCard>
  )
}

export default HabitWidget
