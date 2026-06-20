import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { AdminPanelSettings, Person } from '@mui/icons-material';
import { getAllUsersWithActivities, updateUserRole } from '../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersWithActivities();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
      const updatedUser = await updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: updatedUser.role } : u));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Manage Users
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Mobile View (Cards) */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {users.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No users found.</Typography>
        ) : (
          users.map((user) => (
            <Paper key={user.id} elevation={2} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.username}
                </Typography>
                <Chip 
                  icon={(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? <AdminPanelSettings /> : <Person />}
                  label={user.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : user.role} 
                  color={user.role === 'SUPER_ADMIN' ? 'warning' : user.role === 'ADMIN' ? 'secondary' : 'default'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.email}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Tasks</Typography>
                  <Typography variant="body2" fontWeight="bold">{user.tasksCount}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Goals</Typography>
                  <Typography variant="body2" fontWeight="bold">{user.goalsCount}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Habits</Typography>
                  <Typography variant="body2" fontWeight="bold">{user.habitsCount}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Visions</Typography>
                  <Typography variant="body2" fontWeight="bold">{user.visionsCount}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last Login: {user.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : 'Never'}
                </Typography>
                {user.role === 'SUPER_ADMIN' ? (
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">Protected</Typography>
                ) : (
                  <Button 
                    variant={user.role === 'ADMIN' ? 'outlined' : 'contained'}
                    color={user.role === 'ADMIN' ? 'error' : 'secondary'}
                    size="small"
                    onClick={() => handleToggleRole(user.id, user.role)}
                  >
                    {user.role === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'}
                  </Button>
                )}
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Desktop View (Table) */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflowX: 'auto', display: { xs: 'none', md: 'block' } }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Last Login</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Tasks</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Goals</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Habits</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Visions</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    icon={(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? <AdminPanelSettings /> : <Person />}
                    label={user.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : user.role} 
                    color={user.role === 'SUPER_ADMIN' ? 'warning' : user.role === 'ADMIN' ? 'secondary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {user.lastSeen 
                    ? new Date(user.lastSeen).toLocaleString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      }) 
                    : <Typography variant="caption" color="text.secondary">Never</Typography>}
                </TableCell>
                <TableCell align="center">{user.tasksCount}</TableCell>
                <TableCell align="center">{user.goalsCount}</TableCell>
                <TableCell align="center">{user.habitsCount}</TableCell>
                <TableCell align="center">{user.visionsCount}</TableCell>
                <TableCell align="center">
                  {user.role === 'SUPER_ADMIN' ? (
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">Protected</Typography>
                  ) : (
                    <Button 
                      variant={user.role === 'ADMIN' ? 'outlined' : 'contained'}
                      color={user.role === 'ADMIN' ? 'error' : 'secondary'}
                      size="small"
                      onClick={() => handleToggleRole(user.id, user.role)}
                    >
                      {user.role === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">No users found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsers;
