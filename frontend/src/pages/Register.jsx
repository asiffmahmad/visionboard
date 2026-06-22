import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { GoogleLogin } from '@react-oauth/google'
import { register, googleLogin } from '../services/authService'
import { clearError } from '../features/authSlice'
import { Divider } from '@mui/material'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!username.trim()) {
      errors.username = 'Username is required'
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    if (!validate()) return

    try {
      await register(username, email, password)
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
    <Card sx={{ 
      maxWidth: 450, 
      mx: 'auto', 
      background: 'rgba(255, 255, 255, 0.03)', 
      backdropFilter: 'blur(16px)', 
      border: '1px solid rgba(255, 255, 255, 0.08)', 
      borderRadius: 4, 
      color: '#f3f4f6',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      <Box sx={{ pt: 4, pb: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', p: 1.5, borderRadius: 2.5, display: 'inline-flex', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <DoneAllIcon sx={{ fontSize: 32, color: '#818cf8' }} />
        </Box>
        <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: '-0.025em' }}>
          Create Account
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          Join VisionBoard to organize your personal operating system
        </Typography>
      </Box>

      <CardContent sx={{ p: 4, pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Username"
              type="text"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!formErrors.username}
              helperText={formErrors.username}
              placeholder="johndoe"
              variant="outlined"
              InputLabelProps={{ style: { color: '#9ca3af' } }}
              InputProps={{ style: { color: '#f3f4f6' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                }
              }}
            />

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
              InputLabelProps={{ style: { color: '#9ca3af' } }}
              InputProps={{ style: { color: '#f3f4f6' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
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
              InputLabelProps={{ style: { color: '#9ca3af' } }}
              InputProps={{
                style: { color: '#f3f4f6' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#9ca3af' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                }
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              placeholder="••••••••"
              variant="outlined"
              InputLabelProps={{ style: { color: '#9ca3af' } }}
              InputProps={{
                style: { color: '#f3f4f6' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#9ca3af' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <PersonAddIcon />}
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
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            OR
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              dispatch(clearError())
              console.log('Login Failed')
            }}
            useOneTap
            theme="filled_black"
            shape="pill"
          />
        </Box>

      </CardContent>
    </Card>
  )
}

export default Register
