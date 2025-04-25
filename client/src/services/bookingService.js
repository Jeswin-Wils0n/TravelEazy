// import axios from 'axios';
import api from './api';

export const getAllBookings = async (page = 1, limit = 10) => {
  const res = await api.get(`/api/bookings/admin?page=${page}&limit=${limit}`);
  return res.data;
};

export const getUserBookings = async (status) => {
  const queryParams = status ? `?status=${status}` : '';
  const res = await api.get(`/api/bookings/user${queryParams}`);
  return res.data;
};

export const getBooking = async (id) => {
  const res = await api.get(`/api/bookings/${id}`);
  return res.data;
};

export const createBooking = async (bookingData) => {
  const res = await api.post('/api/bookings', bookingData);
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await api.patch(`/api/bookings/${id}/status`, { status });
  return res.data;
};

export const getBookingStatsByPackage = async () => {
  const res = await api.get('/api/bookings/stats/by-package');
  return res.data;
};
