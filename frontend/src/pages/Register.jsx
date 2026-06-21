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
    <Card sx={{ maxWidth: 450, mx: 'auto' }}>
      <Box sx={{ pt: 4, pb: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ bgcolor: 'rgba(37, 99, 235, 0.08)', p: 1.5, borderRadius: 2.5, display: 'inline-flex' }}>
          <DoneAllIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Join VisionBoard to organize your personal operating system
        </Typography>
      </Box>

      <CardContent sx={{ p: 4, pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
              sx={{ py: 1.2, mt: 1 }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
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
          />
        </Box>

      </CardContent>
    </Card>
  )
}

export default Register
