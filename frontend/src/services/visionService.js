import api from './api';

const API_URL = '/api/v1/visions';

export const createVision = async (visionData) => {
  const response = await api.post(API_URL, visionData);
  return response.data;
};

export const getAllVisions = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getVision = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateVision = async (id, visionData) => {
  const response = await api.put(`${API_URL}/${id}`, visionData);
  return response.data;
};

export const deleteVision = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
