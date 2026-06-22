import React from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import SEO from '../components/SEO';

const HowItWorks = () => {
  const steps = [
    {
      label: 'Create an Account',
      description: `Sign up for your free VisionBoard account. No credit cards, no hidden fees.`,
    },
    {
      label: 'Set Your Goals',
      description: 'Use the goal tracker to define your long-term vision and break it down into manageable daily milestones.',
    },
    {
      label: 'Build Daily Habits',
      description: `Configure the daily habit tracker to monitor routines you want to build. Our streak tracker will keep you motivated to stay consistent.`,
    },
    {
      label: 'Review Your Progress',
      description: `Check your personalized dashboard to visualize your personal growth journey over time.`,
    },
  ];

  return (
    <div style={{ background: '#0b0f19', minHeight: '100vh', color: '#f3f4f6' }}>
      <SEO
        title="How VisionBoard Works | Guide to Goal & Habit Tracking"
        description="Learn how to use VisionBoard to track your habits, set goals, and improve your daily productivity. Follow our simple steps to personal growth."
        path="/how-it-works"
      />
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, mb: 4, textAlign: 'center' }}>
          How It Works
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem', textAlign: 'center', color: '#9ca3af', mb: 8 }}>
          Your journey to better habits and achieving your goals starts here.
        </Typography>
        
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Stepper orientation="vertical" sx={{ '& .MuiStepLabel-label': { color: '#a5b4fc', fontSize: '1.4rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700 } }}>
            {steps.map((step, index) => (
              <Step key={step.label} active={true}>
                <StepLabel>
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: '#9ca3af', fontSize: '1.1rem', mb: 4 }}>{step.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Container>
    </div>
  );
};

export default HowItWorks;
