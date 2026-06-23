import React from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import AdUnit from './AdUnit';

const AdSidebar = () => {
  return (
    <Box
      component="aside"
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: 320 },
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        // Make the sidebar sticky on desktop
        position: { md: 'sticky' },
        top: { md: 88 }, // Accounts for the navbar height
        height: { md: 'max-content' },
      }}
    >
      {/* Top Ad Unit */}
      <Card sx={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
          Advertisement
        </Typography>
        <AdUnit slot="2747407245" />
      </Card>

      {/* Recommended Tools / Call to Action */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(236,72,153,0.05) 100%)', 
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 4
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 2 }}>
            Start Your Journey
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
            Join hundreds of users building life-changing habits with VisionBoard's free productivity tools.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Box sx={{ textAlign: 'center', py: 1.5, borderRadius: 2, background: '#6366f1', color: 'white', fontWeight: 600, transition: 'all 0.2s', '&:hover': { background: '#4f46e5' } }}>
                Create Free Account
              </Box>
            </Link>
            <Link to="/features" style={{ textDecoration: 'none' }}>
              <Box sx={{ textAlign: 'center', py: 1.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', color: 'text.primary', fontWeight: 500, transition: 'all 0.2s', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                Explore Features
              </Box>
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* Bottom Ad Unit (Only visible on larger screens to prevent ad stuffing on mobile) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
          Advertisement
        </Typography>
        <AdUnit slot="2747407245" />
      </Box>
    </Box>
  );
};

export default AdSidebar;
