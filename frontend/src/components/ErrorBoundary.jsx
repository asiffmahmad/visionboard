import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', minHeight: '100vh', bgcolor: '#0b0f19', color: '#f3f4f6', p: 3, textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Oops! Something went wrong.</Typography>
          <Typography variant="body1" sx={{ color: '#9ca3af', mb: 4 }}>
            We're sorry, but an unexpected error occurred.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              textTransform: 'none', px: 4, py: 1.5, borderRadius: 2
            }}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
