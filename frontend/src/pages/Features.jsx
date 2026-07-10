import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import SEO from '../components/SEO';
import { useSelector } from 'react-redux';

const Features = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const featuresList = [
    { title: "Daily Habit Tracker", desc: "Build streaks and monitor your consistency with detailed heatmaps." },
    { title: "Goal Tracker", desc: "Break down large life goals into actionable milestones and track progress." },
    { title: "Vision Board", desc: "Visualize your future with a digital vision board that keeps you motivated." },
    { title: "Task Manager", desc: "A robust daily planner to organize your to-dos with priorities and deadlines." }
  ];

  return (
    <div>
      <SEO
        title="VisionBoard Features | Habit Tracker, Goal Tracker & More"
        description="Explore the features of VisionBoard. A complete productivity app featuring a habit tracker, goal tracker, vision board, and daily planner."
        path="/features"
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, mb: 4, textAlign: 'center' }}>
          Powerful Productivity Features
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem', textAlign: 'center', color: darkMode ? '#9ca3af' : '#4b5563', mb: 8, maxWidth: 700, mx: 'auto' }}>
          Everything you need for personal growth in one free application.
        </Typography>
        
        <Grid container spacing={4}>
          {featuresList.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ p: 4, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 4, border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="h2" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, mb: 2, color: darkMode ? '#a5b4fc' : '#6366f1' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: darkMode ? '#9ca3af' : '#4b5563' }}>
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Features;
