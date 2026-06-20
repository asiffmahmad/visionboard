import React, { useState, useEffect, useMemo } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Rating, CircularProgress,
  Alert, TextField, MenuItem, IconButton, Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import api from '../services/api'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState('ALL')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await api.get('/api/v1/reviews')
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setReviews(sorted)
    } catch (err) {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      await api.delete(`/api/v1/reviews/${id}`)
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete review')
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = review.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            review.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRating = ratingFilter === 'ALL' || review.rating.toString() === ratingFilter
      return matchesSearch && matchesRating
    })
  }, [reviews, searchQuery, ratingFilter])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        User Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Review, search, filter, and moderate user feedback to improve the platform.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search reviews or users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: 300 } }}
          inputProps={{ 'aria-label': 'Search reviews' }}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
        <TextField
          select
          size="small"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          sx={{ width: { xs: '100%', sm: 150 } }}
          inputProps={{ 'aria-label': 'Filter by rating' }}
        >
          <MenuItem value="ALL">All Ratings</MenuItem>
          {[5, 4, 3, 2, 1].map(r => (
            <MenuItem key={r} value={r.toString()}>{r} Stars</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Mobile View (Cards) */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredReviews.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No reviews match your filters.</Typography>
        ) : (
          filteredReviews.map((review) => (
            <Paper key={review.id} elevation={2} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">{review.username}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Tooltip title="Delete Review">
                  <IconButton color="error" size="small" onClick={() => handleDelete(review.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                {review.content}
              </Typography>
            </Paper>
          ))
        )}
      </Box>

      {/* Desktop View (Table) */}
      <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '45%' }}>Feedback</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No reviews match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {review.username}
                  </TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                    {review.content}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete Review">
                      <IconButton color="error" onClick={() => handleDelete(review.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default AdminReviews
