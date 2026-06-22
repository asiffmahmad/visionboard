import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SEO from '../components/SEO';

const PublicAbout = () => {
  return (
    <div style={{ background: '#0b0f19', minHeight: '100vh', color: '#f3f4f6' }}>
      <SEO
        title="About VisionBoard | Our Mission for Personal Growth"
        description="Learn about VisionBoard, the free habit tracker and goal setting app. Discover our mission to help you build better routines and achieve personal growth."
        path="/about"
      />
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, mb: 4 }}>
          About VisionBoard
        </Typography>
        <Box component="section" sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 700, mb: 2, color: '#a5b4fc' }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#9ca3af' }}>
            We believe that achieving big goals starts with small, consistent daily actions. VisionBoard was created to be the ultimate free productivity app, combining a powerful daily habit tracker, goal tracker, and vision board into one seamless experience.
          </Typography>
        </Box>
        <Box component="section">
          <Typography variant="h2" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 700, mb: 2, color: '#a5b4fc' }}>
            Built for Personal Growth
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#9ca3af' }}>
            Whether you are looking to build better routines, maintain streaks, or manage a complex daily planner, our tools are designed to support your self-improvement journey every step of the way without any paywalls.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default PublicAbout;
