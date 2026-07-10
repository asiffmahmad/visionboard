import React from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import dayjs from 'dayjs'

const TaskTable = ({ tasks, onStatusChange, onDelete, onView }) => {
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

  const handleToggleStatus = (task) => {
    if (task.status === 'PENDING') {
      onStatusChange(task.id, 'IN_PROGRESS')
    } else if (task.status === 'IN_PROGRESS') {
      onStatusChange(task.id, 'COMPLETED')
    } else {
      onStatusChange(task.id, 'PENDING')
    }
  }

  if (tasks.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No tasks found matching your filters.
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Table sx={{ minWidth: 650 }} aria-label="tasks table">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell width={50} align="center">Status</TableCell>
            <TableCell>Task Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell width={120}>Priority</TableCell>
            <TableCell width={140}>Due Date</TableCell>
            <TableCell width={120} align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <TableCell align="center">
                <Tooltip title="Cycle Task Status">
                  <IconButton size="small" onClick={() => handleToggleStatus(task)} color="primary">
                    {task.status === 'COMPLETED' ? (
                      <CheckCircleOutlineIcon />
                    ) : task.status === 'IN_PROGRESS' ? (
                      <AutorenewIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                    color: task.status === 'COMPLETED' ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {task.title}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ maxWidth: 250 }}
                >
                  {task.description || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                  size="small"
                  variant="light"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {task.dueDate ? dayjs(task.dueDate).format('MMM D, YYYY') : 'No due date'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TaskTable
