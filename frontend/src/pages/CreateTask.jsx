import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import TaskForm from '../components/TaskForm'
import ToastNotification from '../components/ToastNotification'
import { createTask } from '../services/taskService'

const CreateTask = () => {
  const navigate = useNavigate()

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  const showToast = (message, severity = 'success') => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleSubmit = async (taskData) => {
    try {
      await createTask(taskData)
      showToast('Task created successfully!')
      // Redirect back after short delay to let toast show
      setTimeout(() => {
        navigate('/tasks')
      }, 1000)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleCancel = () => {
    navigate('/tasks')
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Create New Task
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add a new task to your personal workspace queue.
        </Typography>
      </Box>

      <TaskForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        titleText="New Task Details"
      />

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  )
}

export default CreateTask
