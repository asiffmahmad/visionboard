import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Paper, Grid, TextField, Button, Alert,
  Rating, Divider
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import InfoIcon from '@mui/icons-material/Info'
import api from '../services/api'

const About = () => {
  const { user } = useSelector(state => state.auth)
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      await api.post('/api/v1/reviews', { content, rating })
      setStatus({ type: 'success', message: 'Thank you for your feedback!' })
      setContent('')
      setRating(5)
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to submit feedback. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        About VisionBoard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 2, color: 'primary.main' }}>
                <InfoIcon fontSize="large" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Your Personal Operating System
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
              VisionBoard is designed to be your central hub for personal growth, productivity, and life management. 
              We believe that aligning your daily actions with your long-term visions is the key to sustained success.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Whether you are tracking daily habits, breaking down massive goals into actionable tasks, or simply 
              journaling your thoughts, VisionBoard provides the structured environment you need to stay focused.
            </Typography>
            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              Core Philosophy
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              1. <b>Vision First</b>: Start with the end in mind.<br/>
              2. <b>Goal Driven</b>: Break visions into achievable milestones.<br/>
              3. <b>Action Oriented</b>: Execute daily through habits and tasks.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Share Your Feedback
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Help us improve VisionBoard! Your reviews are read directly by the development team.
            </Typography>

            {status.message && (
              <Alert severity={status.type} sx={{ mb: 3 }}>{status.message}</Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography component="legend" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Rate your experience
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue || 1)}
                  size="large"
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="What do you love? What could be better?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !content.trim()}
                endIcon={<SendIcon />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default About
