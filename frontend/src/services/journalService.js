import api from './api';

const API_URL = '/api/v1/journal';

export const createEntry = async (entryData) => {
  const response = await api.post(API_URL, entryData);
  return response.data;
};

export const getAllEntries = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getEntry = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateEntry = async (id, entryData) => {
  const response = await api.put(`${API_URL}/${id}`, entryData);
  return response.data;
};

export const deleteEntry = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
