import React, { useState } from 'react';
import { Box, Typography, Tooltip, Menu, MenuItem, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const HabitWeeklyTracker = ({ habit, onLogStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate last 7 days including today
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getLogForDate = (date) => {
    if (!habit.logs) return null;
    return habit.logs.find(log => log.date === date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success.main';
      case 'FAILED': return 'error.main';
      case 'SKIPPED': return 'text.disabled';
      default: return 'action.disabledBackground';
    }
  };

  const handleOpenMenu = (event, date) => {
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

  const renderIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleIcon color="success" />;
      case 'FAILED': return <CancelIcon color="error" />;
      case 'SKIPPED': return <RemoveCircleIcon color="disabled" />;
      default: return <RadioButtonUncheckedIcon color="disabled" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {last7Days.map(date => {
          const log = getLogForDate(date);
          const status = log ? log.status : 'NONE';
          const dayName = new Date(date).toLocaleDateString(undefined, { weekday: 'narrow' });
          
          return (
            <Box key={date} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                {dayName}
              </Typography>
              <Tooltip title={`${date}: ${status}`}>
                <IconButton 
                  size="small" 
                  onClick={(e) => handleOpenMenu(e, date)}
                  sx={{ p: 0.5 }}
                >
                  {renderIcon(status)}
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

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
        <MenuItem onClick={() => handleSelectStatus('SKIPPED')}>
          <RemoveCircleIcon color="disabled" sx={{ mr: 1 }} fontSize="small" /> Mark Skipped
        </MenuItem>
        <MenuItem onClick={() => handleSelectStatus('NONE')}>
          <RadioButtonUncheckedIcon color="disabled" sx={{ mr: 1 }} fontSize="small" /> Clear
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HabitWeeklyTracker;
