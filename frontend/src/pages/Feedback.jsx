import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Alert,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import { submitReview } from '../services/reviewService';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating before submitting.');
      return;
    }
    if (!content.trim()) {
      setError('Please provide some written feedback.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitReview({ rating, content });
      setSuccess(true);
      setRating(0);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 6, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Send Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        We would love to hear your thoughts, suggestions, or any issues you have encountered. Your feedback helps us improve VisionBoard!
      </Typography>

      <Card elevation={2} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              Thank you for your feedback! It has been successfully submitted to our team.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              <Typography component="legend" variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                How would you rate your experience?
              </Typography>
              <Rating
                name="user-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                  setError(null);
                }}
                size="large"
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                sx={{ color: 'primary.main' }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography component="legend" variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                What can we improve?
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                placeholder="Share your thoughts, feature requests, or bugs you've found..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError(null);
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Feedback;
