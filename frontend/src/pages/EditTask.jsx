import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import TaskForm from '../components/TaskForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ToastNotification from '../components/ToastNotification'
import { fetchTaskById, updateTask } from '../services/taskService'

const EditTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  useEffect(() => {
    loadTask()
  }, [id])

  const loadTask = async () => {
    try {
      const data = await fetchTaskById(id)
      setTask(data)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, severity = 'success') => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleSubmit = async (taskData) => {
    try {
      await updateTask(id, taskData)
      showToast('Task updated successfully!')
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
          Edit Task
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Modify the properties of your task.
        </Typography>
      </Box>

      {loading ? (
        <LoadingSpinner message="Fetching task details..." />
      ) : task ? (
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          titleText="Update Task Details"
        />
      ) : (
        <Typography variant="body1" color="error">
          Task details could not be found.
        </Typography>
      )}

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  )
}

export default EditTask
