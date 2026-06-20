import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'

const DashboardCard = ({ title, children, action, sx = {} }) => {
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'none',
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {title && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: '-0.01em' }}>
              {title}
            </Typography>
            {action && <Box>{action}</Box>}
          </Box>
        )}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0 }}>{children}</Box>
      </CardContent>
    </Card>
  )
}

export default DashboardCard
