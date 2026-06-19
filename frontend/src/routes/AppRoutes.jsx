import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Pages
import Login from '../pages/Login'
import Register from '../pages/Register'
import Focus from '../pages/Focus'
import Dashboard from '../pages/Dashboard'
import Tasks from '../pages/Tasks'
import CreateTask from '../pages/CreateTask'
import EditTask from '../pages/EditTask'
import Profile from '../pages/Profile'
import Visions from '../pages/Visions'
import Goals from '../pages/Goals'
import Habits from '../pages/Habits'
import Notes from '../pages/Notes'
import Journal from '../pages/Journal'
import Admin from '../pages/Admin'
import AdminUsers from '../pages/AdminUsers'
import NotFound from '../pages/NotFound'
import HabitDetailPage from '../pages/HabitDetailPage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/focus" replace />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/visions" element={<Visions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/habits/:id" element={<HabitDetailPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/journal" element={<Journal />} />
          
          {/* Admin Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes

