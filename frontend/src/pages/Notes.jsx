import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import { fetchNotes, addNote, deleteNote, updateNote } from '../features/noteSlice'
import NotesIcon from '@mui/icons-material/Notes'

const Notes = () => {
  const dispatch = useDispatch()
  const { notes, loading } = useSelector((state) => state.notes)

  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

  const handleOpen = () => {
    setIsEditMode(false)
    setEditId(null)
    setOpen(true)
  }
  const handleEditOpen = (note) => {
    setIsEditMode(true)
    setEditId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setContent('')
    setIsEditMode(false)
    setEditId(null)
  }

  const handleViewOpen = (note) => {
    setSelectedNote(note)
    setViewOpen(true)
  }
  const handleViewClose = () => {
    setSelectedNote(null)
    setViewOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditMode && editId) {
      dispatch(updateNote({ id: editId, data: { title, content } }))
    } else {
      dispatch(addNote({ title, content }))
    }
    handleClose()
  }

  const handleDelete = (id) => {
    dispatch(deleteNote(id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Notes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Jot down ideas, meeting notes, and thoughts
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          Create Note
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : notes.length === 0 ? (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <CardContent>
            <NotesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No notes found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Start writing your first note.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ pr: 14, mb: 1.5, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{note.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, position: 'absolute', top: 16, right: 16 }}>
                      <IconButton size="small" color="primary" onClick={() => handleViewOpen(note)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => handleEditOpen(note)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(note.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ height: 72, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {note.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Note Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{isEditMode ? 'Edit Note' : 'Create New Note'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Content" variant="outlined" multiline rows={5} fullWidth required value={content} onChange={(e) => setContent(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">{isEditMode ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Note Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {selectedNote && (
            <>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{selectedNote.title}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Content</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', bgcolor: 'action.hover', p: 2, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}>
                  {selectedNote.content}
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

export default Notes
