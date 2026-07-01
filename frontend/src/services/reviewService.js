import api from './api';

const API_URL = '/api/v1/reviews';

export const submitReview = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};
