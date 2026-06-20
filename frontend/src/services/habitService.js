import api from './api';

const API_URL = '/api/v1/habits';

export const createHabit = async (habitData) => {
  const response = await api.post(API_URL, habitData);
  return response.data;
};

export const getAllHabits = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getHabit = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateHabit = async (id, habitData) => {
  const response = await api.put(`${API_URL}/${id}`, habitData);
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

export const logHabit = async (id, date, status) => {
  const response = await api.post(`${API_URL}/${id}/log?date=${date}&status=${status}`);
  return response.data;
};

export const skipHabit = async (id, date, reason, notes = '') => {
  const response = await api.post(`${API_URL}/${id}/skip?date=${date}&reason=${encodeURIComponent(reason)}&notes=${encodeURIComponent(notes)}`);
  return response.data;
};

export const getHabitAnalytics = async (id) => {
  const response = await api.get(`${API_URL}/${id}/analytics`);
  return response.data;
};

export const getHabitTimeline = async (id) => {
  const response = await api.get(`${API_URL}/${id}/timeline`);
  return response.data;
};

export const getHabitHeatmap = async (id) => {
  const response = await api.get(`${API_URL}/${id}/heatmap`);
  return response.data;
};

export const getHabitAchievements = async (id) => {
  const response = await api.get(`${API_URL}/${id}/achievements`);
  return response.data;
};
