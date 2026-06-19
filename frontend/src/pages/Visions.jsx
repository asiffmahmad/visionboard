import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { fetchVisions, addVision, deleteVision } from '../features/visionSlice'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const Visions = () => {
  const dispatch = useDispatch()
  const { visions, loading } = useSelector((state) => state.visions)

  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedVision, setSelectedVision] = useState(null)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visionType, setVisionType] = useState('CAREER')
  const [targetDate, setTargetDate] = useState('')

  useEffect(() => {
    dispatch(fetchVisions())
  }, [dispatch])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setDescription('')
    setVisionType('CAREER')
    setTargetDate('')
  }

  const handleViewOpen = (vision) => {
    setSelectedVision(vision)
    setViewOpen(true)
  }
  const handleViewClose = () => {
    setSelectedVision(null)
    setViewOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addVision({ title, description, visionType, targetDate, status: 'PENDING', progress: 0 }))
    handleClose()
  }

  const handleDelete = (id) => {
    dispatch(deleteVision(id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Visions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Long-term aspirations and north stars
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          Create Vision
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : visions.length === 0 ? (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <CardContent>
            <VisibilityIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No visions found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Define your ultimate goals and life purpose.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {visions.map((vision) => (
            <Grid item xs={12} sm={6} md={4} key={vision.id}>
              <Card sx={{ position: 'relative' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ pr: 6, mb: 1.5 }}>{vision.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, position: 'absolute', top: 16, right: 16 }}>
                      <IconButton size="small" color="primary" onClick={() => handleViewOpen(vision)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(vision.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ height: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mb: 2.5 }}>
                    {vision.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      {vision.visionType}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {vision.progress}% Complete
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Vision</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Description" variant="outlined" multiline rows={3} fullWidth required value={description} onChange={(e) => setDescription(e.target.value)} />
            <FormControl fullWidth required>
              <InputLabel>Vision Type</InputLabel>
              <Select value={visionType} label="Vision Type" onChange={(e) => setVisionType(e.target.value)}>
                <MenuItem value="LIFE">Life</MenuItem>
                <MenuItem value="CAREER">Career</MenuItem>
                <MenuItem value="HEALTH">Health</MenuItem>
                <MenuItem value="FINANCE">Finance</MenuItem>
                <MenuItem value="BUSINESS">Business</MenuItem>
                <MenuItem value="LEARNING">Learning</MenuItem>
                <MenuItem value="RELATIONSHIP">Relationship</MenuItem>
              </Select>
            </FormControl>
            <DatePicker 
              label="Target Date *" 
              value={targetDate ? dayjs(targetDate) : null} 
              onChange={(newValue) => setTargetDate(newValue ? newValue.format('YYYY-MM-DD') : '')} 
              slotProps={{ textField: { fullWidth: true, required: true } }} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Vision Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {selectedVision && (
            <>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedVision.title}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedVision.description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Vision Type</Typography>
                  <Typography variant="body2" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'inline-block', mt: 0.5, fontWeight: 600 }}>
                    {selectedVision.visionType}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Target Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedVision.targetDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Progress</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedVision.progress}%</Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Visions
