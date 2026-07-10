import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Grid,
  Box,
  Typography,
  Button,
  Pagination,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import GridViewIcon from '@mui/icons-material/GridView'
import TableRowsIcon from '@mui/icons-material/TableRows'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import TaskCard from '../components/TaskCard'
import TaskTable from '../components/TaskTable'
import LoadingSpinner from '../components/LoadingSpinner'
import ConfirmationDialog from '../components/ConfirmationDialog'
import ToastNotification from '../components/ToastNotification'
import { fetchTasks, updateTaskStatus, deleteTask } from '../services/taskService'
import { setPage, setSort, setFilters } from '../features/tasksSlice'

const Tasks = () => {
  const dispatch = useDispatch()
  const { items, page, totalPages, loading, sort, filters } = useSelector((state) => state.tasks)

  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'

  const [searchVal, setSearchVal] = useState(filters.search)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [taskToView, setTaskToView] = useState(null)

  useEffect(() => {
    loadTasksData()
  }, [page, sort, filters.status, filters.priority, filters.dueDate, filters.search])

  const loadTasksData = async () => {
    try {
      await fetchTasks()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const showToast = (message, severity = 'success') => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleSearch = (val) => {
    setSearchVal(val)
    // Instant search or debounce can be added. We'll trigger search dispatch
    dispatch(setFilters({ search: val }))
  }

  const handlePageChange = (event, value) => {
    dispatch(setPage(value - 1))
  }

  const handleSortChange = (event) => {
    dispatch(setSort(event.target.value))
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus)
      showToast('Task status updated!')
      loadTasksData() // Reload
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId)
    setDeleteDialogOpen(true)
  }

  const handleViewClick = (task) => {
    setTaskToView(task)
    setViewDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return
    try {
      await deleteTask(taskToDelete)
      showToast('Task deleted successfully!')
      setDeleteDialogOpen(false)
      setTaskToDelete(null)
      loadTasksData()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <Box>
      {/* Header section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Task Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage, filter, sort, and organize your tasks
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/tasks/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Create Task
        </Button>
      </Box>

      {/* Control bar: search, view mode, sorting */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <SearchBar value={searchVal} onChange={handleSearch} />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                select
                label="Sort By"
                fullWidth
                size="small"
                value={sort}
                onChange={handleSortChange}
              >
                <MenuItem value="createdAt,desc">Created (Newest)</MenuItem>
                <MenuItem value="createdAt,asc">Created (Oldest)</MenuItem>
                <MenuItem value="dueDate,asc">Due Date (Earliest)</MenuItem>
                <MenuItem value="dueDate,desc">Due Date (Latest)</MenuItem>
                <MenuItem value="title,asc">Title (A-Z)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2.5,
                    p: 1,
                  }}
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Table View">
                <IconButton
                  onClick={() => setViewMode('table')}
                  color={viewMode === 'table' ? 'primary' : 'default'}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2.5,
                    p: 1,
                  }}
                >
                  <TableRowsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Advanced Filter Panel */}
      <Box sx={{ mb: 4 }}>
        <FilterPanel onFilterChange={loadTasksData} />
      </Box>

      {/* Tasks listing area */}
      {loading ? (
        <LoadingSpinner message="Retrieving your task workspace..." />
      ) : items.length === 0 ? (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try loosening your filters or write your first task right now.
            </Typography>
            <Button
              component={Link}
              to="/tasks/create"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {items.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
              <TaskCard
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteClick}
                onView={handleViewClick}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TaskTable
          tasks={items}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
        />
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            shape="rounded"
          />
        </Box>
      )}

      {/* Dialog & Toast */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Task"
        content="Are you sure you want to permanently delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      {/* View Task Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Task Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {taskToView && (
            <>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{taskToView.title}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{taskToView.description || 'No description'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 }, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Typography variant="body2" sx={{ bgcolor: 'action.selected', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'inline-block', mt: 0.5, fontWeight: 600 }}>
                    {taskToView.status.replace('_', ' ')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                  <Typography variant="body2" sx={{ bgcolor: 'action.selected', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'inline-block', mt: 0.5, fontWeight: 600 }}>
                    {taskToView.priority}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Due Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{taskToView.dueDate || 'None'}</Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  )
}

export default Tasks
