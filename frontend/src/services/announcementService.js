import api from './api';

const API_URL = '/api/v1/announcements';

export const getActiveAnnouncements = async () => {
  const response = await api.get(`${API_URL}/active`);
  return response.data;
};
