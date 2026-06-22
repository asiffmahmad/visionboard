import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { fetchAllAnnouncements, fetchFeatureFlags, updateGlobalFlag, addAnnouncement, deleteAnnouncement } from '../features/adminSlice'

const Admin = () => {
  const dispatch = useDispatch()
  const { announcements, featureFlags, loading } = useSelector((state) => state.admin)

  // Human-readable labels for each feature flag key
  const FEATURE_FLAG_LABELS = {
    VISIONS_MODULE:       'Visions Board',
    GOALS_MODULE:         'Goals Tracker',
    TASKS_MODULE:         'My Tasks',
    HABITS_MODULE:        'Habit Tracker',
    NOTES_MODULE:         'Notes',
    JOURNAL_MODULE:       'Journal',
    DARK_MODE:            'Dark Mode Toggle',
    AI_INSIGHTS:          'AI Insights',
    CALENDAR_INTEGRATION: 'Calendar Integration',
    ADS_MODULE:           'Automated Ads (Sponsored Cards)',
  };

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    dispatch(fetchAllAnnouncements())
    dispatch(fetchFeatureFlags())
  }, [dispatch])

  const handleToggleFlag = (featureName, currentStatus) => {
    dispatch(updateGlobalFlag({ featureName, enabled: !currentStatus }))
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setContent('')
    setIsActive(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addAnnouncement({ title, content, active: isActive }))
    handleClose()
  }

  const handleDeleteAnnouncement = (id) => {
    dispatch(deleteAnnouncement(id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage platform announcements and feature flags
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={700}>Feature Flags</Typography>
                </Box>
                {featureFlags.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No feature flags found.</Typography>
                ) : (
                  featureFlags.map((flag) => (
                    <Box key={flag.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {FEATURE_FLAG_LABELS[flag.featureName] || flag.featureName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {flag.featureName}
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={<Switch checked={flag.enabledGlobally} onChange={() => handleToggleFlag(flag.featureName, flag.enabledGlobally)} color="primary" />}
                        label={flag.enabledGlobally ? 'Enabled' : 'Disabled'}
                        sx={{ mr: 0 }}
                      />
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>Announcements</Typography>
                  <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>New</Button>
                </Box>
                {announcements.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No announcements found.</Typography>
                ) : (
                  announcements.map((announcement) => (
                    <Box key={announcement.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, position: 'relative' }}>
                      <Box sx={{ pr: 6 }}>
                        <Typography variant="subtitle1" fontWeight={600}>{announcement.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>{announcement.content}</Typography>
                        <Typography variant="caption" sx={{ bgcolor: announcement.active ? 'rgba(16, 185, 129, 0.08)' : 'action.selected', color: announcement.active ? 'success.main' : 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: announcement.active ? 'rgba(16, 185, 129, 0.3)' : 'divider', fontWeight: 600 }}>
                          {announcement.active ? 'Active' : 'Inactive'}
                        </Typography>
                      </Box>
                      <IconButton size="small" color="error" sx={{ position: 'absolute', top: 12, right: 12 }} onClick={() => handleDeleteAnnouncement(announcement.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* New Announcement Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>New Announcement</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Content" variant="outlined" multiline rows={4} fullWidth required value={content} onChange={(e) => setContent(e.target.value)} />
            <FormControlLabel
              control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="primary" />}
              label="Active Status"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Admin
