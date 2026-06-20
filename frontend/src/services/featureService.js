import api from './api';

const ADMIN_API_URL = '/api/v1/admin/feature-flags';

export const getUserFeatures = async (userId) => {
  const response = await api.get(`${ADMIN_API_URL}/user/${userId}`);
  return response.data;
};

export const overrideUserFeature = async (userId, featureName, enabled) => {
  const response = await api.post(`${ADMIN_API_URL}/override?userId=${userId}&featureName=${featureName}&enabled=${enabled}`);
  return response.data;
};

export const removeUserOverride = async (userId, featureName) => {
  const response = await api.delete(`${ADMIN_API_URL}/override?userId=${userId}&featureName=${featureName}`);
  return response.data;
};
