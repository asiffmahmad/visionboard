import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { fetchGoals, addGoal, deleteGoal } from '../features/goalSlice'
import { fetchVisions } from '../features/visionSlice'
import FlagIcon from '@mui/icons-material/Flag'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const Goals = () => {
  const dispatch = useDispatch()
  const { goals, loading } = useSelector((state) => state.goals)
  const { visions } = useSelector((state) => state.visions)

  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goalType, setGoalType] = useState('SHORT_TERM')
  const [targetDate, setTargetDate] = useState('')
  const [visionId, setVisionId] = useState('')

  useEffect(() => {
    dispatch(fetchGoals())
    dispatch(fetchVisions())
  }, [dispatch])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setDescription('')
    setGoalType('SHORT_TERM')
    setTargetDate('')
    setVisionId('')
  }

  const handleViewOpen = (goal) => {
    setSelectedGoal(goal)
    setViewOpen(true)
  }
  const handleViewClose = () => {
    setSelectedGoal(null)
    setViewOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addGoal({ title, description, goalType, targetDate, visionId: Number(visionId), status: 'PENDING', progress: 0 }))
    handleClose()
  }

  const handleDelete = (id) => {
    dispatch(deleteGoal(id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Goals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Break down visions into actionable goals
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          Create Goal
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : goals.length === 0 ? (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <CardContent>
            <FlagIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No goals found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Start by defining your short and long-term goals.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card sx={{ position: 'relative' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ pr: 6, mb: 1.5 }}>{goal.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, position: 'absolute', top: 16, right: 16 }}>
                      <IconButton size="small" color="primary" onClick={() => handleViewOpen(goal)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(goal.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ height: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mb: 2.5 }}>
                    {goal.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      {goal.goalType}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {goal.progress}% Complete
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Goal Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Goal</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Description" variant="outlined" multiline rows={3} fullWidth required value={description} onChange={(e) => setDescription(e.target.value)} />
            <FormControl fullWidth required>
              <InputLabel>Goal Type</InputLabel>
              <Select value={goalType} label="Goal Type" onChange={(e) => setGoalType(e.target.value)}>
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                <MenuItem value="MONTHLY">Monthly</MenuItem>
                <MenuItem value="YEARLY">Yearly</MenuItem>
                <MenuItem value="SHORT_TERM">Short Term</MenuItem>
                <MenuItem value="LONG_TERM">Long Term</MenuItem>
                <MenuItem value="LIFETIME">Lifetime</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Associated Vision</InputLabel>
              <Select value={visionId} label="Associated Vision" onChange={(e) => setVisionId(e.target.value)}>
                {visions.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <DatePicker 
              label="Target Date *" 
              value={targetDate ? dayjs(targetDate) : null} 
              onChange={(newValue) => setTargetDate(newValue ? newValue.format('YYYY-MM-DD') : '')} 
              slotProps={{ textField: { fullWidth: true, required: true } }} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Goal Modal */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Goal Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {selectedGoal && (
            <>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedGoal.title}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedGoal.description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Goal Type</Typography>
                  <Typography variant="body2" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'inline-block', mt: 0.5, fontWeight: 600 }}>
                    {selectedGoal.goalType}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Target Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedGoal.targetDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Progress</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedGoal.progress}%</Typography>
                </Box>
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

export default Goals
