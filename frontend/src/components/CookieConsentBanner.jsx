import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Link, Slide, IconButton } from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import CloseIcon from '@mui/icons-material/Close';

const CONSENT_KEY = 'visionboard_cookie_consent';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Only show if consent hasn't been given yet
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so it doesn't flash on first paint
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      // If previously consented, enable ads
      const consent = JSON.parse(stored);
      if (consent.advertising) enableAds();
    }
  }, []);

  const enableAds = () => {
    // Signal to Google AdSense that consent was given
    window.adsbygoogle = window.adsbygoogle || [];
    // Grant consent for personalised ads
    if (window.googletag) {
      window.googletag.cmd = window.googletag.cmd || [];
      window.googletag.cmd.push(() => {
        window.googletag.pubads().setPrivacySettings({ nonPersonalizedAds: false });
      });
    }
  };

  const handleAcceptAll = () => {
    const consent = { essential: true, analytics: true, advertising: true, timestamp: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    enableAds();
    setVisible(false);
  };

  const handleDeclineAll = () => {
    const consent = { essential: true, analytics: false, advertising: false, timestamp: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    // Signal non-personalised ads only
    if (window.googletag) {
      window.googletag.cmd = window.googletag.cmd || [];
      window.googletag.cmd.push(() => {
        window.googletag.pubads().setPrivacySettings({ nonPersonalizedAds: true });
      });
    }
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    const consent = { essential: true, analytics: false, advertising: false, timestamp: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box
        role="dialog"
        aria-label="Cookie consent"
        sx={{
          position: 'fixed',
          bottom: { xs: 0, sm: 24 },
          left: { xs: 0, sm: '50%' },
          transform: { xs: 'none', sm: 'translateX(-50%)' },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { sm: 640 },
          zIndex: 9999,
          borderRadius: { xs: '16px 16px 0 0', sm: 4 },
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30,30,46,0.98) 0%, rgba(24,24,37,0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,245,255,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          p: { xs: 2.5, sm: 3 },
          mx: { xs: 0, sm: 2 },
        }}
      >
        {/* Close */}
        <IconButton
          size="small"
          onClick={handleDeclineAll}
          aria-label="Decline and close"
          sx={{ position: 'absolute', top: 12, right: 12, color: 'text.disabled' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CookieIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            We value your privacy
          </Typography>
        </Box>

        {/* Body */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.7 }}>
          We use cookies to enhance your experience, analyse traffic, and display personalised ads via{' '}
          <strong>Google AdSense</strong>. By clicking "Accept All", you consent to our use of cookies.
        </Typography>

        {/* Expandable details */}
        {showDetails && (
          <Box sx={{ mt: 1.5, mb: 1, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { name: 'Essential Cookies', desc: 'Authentication, session management. Always active.', always: true },
                { name: 'Analytics Cookies', desc: 'Help us understand how visitors use the site.' },
                { name: 'Advertising Cookies', desc: 'Used by Google AdSense to show relevant ads.' },
              ].map((item) => (
                <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{item.desc}</Typography>
                  </Box>
                  {item.always && (
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600, ml: 1, whiteSpace: 'nowrap' }}>
                      Always On
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Button
          size="small"
          onClick={() => setShowDetails((v) => !v)}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            p: 0,
            mb: 2,
            fontSize: '0.75rem',
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
          }}
        >
          {showDetails ? 'Hide details ▲' : 'Manage preferences ▼'}
        </Button>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAcceptAll}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              py: 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f52d4 0%, #d4367a 100%)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Accept All
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleEssentialOnly}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              py: 1,
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            }}
          >
            Essential Only
          </Button>
        </Box>

        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5, textAlign: 'center' }}>
          Read our{' '}
          <Link href="/privacy-policy" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Privacy Policy
          </Link>
          {' '}· Powered by VisionBoard CMP
        </Typography>
      </Box>
    </Slide>
  );
};

export default CookieConsentBanner;
