import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const AdUnit = ({
  client = 'ca-pub-2199514170121947',
  slot = '1234567890',
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (import.meta.env.PROD && typeof document !== 'undefined') {
      // Dynamically inject the AdSense script if it doesn't exist
      let script = document.getElementById('adsbygoogle-script');
      if (!script) {
        script = document.createElement('script');
        script.id = 'adsbygoogle-script';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize the ad
      if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
        try {
          if (typeof window !== 'undefined') {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (e) {
          console.error('AdSense error:', e);
        }
      }
    }
  }, [client]);

  // Show a placeholder box in local development instead of failing with AdSense errors
  if (import.meta.env.DEV) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: 250, 
        my: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '2px dashed #818cf8',
        bgcolor: 'rgba(99, 102, 241, 0.05)',
        borderRadius: 2
      }}>
        <Typography sx={{ color: '#818cf8', fontWeight: 600 }}>
          AdSense Space ({slot})
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', my: 2 }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </Box>
  );
};

export default AdUnit;
