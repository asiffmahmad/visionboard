import api from './api';

const API_URL = '/api/v1/admin';

export const createAnnouncement = async (data) => {
  const response = await api.post(`${API_URL}/announcements`, data);
  return response.data;
};

export const getAllAnnouncements = async () => {
  const response = await api.get(`${API_URL}/announcements`);
  return response.data;
};

export const updateAnnouncement = async (id, data) => {
  const response = await api.put(`${API_URL}/announcements/${id}`, data);
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`${API_URL}/announcements/${id}`);
  return response.data;
};

export const getAllFeatureFlags = async () => {
  const response = await api.get(`${API_URL}/feature-flags`);
  return response.data;
};

export const updateGlobalFlag = async (featureName, enabled) => {
  const response = await api.put(`${API_URL}/feature-flags/${featureName}?enabled=${enabled}`);
  return response.data;
};

export const overrideUserFeature = async (userId, featureName, enabled) => {
  const response = await api.post(`${API_URL}/feature-flags/override?userId=${userId}&featureName=${featureName}&enabled=${enabled}`);
  return response.data;
};

export const removeUserOverride = async (userId, featureName) => {
  const response = await api.delete(`${API_URL}/feature-flags/override?userId=${userId}&featureName=${featureName}`);
  return response.data;
};

// User Management

export const getAllUsersWithActivities = async () => {
  const response = await api.get(`${API_URL}/users`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`${API_URL}/users/${userId}/role?role=${role}`);
  return response.data;
};
