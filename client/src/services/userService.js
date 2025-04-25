import api from './api';

export const getAllUsers = async (page = 1, limit = 10) => {
  const res = await api.get(`/api/users?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/api/users/profile', profileData);
  return res.data;
};

export const getUserWithBookings = async (id) => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};