import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Avatar,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import LockIcon from '@mui/icons-material/Lock'
import { useGoogleLogin } from '@react-oauth/google'
import { updateProfile } from '../services/profileService'
import { syncGoogleAccount } from '../services/authService'
import { resetProfileStatus } from '../features/profileSlice'
import ToastNotification from '../components/ToastNotification'
import api from '../services/api'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading, error, success } = useSelector((state) => state.profile)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [formErrors, setFormErrors] = useState({})
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setEmail(user.email || '')
    }
  }, [user])

  useEffect(() => {
    if (success) {
      showToast('Profile updated successfully!')
      setPassword('')
      setConfirmPassword('')
      dispatch(resetProfileStatus())
    }
    if (error) {
      showToast(error, 'error')
      dispatch(resetProfileStatus())
    }
  }, [success, error])

  const showToast = (message, severity = 'success') => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

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
      errors.email = 'Email is invalid'
    }
    if (password) {
      if (password.length < 6) {
        errors.password = 'New password must be at least 6 characters'
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await updateProfile({
        username,
        email,
        password: password || null,
      })
    } catch (err) {
      // Handled by useEffect matching slice error state
    }
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await syncGoogleAccount(tokenResponse.access_token)
        showToast('Successfully synced with Google!', 'success')
      } catch (err) {
        showToast(err.message || 'Failed to sync with Google', 'error')
      }
    },
    onError: () => showToast('Google sync failed', 'error'),
  })

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Profile Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account credentials, email, and password.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card View */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user?.avatarUrl}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: 32,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {!user?.avatarUrl && user?.username?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {user?.email}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {user?.isGoogleSynced ? (
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                      ✅ Synced with Google
                    </Typography>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => loginWithGoogle()}
                      startIcon={
                        <img 
                          src="https://developers.google.com/identity/images/g-logo.png" 
                          alt="Google" 
                          style={{ width: 18, height: 18 }}
                        />
                      }
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Sync with Google
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          {/* Data Export / Import */}
          <Card sx={{ mt: 4, textAlign: 'center', p: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Data Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Export all your tasks, goals, habits, visions, and journal entries, or import a backup.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, width: '100%', flexDirection: 'column' }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={async () => {
                    try {
                      const res = await api.get('/api/v1/sync/export')
                      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `visionboard-backup-${new Date().toISOString().split('T')[0]}.json`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      showToast('Data exported successfully!', 'success')
                    } catch (e) {
                      showToast('Failed to export data', 'error')
                    }
                  }}
                >
                  Export Data
                </Button>
                
                <input 
                  type="file" 
                  accept=".json" 
                  style={{ display: 'none' }} 
                  id="import-file"
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    try {
                      const text = await file.text()
                      const jsonData = JSON.parse(text)
                      const response = await api.post('/api/v1/sync/import', jsonData)
                      alert(`Data imported successfully! \n` +
                        `Visions: ${response.data.visionsImported}\n` +
                        `Goals: ${response.data.goalsImported}\n` +
                        `Tasks: ${response.data.tasksImported}\n` +
                        `Habits: ${response.data.habitsImported}\n` +
                        `Notes: ${response.data.notesImported}\n` +
                        `Journal Entries: ${response.data.journalEntriesImported}`
                      )
                      window.location.reload()
                    } catch (err) {
                      showToast('Invalid backup file or import failed', 'error')
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="secondary"
                  fullWidth
                  onClick={() => document.getElementById('import-file').click()}
                >
                  Import Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Account Information
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Username"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={!!formErrors.username}
                      helperText={formErrors.username}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 2 }}>
                      <LockIcon color="action" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Change Password (optional)
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      placeholder="Leave blank to keep current"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={!!formErrors.confirmPassword}
                      helperText={formErrors.confirmPassword}
                      placeholder="Leave blank to keep current"
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      {loading ? 'Saving Changes...' : 'Save Profile'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  )
}

export default Profile
