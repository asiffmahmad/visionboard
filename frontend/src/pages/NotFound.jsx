import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button, Container } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import DoneAllIcon from '@mui/icons-material/DoneAll'

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
          <DoneAllIcon sx={{ color: 'primary.main', fontSize: 48 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: '-1px',
              color: 'primary.main',
            }}
          >
            VisionBoard
          </Typography>
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '6rem', sm: '8rem' },
            lineHeight: 1,
            mb: 2,
            color: 'primary.main',
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Oops! Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>

        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    </Box>
  )
}

export default NotFound
