import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Tooltip, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import dayjs from 'dayjs';

const HabitCalendarTracker = ({ habit, onLogStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const startOfMonth = dayjs().startOf('month');
  const endOfMonth = dayjs().endOf('month');
  const startDay = startOfMonth.day(); // 0 is Sunday
  const daysInMonth = startOfMonth.daysInMonth();
  
  const calendarDays = [];
  // Add empty slots for days before the 1st of the month
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(startOfMonth.date(i).format('YYYY-MM-DD'));
  }

  const getLogForDate = (date) => {
    if (!habit.logs) return null;
    return habit.logs.find(log => log.date === date);
  };

  const handleOpenMenu = (event, date) => {
    if (!date) return;
    // Prevent logging for future dates
    if (dayjs(date).isAfter(dayjs(), 'day')) return;
    
    // Prevent logging before start date
    if (habit.startDate && dayjs(date).isBefore(dayjs(habit.startDate), 'day')) return;

    setSelectedDate(date);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedDate(null);
  };

  const handleSelectStatus = (status) => {
    if (selectedDate) {
      onLogStatus(habit.id, selectedDate, status);
    }
    handleCloseMenu();
  };

  const getDotStyle = (status) => {
    switch (status) {
      case 'COMPLETED': return { bgcolor: 'success.main', color: 'white' };
      case 'FAILED': return { bgcolor: 'error.main', color: 'white' };
      case 'SKIPPED': return { bgcolor: 'error.main', color: 'white' }; // Red dot for skipped as requested
      default: return { bgcolor: 'action.disabledBackground', color: 'text.disabled' };
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="subtitle2" align="center" gutterBottom>
        {startOfMonth.format('MMMM YYYY')}
      </Typography>
      
      <Grid container spacing={0.5} columns={7}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <Grid item xs={1} key={idx} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {day}
            </Typography>
          </Grid>
        ))}
        
        {calendarDays.map((date, idx) => {
          if (!date) {
            return <Grid item xs={1} key={`empty-${idx}`} />;
          }

          const log = getLogForDate(date);
          const status = log ? log.status : 'NONE';
          const isFuture = dayjs(date).isAfter(dayjs(), 'day');
          const isBeforeStart = habit.startDate && dayjs(date).isBefore(dayjs(habit.startDate), 'day');
          const isDisabled = isFuture || isBeforeStart;

          const dotStyle = getDotStyle(status);

          return (
            <Grid item xs={1} key={date} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Tooltip title={isDisabled ? 'Not available' : `${date}: ${status}`}>
                <Box
                  onClick={(e) => !isDisabled && handleOpenMenu(e, date)}
                  sx={{
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    cursor: isDisabled ? 'default' : 'pointer',
                    opacity: isDisabled ? 0.3 : 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    ...dotStyle,
                    '&:hover': {
                      opacity: isDisabled ? 0.3 : 0.8
                    }
                  }}
                >
                  {dayjs(date).date()}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleSelectStatus('COMPLETED')}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} fontSize="small" /> Mark Completed
        </MenuItem>
        <MenuItem onClick={() => handleSelectStatus('FAILED')}>
          <CancelIcon color="error" sx={{ mr: 1 }} fontSize="small" /> Mark Missed
        </MenuItem>
        <MenuItem onClick={() => handleSelectStatus('NONE')}>
          <RadioButtonUncheckedIcon color="disabled" sx={{ mr: 1 }} fontSize="small" /> Clear
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HabitCalendarTracker;
