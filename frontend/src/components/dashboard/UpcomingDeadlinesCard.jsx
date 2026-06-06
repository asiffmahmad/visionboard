import React from 'react'
import { Box, Typography } from '@mui/material'
import DashboardCard from './DashboardCard'

const UpcomingDeadlinesCard = ({ tasks, goals }) => {
  // Combine tasks and goals with target/due dates
  const combined = []
  
  if (Array.isArray(tasks)) {
    tasks.forEach(t => {
      if (t.dueDate && t.status !== 'COMPLETED') {
        combined.push({ id: `t-${t.id}`, title: t.title, date: new Date(t.dueDate), type: 'Task' })
      }
    })
  }
  
  if (Array.isArray(goals)) {
    goals.forEach(g => {
      if (g.targetDate && g.progress < 100) {
        combined.push({ id: `g-${g.id}`, title: g.title, date: new Date(g.targetDate), type: 'Goal' })
      }
    })
  }

  // Sort by closest date
  combined.sort((a, b) => a.date - b.date)
  const upcoming = combined.slice(0, 4)

  return (
    <DashboardCard title="Upcoming Deadlines">
      {upcoming.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No upcoming deadlines.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative', ml: 1 }}>
          <Box sx={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 2, bgcolor: 'divider' }} />
          {upcoming.map((item, idx) => (
            <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: idx === upcoming.length - 1 ? 0 : 3, position: 'relative' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.type === 'Goal' ? 'secondary.main' : 'primary.main', mt: 0.5, zIndex: 1 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {item.type} • {item.date.toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </DashboardCard>
  )
}

export default UpcomingDeadlinesCard
