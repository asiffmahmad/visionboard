import React from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import DashboardCard from './DashboardCard'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const RecentWinsCard = ({ tasks, goals }) => {
  const wins = []
  
  if (Array.isArray(tasks)) {
    tasks.filter(t => t.status === 'COMPLETED').slice(0, 3).forEach(t => {
      wins.push({ id: `t-${t.id}`, type: 'task', title: `Finished "${t.title}"`, time: 'Recently', icon: <TaskAltIcon fontSize="small" />, color: '#3b82f6', sortDate: new Date(t.updatedAt || new Date()) })
    })
  }

  if (Array.isArray(goals)) {
    goals.filter(g => g.progress === 100).slice(0, 2).forEach(g => {
      wins.push({ id: `g-${g.id}`, type: 'goal', title: `Completed Goal: ${g.title}`, time: 'Recently', icon: <EmojiEventsIcon fontSize="small" />, color: '#fbbf24', sortDate: new Date(g.updatedAt || new Date()) })
    })
  }

  wins.sort((a, b) => b.sortDate - a.sortDate)
  const displayWins = wins.slice(0, 5)

  return (
    <DashboardCard title="Recent Wins">
      {displayWins.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No recent wins yet. Keep pushing!</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayWins.map((win) => (
          <Box key={win.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: win.color, width: 32, height: 32 }}>
              {win.icon}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {win.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {win.time}
              </Typography>
            </Box>
          </Box>
        ))}
        </Box>
      )}
    </DashboardCard>
  )
}

export default RecentWinsCard
