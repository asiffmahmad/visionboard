import React from 'react';
import { Box, useTheme } from '@mui/material';

const AnimatedLogo = ({ width = 40, height = 40, ...props }) => {
  const theme = useTheme();
  
  // Elegant dynamic colors
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary?.main || '#ec4899';
  const eyelashColor = theme.palette.mode === 'dark' ? '#9ca3af' : '#4b5563';
  const pupilColor = theme.palette.mode === 'dark' ? '#111827' : '#000000';
  const scleraColor = theme.palette.mode === 'dark' ? '#e5e7eb' : '#ffffff';
  const shadowColor = theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
  
  return (
    <Box 
      sx={{ 
        width, 
        height, 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': { width: '100%', height: '100%', filter: `drop-shadow(0 2px 4px ${shadowColor})` } 
      }} 
      {...props}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="polishedIris" cx="45%" cy="45%" r="60%" fx="35%" fy="35%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="60%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#1e1b4b" />
          </radialGradient>
          <linearGradient id="scleraShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={scleraColor} />
            <stop offset="100%" stopColor={theme.palette.mode === 'dark' ? '#9ca3af' : '#f3f4f6'} />
          </linearGradient>
        </defs>
        <style>
          {`
            .eye-container {
              animation: elegantBlink 5s infinite;
              transform-origin: 50% 50%;
            }
            .pupil-group {
              animation: gentleLook 8s infinite alternate ease-in-out;
            }
            @keyframes elegantBlink {
              0%, 93%, 100% { transform: scaleY(1); }
              96.5% { transform: scaleY(0.05); }
            }
            @keyframes gentleLook {
              0%, 15% { transform: translate(0, 0); }
              25%, 35% { transform: translate(-6px, 2px); }
              45%, 55% { transform: translate(6px, -3px); }
              65%, 75% { transform: translate(0, 4px); }
              85%, 95% { transform: translate(4px, 0); }
              100% { transform: translate(0, 0); }
            }
            .eyelash {
              stroke: ${eyelashColor};
              stroke-width: 2.5;
              stroke-linecap: round;
              fill: none;
            }
          `}
        </style>
        
        <g className="eye-container">
          {/* Elegant Small Eyelashes (Curved) */}
          <path className="eyelash" d="M 28 32 Q 24 24 20 23" />
          <path className="eyelash" d="M 40 23 Q 38 15 35 13" />
          <path className="eyelash" d="M 50 20 Q 50 12 50 10" />
          <path className="eyelash" d="M 60 23 Q 62 15 65 13" />
          <path className="eyelash" d="M 72 32 Q 76 24 80 23" />
          
          {/* Sclera (Smooth Almond Shape) */}
          <path 
            d="M 10 50 Q 50 15 90 50 Q 50 85 10 50 Z" 
            fill="url(#scleraShine)" 
            stroke={eyelashColor} 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
          />
          
          <g className="pupil-group">
            {/* Rich Gradient Iris */}
            <circle cx="50" cy="50" r="16" fill="url(#polishedIris)" />
            {/* Dark Pupil */}
            <circle cx="50" cy="50" r="7" fill={pupilColor} />
            {/* Soft Catchlight (Reflection) */}
            <circle cx="45" cy="45" r="3" fill="#ffffff" opacity="0.9" />
            <circle cx="53" cy="48" r="1.5" fill="#ffffff" opacity="0.6" />
          </g>
        </g>
      </svg>
    </Box>
  );
};

export default AnimatedLogo;
