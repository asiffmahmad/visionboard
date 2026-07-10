import React from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import dayjs from 'dayjs'

const TaskCard = ({ task, onStatusChange, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'IN_PROGRESS':
        return 'info'
      case 'PENDING':
      default:
        return 'warning'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'error'
      case 'MEDIUM':
        return 'warning'
      case 'LOW':
      default:
        return 'success'
    }
  }

  const handleToggleStatus = () => {
    if (task.status === 'PENDING') {
      onStatusChange(task.id, 'IN_PROGRESS')
    } else if (task.status === 'IN_PROGRESS') {
      onStatusChange(task.id, 'COMPLETED')
    } else {
      onStatusChange(task.id, 'PENDING')
    }
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 30px 0 rgba(0, 0, 0, 0.6)'
              : '0 8px 30px 0 rgba(0, 0, 0, 0.08)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Chip
            label={task.status.replace('_', ' ')}
            color={getStatusColor(task.status)}
            size="small"
            variant="light"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Box>

        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
            color: task.status === 'COMPLETED' ? 'text.secondary' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            height: '4.5em', // fixed height for uniformity
          }}
        >
          {task.description || 'No description provided.'}
        </Typography>

        {task.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <CalendarTodayIcon sx={{ fontSize: '0.9rem' }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              Due: {dayjs(task.dueDate).format('MMM D, YYYY')}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 0 }}>
        {/* Toggle Status icon */}
        <Tooltip title="Cycle Task Status">
          <IconButton size="small" onClick={handleToggleStatus} color="primary">
            {task.status === 'COMPLETED' ? (
              <CheckCircleOutlineIcon />
            ) : task.status === 'IN_PROGRESS' ? (
              <AutorenewIcon />
            ) : (
              <RadioButtonUncheckedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Box>
          <Tooltip title="View Task">
            <IconButton
              size="small"
              onClick={() => onView(task)}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Task">
            <IconButton
              size="small"
              component={Link}
              to={`/tasks/${task.id}/edit`}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Task">
            <IconButton
              size="small"
              onClick={() => onDelete(task.id)}
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  )
}

export default TaskCard
