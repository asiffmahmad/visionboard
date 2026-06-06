import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { fetchEntries, addEntry, deleteEntry, updateEntry } from '../features/journalSlice'
import BookIcon from '@mui/icons-material/Book'
import EditIcon from '@mui/icons-material/Edit'

const Journal = () => {
  const dispatch = useDispatch()
  const { entries, loading } = useSelector((state) => state.journal)

  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [entryType, setEntryType] = useState('DAILY_LOG')
  const [mood, setMood] = useState('')

  useEffect(() => {
    dispatch(fetchEntries())
  }, [dispatch])

  const handleOpen = (entry = null) => {
    if (entry && entry.id) {
      setIsEditing(true)
      setEditId(entry.id)
      setTitle(entry.title)
      setContent(entry.content)
      setEntryType(entry.entryType)
      setMood(entry.mood || '')
    } else {
      setIsEditing(false)
      setEditId(null)
      setTitle('')
      setContent('')
      setEntryType('DAILY_LOG')
      setMood('')
    }
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setIsEditing(false)
    setEditId(null)
    setTitle('')
    setContent('')
    setEntryType('DAILY_LOG')
    setMood('')
  }

  const handleViewOpen = (entry) => {
    setSelectedEntry(entry)
    setViewOpen(true)
  }
  const handleViewClose = () => {
    setSelectedEntry(null)
    setViewOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      dispatch(updateEntry({ id: editId, data: { title, content, entryType, mood } }))
    } else {
      dispatch(addEntry({ title, content, entryType, mood }))
    }
    handleClose()
  }

  const handleDelete = (id) => {
    dispatch(deleteEntry(id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Journal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reflect, write, and track your daily thoughts
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Write Entry
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : entries.length === 0 ? (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <CardContent>
            <BookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No entries found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Start writing your first journal entry.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {entries.map((entry) => (
            <Grid item xs={12} key={entry.id}>
              <Card sx={{ position: 'relative' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pr: 8 }}>
                    <Typography variant="h6" fontWeight={700}>{entry.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, position: 'absolute', top: 16, right: 16 }}>
                      <IconButton size="small" color="primary" onClick={() => handleViewOpen(entry)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="info" onClick={() => handleOpen(entry)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(entry.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                      {entry.entryType}
                    </Typography>
                    {entry.mood && (
                      <Typography variant="caption" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', fontWeight: 600 }}>
                        Mood: {entry.mood}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, height: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', whiteSpace: 'pre-wrap' }}>
                    {entry.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Journal Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{isEditing ? 'Edit Journal Entry' : 'Write New Journal Entry'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Content" variant="outlined" multiline rows={5} fullWidth required value={content} onChange={(e) => setContent(e.target.value)} />
            <FormControl fullWidth required>
              <InputLabel>Entry Type</InputLabel>
              <Select value={entryType} label="Entry Type" onChange={(e) => setEntryType(e.target.value)}>
                <MenuItem value="DAILY_LOG">Daily Log</MenuItem>
                <MenuItem value="REFLECTION">Reflection</MenuItem>
                <MenuItem value="GRATITUDE">Gratitude</MenuItem>
                <MenuItem value="IDEA">Idea</MenuItem>
                <MenuItem value="LESSON_LEARNED">Lesson Learned</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Mood" variant="outlined" fullWidth value={mood} onChange={(e) => setMood(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">{isEditing ? 'Update' : 'Save'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Journal Modal */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Journal Entry Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {selectedEntry && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedEntry.title}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(selectedEntry.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Entry Type</Typography>
                  <Typography variant="body2" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'inline-block', mt: 0.5, fontWeight: 600 }}>
                    {selectedEntry.entryType}
                  </Typography>
                </Box>
                {selectedEntry.mood && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Mood</Typography>
                    <Typography variant="body2" sx={{ bgcolor: 'action.selected', color: 'text.secondary', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'inline-block', mt: 0.5, fontWeight: 600 }}>
                      {selectedEntry.mood}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Content</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', bgcolor: 'action.hover', p: 2, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}>
                  {selectedEntry.content}
                </Typography>
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

export default Journal
