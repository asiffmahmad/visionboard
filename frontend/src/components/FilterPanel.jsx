import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
} from '@mui/material'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import { setFilters, resetFilters } from '../features/tasksSlice'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const FilterPanel = ({ onFilterChange }) => {
  const dispatch = useDispatch()
  const { filters } = useSelector((state) => state.tasks)

  const handleChange = (field, value) => {
    dispatch(setFilters({ [field]: value }))
    if (onFilterChange) onFilterChange()
  }

  const handleReset = () => {
    dispatch(resetFilters())
    if (onFilterChange) onFilterChange()
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Status"
            fullWidth
            size="small"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Priority"
            fullWidth
            size="small"
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={3}>
          <DatePicker 
            label="Due Date" 
            value={filters.dueDate ? dayjs(filters.dueDate) : null} 
            onChange={(newValue) => handleChange('dueDate', newValue ? newValue.format('YYYY-MM-DD') : '')} 
            slotProps={{ textField: { fullWidth: true, size: 'small' } }} 
          />
        </Grid>

        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<FilterListOffIcon />}
            onClick={handleReset}
            sx={{ height: 40 }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FilterPanel
