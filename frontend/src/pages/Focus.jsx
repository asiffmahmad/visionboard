import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Grid, Card, CardContent, Typography, Button, TextField, Divider, Checkbox, FormControlLabel, IconButton } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import { fetchDashboardStats } from '../services/dashboardService'
import { fetchTasks, updateTaskStatus } from '../services/taskService'
import { fetchGoals } from '../features/goalSlice'
import { fetchVisions } from '../features/visionSlice'
import { fetchHabits, logHabit } from '../features/habitSlice'
import { addNote } from '../features/noteSlice'
import ToastNotification from '../components/ToastNotification'

const Focus = () => {
  const dispatch = useDispatch()
  const { items: tasks } = useSelector((state) => state.tasks || { items: [] })
  const { goals } = useSelector((state) => state.goals || { goals: [] })
  const { visions } = useSelector((state) => state.visions || { visions: [] })
  const { habits } = useSelector((state) => state.habits || { habits: [] })

  const [quickNote, setQuickNote] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    fetchTasks()
    dispatch(fetchGoals())
    dispatch(fetchVisions())
    dispatch(fetchHabits())
  }, [dispatch])

  const handleTaskComplete = async (id, status) => {
    try {
      const nextStatus = status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
      await updateTaskStatus(id, nextStatus)
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleHabitComplete = async (id) => {
    try {
      await dispatch(logHabit(id))
      setToastMessage('Habit logged!')
      setToastOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveNote = async () => {
    if (!quickNote.trim()) return
    try {
      await dispatch(addNote({ title: 'Quick Note', content: quickNote }))
      setQuickNote('')
      setToastMessage('Note saved to Vault!')
      setToastOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  // Safe mappings
  const safeTasks = Array.isArray(tasks) ? tasks : []
  const safeGoals = Array.isArray(goals) ? goals : []
  const safeVisions = Array.isArray(visions) ? visions : []
  const safeHabits = Array.isArray(habits) ? habits : []

  const topTasks = safeTasks.filter((t) => t.status !== 'COMPLETED').slice(0, 3)
  const activeVision = safeVisions.length > 0 ? safeVisions[0] : null
  const activeGoal = safeGoals.length > 0 ? safeGoals[0] : null

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarIcon sx={{ color: 'primary.main', fontSize: 32 }} /> Deep Focus
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your immediate priorities and active alignments.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Today's Top Priorities
              </Typography>
              {topTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No pending tasks.</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {topTasks.map(task => (
                    <Box key={task.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <IconButton onClick={() => handleTaskComplete(task.id, task.status)}>
                        {task.status === 'COMPLETED' ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                      </IconButton>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>{task.title}</Typography>
                        {task.description && <Typography variant="caption" color="text.secondary">{task.description}</Typography>}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Daily Habits
              </Typography>
              {safeHabits.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No active habits.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {safeHabits.map(habit => (
                    <Grid item xs={12} sm={6} key={habit.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight={600}>{habit.title}</Typography>
                        <Button size="small" variant="outlined" onClick={() => handleHabitComplete(habit.id)}>Log</Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Alignment
              </Typography>
              {activeVision && (
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>ACTIVE VISION</Typography>
                  <Typography variant="body1" fontWeight={700}>{activeVision.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>{activeVision.description}</Typography>
                </Box>
              )}
              {activeGoal && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>ACTIVE GOAL</Typography>
                  <Typography variant="body1" fontWeight={700}>{activeGoal.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>{activeGoal.description}</Typography>
                </Box>
              )}
              {!activeVision && !activeGoal && (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Set a vision and goal to align your workspace.</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                📝 Quick Scratchpad
              </Typography>
              <TextField
                placeholder="Jot down a quick thought or item..."
                multiline
                rows={4}
                fullWidth
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" startIcon={<AddIcon />} fullWidth onClick={handleSaveNote}>
                Save to Notes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <ToastNotification open={toastOpen} message={toastMessage} severity="success" onClose={() => setToastOpen(false)} />
    </Box>
  )
}

export default Focus
