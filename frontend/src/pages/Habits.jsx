import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import { fetchHabits, addHabit, logHabit, deleteHabit, updateHabit } from '../features/habitSlice'
import RepeatIcon from '@mui/icons-material/Repeat'
import HabitCalendarTracker from '../components/habits/HabitCalendarTracker'

const Habits = () => {
  const dispatch = useDispatch()
  const { habits, loading } = useSelector((state) => state.habits)

  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState(null)
  
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState('DAILY')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    dispatch(fetchHabits())
  }, [dispatch])

  const handleOpen = () => {
    setIsEditMode(false)
    setEditId(null)
    setOpen(true)
  }
  const handleEditOpen = (habit) => {
    setIsEditMode(true)
    setEditId(habit.id)
    setTitle(habit.title)
    setFrequency(habit.frequency)
    setStartDate(habit.startDate || new Date().toISOString().split('T')[0])
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setFrequency('DAILY')
    setStartDate(new Date().toISOString().split('T')[0])
    setIsEditMode(false)
    setEditId(null)
  }

  const handleViewOpen = (habit) => {
    setSelectedHabit(habit)
    setViewOpen(true)
  }
  const handleViewClose = () => {
    setSelectedHabit(null)
    setViewOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditMode && editId) {
      dispatch(updateHabit({ id: editId, data: { title, frequency, startDate } }))
    } else {
      dispatch(addHabit({ title, frequency, startDate }))
    }
    handleClose()
  }

  const handleLogStatus = (id, date, status) => {
    dispatch(logHabit({ id, date, status }))
  }

  const handleDelete = (id) => {
    dispatch(deleteHabit(id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Habits
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build consistency and track your daily routines
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Habit
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : habits.length === 0 ? (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <CardContent>
            <RepeatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No habits found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Start tracking your daily routines.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {habits.map((habit) => (
            <Grid item xs={12} sm={6} md={4} key={habit.id}>
              <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5, wordBreak: 'break-word', pr: 2 }}>{habit.title}</Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>{habit.frequency}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" color="primary" onClick={() => handleViewOpen(habit)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => handleEditOpen(habit)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(habit.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ my: 2 }}>
                  <HabitCalendarTracker habit={habit} onLogStatus={handleLogStatus} />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>🔥 {habit.streak} Day Streak</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{habit.completionRate.toFixed(1)}%</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Habit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{isEditMode ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField 
              type="date" 
              label="Start Date" 
              fullWidth 
              required 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />
            <FormControl fullWidth required>
              <InputLabel>Frequency</InputLabel>
              <Select value={frequency} label="Frequency" onChange={(e) => setFrequency(e.target.value)}>
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">{isEditMode ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Habit Dialog */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Habit Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {selectedHabit && (
            <>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Habit</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{selectedHabit.title}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 }, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Frequency</Typography>
                  <Typography variant="body2" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'inline-block', mt: 0.5, fontWeight: 600 }}>
                    {selectedHabit.frequency}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Streak</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedHabit.streak} Days</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Completion Rate</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedHabit.completionRate.toFixed(1)}%</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="bold">History Tracker</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click on any day below to manually set its completion status. This helps you maintain accurate logs for past days.
              </Typography>
              
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
                <HabitCalendarTracker habit={selectedHabit} onLogStatus={handleLogStatus} />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Habits
