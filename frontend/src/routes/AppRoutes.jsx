import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import { CircularProgress, Box } from '@mui/material'

// Eagerly loaded public pages (for immediate LCP)
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'

// Lazy loaded public pages
const PublicAbout = lazy(() => import('../pages/PublicAbout'))
const Features = lazy(() => import('../pages/Features'))
const HowItWorks = lazy(() => import('../pages/HowItWorks'))
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'))
const Contact = lazy(() => import('../pages/Contact'))
const Blog = lazy(() => import('../pages/Blog'))
const BlogPost = lazy(() => import('../pages/BlogPost'))
const SeoClusterPage = lazy(() => import('../pages/SeoClusterPage'))

const PublicLayoutWithSidebar = lazy(() => import('../layouts/PublicLayoutWithSidebar'))

// Lazy loaded protected pages
const Focus = lazy(() => import('../pages/Focus'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Tasks = lazy(() => import('../pages/Tasks'))
const CreateTask = lazy(() => import('../pages/CreateTask'))
const EditTask = lazy(() => import('../pages/EditTask'))
const Profile = lazy(() => import('../pages/Profile'))
const Visions = lazy(() => import('../pages/Visions'))
const Goals = lazy(() => import('../pages/Goals'))
const Habits = lazy(() => import('../pages/Habits'))
const HabitDetailPage = lazy(() => import('../pages/HabitDetailPage'))
const Notes = lazy(() => import('../pages/Notes'))
const Journal = lazy(() => import('../pages/Journal'))
const About = lazy(() => import('../pages/About'))
const Feedback = lazy(() => import('../pages/Feedback'))
const NotFound = lazy(() => import('../pages/NotFound'))

// Lazy loaded admin pages
const Admin = lazy(() => import('../pages/Admin'))
const AdminUsers = lazy(() => import('../pages/AdminUsers'))
const AdminReviews = lazy(() => import('../pages/AdminReviews'))

// Smart home: logged-in users go to /focus, others see Landing
const SmartHome = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? <Navigate to="/focus" replace /> : <Landing />
}

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0b0f19' }}>
    <CircularProgress color="primary" />
  </Box>
)

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SmartHome />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<PublicAbout />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        {/* Public Content Routes with Sidebar (AdSense) */}
        <Route element={<PublicLayoutWithSidebar />}>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/use-case/:slug" element={<SeoClusterPage />} />
        </Route>

        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/focus" element={<Focus />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/create" element={<CreateTask />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/visions" element={<Visions />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/habits/:id" element={<HabitDetailPage />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/feedback" element={<Feedback />} />
            
            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
