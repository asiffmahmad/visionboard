import React, { useMemo, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AppRoutes from '../routes/AppRoutes'
import { fetchProfile, logout } from '../features/authSlice'
import CookieConsentBanner from '../components/CookieConsentBanner'

// 30 minutes idle timeout
const IDLE_TIMEOUT_MS = 30 * 60 * 1000

const App = () => {
  const { darkMode } = useSelector((state) => state.theme)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile())
    }
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        dispatch(logout());
        alert("Session expired due to inactivity. Please log in again.");
      }, IDLE_TIMEOUT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((evt) => document.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((evt) => document.removeEventListener(evt, resetTimer));
    };
  }, [isAuthenticated, dispatch]);

  
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#6366f1', // Indigo
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ec4899', // Pink
            light: '#f472b6',
            dark: '#db2777',
          },
          background: {
            default: darkMode ? '#0b0f19' : '#f9fafb', // Premium Dark Navy vs Cool Light Grey
            paper: darkMode ? '#111827' : '#ffffff',   // Muted slate vs clean white
          },
          text: {
            primary: darkMode ? '#f3f4f6' : '#111827',
            secondary: darkMode ? '#9ca3af' : '#4b5563',
          },
          divider: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
        typography: {
          fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 800 },
          h2: { fontWeight: 800 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          subtitle1: { fontWeight: 500 },
          subtitle2: { fontWeight: 500 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                },
              },
              containedSecondary: {
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.25)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                boxShadow: darkMode
                  ? '0 4px 20px 0 rgba(0, 0, 0, 0.4)'
                  : '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                border: darkMode
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : '1px solid rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: darkMode
                    ? '0 12px 28px 0 rgba(0, 0, 0, 0.6)'
                    : '0 12px 28px 0 rgba(99, 102, 241, 0.15)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [darkMode]
  )

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
          <CookieConsentBanner />
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App
