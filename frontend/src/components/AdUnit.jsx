import React, { useEffect } from 'react';
import { Box } from '@mui/material';

const AdUnit = ({
  client = 'ca-pub-2199514170121947',
  slot = '1234567890', // Default placeholder slot
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', my: 2 }}>
      <ins
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
