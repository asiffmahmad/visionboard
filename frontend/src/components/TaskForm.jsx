import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { getAllGoals } from '../services/goalService'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const TaskForm = ({ initialData, onSubmit, onCancel, titleText }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [priority, setPriority] = useState('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [goalId, setGoalId] = useState('')
  const [goals, setGoals] = useState([])

  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Fetch available goals to populate associated goal selection
    const fetchGoalsList = async () => {
      try {
        const goalsData = await getAllGoals()
        setGoals(goalsData)
      } catch (err) {
        console.error('Failed to load goals for task selection:', err)
      }
    }
    fetchGoalsList()
  }, [])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setStatus(initialData.status || 'PENDING')
      setPriority(initialData.priority || 'MEDIUM')
      setDueDate(initialData.dueDate || '')
      setGoalId(initialData.goalId || '')
    }
  }, [initialData])

  const validate = () => {
    const tempErrors = {}
    if (!title.trim()) {
      tempErrors.title = 'Title is required'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      goalId: goalId ? Number(goalId) : null,
    })
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {titleText}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                label="Task Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="E.g., Complete backend tests"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your task objectives..."
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Priority"
                fullWidth
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Associated Goal (Optional)"
                fullWidth
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {goals.map((g) => (
                  <MenuItem key={g.id} value={g.id}>{g.title}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker 
                label="Due Date" 
                value={dueDate ? dayjs(dueDate) : null} 
                onChange={(newValue) => setDueDate(newValue ? newValue.format('YYYY-MM-DD') : '')} 
                slotProps={{ textField: { fullWidth: true } }} 
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TaskForm
