import api from './api';

const API_URL = '/api/v1/notes';

export const createNote = async (noteData) => {
  const response = await api.post(API_URL, noteData);
  return response.data;
};

export const getAllNotes = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getNote = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`${API_URL}/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
