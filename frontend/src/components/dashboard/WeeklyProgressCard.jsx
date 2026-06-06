import React from 'react'
import { Box } from '@mui/material'
import DashboardCard from './DashboardCard'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const WeeklyProgressCard = ({ tasks }) => {
  // Generate last 7 days names
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const data = []
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    data.push({
      name: days[d.getDay()],
      dateStr: d.toISOString().split('T')[0],
      tasks: 0,
      habits: 0 // Mocked for now if habits don't have historical completion array
    })
  }

  if (Array.isArray(tasks)) {
    tasks.forEach(task => {
      if (task.status === 'COMPLETED' && task.updatedAt) {
        const updateDate = new Date(task.updatedAt).toISOString().split('T')[0]
        const dayRecord = data.find(d => d.dateStr === updateDate)
        if (dayRecord) {
          dayRecord.tasks += 1
        }
      }
    })
  }

  return (
    <DashboardCard title="Weekly Progress">
      <Box sx={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.04)' }} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="tasks" name="Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="habits" name="Habits" fill="#93c5fd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </DashboardCard>
  )
}

export default WeeklyProgressCard
