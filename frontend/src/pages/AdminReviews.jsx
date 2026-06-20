import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Rating, CircularProgress,
  Alert
} from '@mui/material'
import api from '../services/api'
import { format } from 'date-fns'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/api/v1/reviews')
        // Sort newest first
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setReviews(sorted)
      } catch (err) {
        setError('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        User Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Review and analyze user feedback to improve the platform.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '50%' }}>Feedback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No reviews submitted yet.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell>
                    {format(new Date(review.createdAt), 'MMM d, yyyy HH:mm')}
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
