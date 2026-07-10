import React from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  Divider,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FlagIcon from '@mui/icons-material/Flag'
import RepeatIcon from '@mui/icons-material/Repeat'
import NotesIcon from '@mui/icons-material/Notes'
import BookIcon from '@mui/icons-material/Book'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import StarIcon from '@mui/icons-material/Star'
import InfoIcon from '@mui/icons-material/Info'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { useSelector } from 'react-redux'
import { logout } from '../services/authService'

const Sidebar = ({ mobileOpen, onDrawerToggle, drawerWidth }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { text: 'Focus', icon: <StarIcon />, path: '/focus' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }
  ]

  // Toggleable Features
  if (user?.features?.VISIONS_MODULE !== false) {
    menuItems.push({ text: 'Visions', icon: <VisibilityIcon />, path: '/visions' })
  }
  if (user?.features?.GOALS_MODULE !== false) {
    menuItems.push({ text: 'Goals', icon: <FlagIcon />, path: '/goals' })
  }
  if (user?.features?.TASKS_MODULE !== false) {
    menuItems.push({ text: 'My Tasks', icon: <AssignmentIcon />, path: '/tasks' })
  }
  if (user?.features?.HABITS_MODULE !== false) {
    menuItems.push({ text: 'Habits', icon: <RepeatIcon />, path: '/habits' })
  }

  // Notes and Journal are now default visible along with Profile and About
  menuItems.push({ text: 'Notes', icon: <NotesIcon />, path: '/notes' })
  menuItems.push({ text: 'Journal', icon: <BookIcon />, path: '/journal' })
  menuItems.push({ text: 'Profile', icon: <PersonIcon />, path: '/profile' })
  menuItems.push({ text: 'About', icon: <InfoIcon />, path: '/about' })

  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    menuItems.push({ text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' })
    menuItems.push({ text: 'Manage Users', icon: <PersonIcon />, path: '/admin/users' })
    menuItems.push({ text: 'User Feedback', icon: <StarIcon />, path: '/admin/reviews' })
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <DoneAllIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            fontFamily: 'Outfit',
            letterSpacing: '-1px',
            background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          VisionBoard
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexGrow: 1, px: 2, py: 3 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
          {menuItems.map((item) => {
            const active = item.path === '/admin' 
              ? pathname === '/admin' 
              : (pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path)));
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => { if (mobileOpen) onDrawerToggle() }}
                  aria-label={`Navigate to ${item.text}`}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? 'primary.contrastText' : 'text.secondary',
                    '&:hover': {
                      bgcolor: active ? 'primary.main' : 'action.hover',
                      color: active ? 'primary.contrastText' : 'text.primary',
                      '& .MuiListItemIcon-root': {
                        color: active ? 'primary.contrastText' : 'primary.main',
                      },
                    },
                    transition: 'all 0.15s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: active ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        {/* Privacy Policy link — required for Google AdSense */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            to="/privacy-policy"
            onClick={() => { if (mobileOpen) onDrawerToggle() }}
            aria-label="Privacy Policy"
            sx={{
              borderRadius: 2,
              py: 0.8,
              px: 2,
              color: 'text.disabled',
              '&:hover': {
                color: 'text.secondary',
                bgcolor: 'action.hover',
              },
              transition: 'all 0.15s ease-in-out',
            }}
          >
            <ListItemText
              primary="Privacy Policy"
              primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
        <ListItemButton
          onClick={() => {
            if (mobileOpen) onDrawerToggle();
            handleLogout();
          }}
          aria-label="Logout"
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default Sidebar
