import api from './api'
import store from '../store'
import { authStart, loginSuccess, authFailure, logout as logoutAction } from '../features/authSlice'

export const login = async (email, password) => {
  store.dispatch(authStart());
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data;
    
    // Fetch profile info right after login
    const profileResponse = await api.get('/api/users/profile', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const user = profileResponse.data;
    store.dispatch(loginSuccess({ user, token: accessToken, refreshToken }));
    return user;
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid email or password';
    store.dispatch(authFailure(message));
    throw new Error(message);
  }
}

export const googleLogin = async (credential) => {
  store.dispatch(authStart());
  try {
    const response = await api.post('/api/auth/google', { credential });
    const { accessToken, refreshToken } = response.data;
    
    // Fetch profile info right after login
    const profileResponse = await api.get('/api/users/profile', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const user = profileResponse.data;
    store.dispatch(loginSuccess({ user, token: accessToken, refreshToken }));
    return user;
  } catch (error) {
    const message = error.response?.data?.message || 'Google Login failed';
    store.dispatch(authFailure(message));
    throw new Error(message);
  }
}

export const register = async (username, email, password) => {
  store.dispatch(authStart());
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    const { accessToken, refreshToken } = response.data;

    // Fetch profile info right after register
    const profileResponse = await api.get('/api/users/profile', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = profileResponse.data;
    store.dispatch(loginSuccess({ user, token: accessToken, refreshToken }));
    return user;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    store.dispatch(authFailure(message));
    throw new Error(message);
  }
}

export const logout = async () => {
  const state = store.getState();
  const refreshToken = state.auth.refreshToken;
  try {
    if (refreshToken) {
      await api.post('/api/auth/logout', { refreshToken });
    }
  } catch (error) {
    console.error('Logout error on server', error);
  } finally {
    store.dispatch(logoutAction());
  }
}
