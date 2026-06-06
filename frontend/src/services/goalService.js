import api from './api';

const API_URL = '/api/v1/goals';

export const createGoal = async (goalData) => {
  const response = await api.post(API_URL, goalData);
  return response.data;
};

export const getAllGoals = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getGoal = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateGoal = async (id, goalData) => {
  const response = await api.put(`${API_URL}/${id}`, goalData);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
