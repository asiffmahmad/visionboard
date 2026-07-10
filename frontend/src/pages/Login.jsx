import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import SEO from '../components/SEO'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { GoogleLogin } from '@react-oauth/google'
import { login, googleLogin } from '../services/authService'
import { clearError, authFailure } from '../features/authSlice'

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid'
    }
    if (!password) {
      errors.password = 'Password is required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    if (!validate()) return

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      // Handled by authSlice and displayed via state
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    dispatch(clearError())
    try {
      await googleLogin(credentialResponse.credential)
      navigate('/dashboard')
    } catch (err) {
      // Error handled by redux
    }
  }

  return (
    <>
      <SEO
        title="Log In to VisionBoard | Your Productivity Hub"
        description="Log in to your VisionBoard account to track your daily habits, manage goals, and update your vision board."
        path="/login"
        noIndex={true}
      />
      <Card sx={{ 
      maxWidth: 450, 
      mx: 'auto', 
      background: 'rgba(255, 255, 255, 0.03)', 
      backdropFilter: 'blur(16px)', 
      border: '1px solid rgba(255, 255, 255, 0.08)', 
      borderRadius: 4, 
      color: (theme.palette.mode === 'dark' ? '#f3f4f6' : '#111827'),
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      <Box sx={{ pt: 4, pb: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'inline-flex', mb: 1 }}>
          <img src="/logo192.png" alt="Logo" style={{ width: 96, height: 96 }} />
        </Box>
        <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: '-0.025em' }}>
          Sign In to My Vision Board
        </Typography>
        <Typography variant="body2" sx={{ color: (theme.palette.mode === 'dark' ? '#9ca3af' : '#4b5563') }}>
          Manage your personal operating system
        </Typography>
      </Box>

      <CardContent sx={{ p: 4, pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: (theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'), color: (theme.palette.mode === 'dark' ? '#fca5a5' : '#ef4444'), border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              placeholder="name@example.com"
              variant="outlined"
              InputLabelProps={{ style: { color: (theme.palette.mode === 'dark' ? '#9ca3af' : '#4b5563') } }}
              InputProps={{ style: { color: (theme.palette.mode === 'dark' ? '#f3f4f6' : '#111827') } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)') },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                }
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              placeholder="••••••••"
              variant="outlined"
              InputLabelProps={{ style: { color: (theme.palette.mode === 'dark' ? '#9ca3af' : '#4b5563') } }}
              InputProps={{
                style: { color: (theme.palette.mode === 'dark' ? '#f3f4f6' : '#111827') },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: (theme.palette.mode === 'dark' ? '#9ca3af' : '#4b5563') }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)') },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <LoginIcon />}
              sx={{ 
                py: 1.5, 
                mt: 1,
                borderRadius: 2,
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                fontSize: 16,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                  boxShadow: '0 12px 25px rgba(99,102,241,0.4)',
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: (theme.palette.mode === 'dark' ? '#9ca3af' : '#4b5563') }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
              Create Account
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }}>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            OR
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              dispatch(authFailure("Google Login popup blocked by browser. Check popup permissions or use Email login."))
              console.log('Login Failed')
            }}
            theme="filled_black"
            shape="pill"
          />
        </Box>

      </CardContent>
    </Card>
    </>
  )
}

export default Login
