import React, { useState, useEffect } from 'react';
import { Box, Paper, IconButton, Typography, CircularProgress, Tabs, Tab, Fade, Divider, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import EventIcon from '@mui/icons-material/Event';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MailIcon from '@mui/icons-material/Mail';
import api from '../../services/api';

const FloatingGoogleWidget = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const fetchData = () => {
    api.get('/api/dashboard/google-data')
      .then(res => {
        setData(res.data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to fetch Google data. You may need to sync your account again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (open) {
      if (!data) setLoading(true);
      fetchData();
      
      const interval = setInterval(() => {
        fetchData();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [open]);

  const toggleOpen = () => setOpen(!open);

  const renderContent = () => {
    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ p: 2, textAlign: 'center' }}>{error}</Typography>;
    if (!data) return null;

    if (tabIndex === 0) {
      // Calendar
      return (
        <Box sx={{ p: 2 }}>
          {data.events?.length > 0 ? data.events.map(ev => (
            <Box key={ev.id} sx={{ mb: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{ev.summary}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(ev.startTime).toLocaleString()}
              </Typography>
            </Box>
          )) : <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>No upcoming events.</Typography>}
        </Box>
      );
    } else if (tabIndex === 1) {
      // YouTube
      const stats = data.youtubeStats;
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          {stats ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{stats.channelName}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box>
                  <Typography variant="h5" color="primary.main">{stats.subscriberCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Subscribers</Typography>
                </Box>
                <Box>
                  <Typography variant="h5" color="primary.main">{stats.viewCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Views</Typography>
                </Box>
              </Box>
            </>
          ) : <Typography variant="body2" color="text.secondary">No YouTube channel found.</Typography>}
        </Box>
      );
    } else {
      // Gmail
      return (
        <Box sx={{ p: 2 }}>
          {data.unreadEmails?.length > 0 ? data.unreadEmails.map(mail => (
            <Box key={mail.id} sx={{ mb: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', noWrap: true }}>{mail.subject || '(No Subject)'}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', noWrap: true }}>{mail.sender}</Typography>
            </Box>
          )) : <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>No new emails.</Typography>}
        </Box>
      );
    }
  };

  return (
    <>
      <Fade in={!open}>
        <IconButton 
          onClick={toggleOpen}
          sx={{ 
            position: 'fixed', bottom: 30, right: 30, 
            bgcolor: 'primary.main', color: 'white', 
            width: 60, height: 60, 
            boxShadow: 4, zIndex: 1000,
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <GoogleIcon fontSize="large" />
        </IconButton>
      </Fade>

      <Fade in={open}>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 350,
            height: 450,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GoogleIcon />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Google Sync</Typography>
            </Box>
            <IconButton size="small" onClick={toggleOpen} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} variant="fullWidth">
            <Tab icon={<EventIcon />} label="Calendar" />
            <Tab icon={<YouTubeIcon />} label="YouTube" />
            <Tab icon={
              <Badge color="error" variant="dot" invisible={!data?.unreadEmails?.length}>
                <MailIcon />
              </Badge>
            } label="Gmail" />
          </Tabs>
          <Divider />
          
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {renderContent()}
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default FloatingGoogleWidget;
