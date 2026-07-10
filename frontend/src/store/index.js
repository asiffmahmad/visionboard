import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import tasksReducer from '../features/tasksSlice'
import dashboardReducer from '../features/dashboardSlice'
import profileReducer from '../features/profileSlice'
import themeReducer from '../features/themeSlice'
import visionReducer from '../features/visionSlice'
import goalReducer from '../features/goalSlice'
import habitReducer from '../features/habitSlice'
import journalReducer from '../features/journalSlice'
import adminReducer from '../features/adminSlice'
import announcementReducer from '../features/announcementSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    theme: themeReducer,
    visions: visionReducer,
    goals: goalReducer,
    habits: habitReducer,
    journal: journalReducer,
    admin: adminReducer,
    announcements: announcementReducer,
  },
})

export default store
