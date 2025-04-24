import axios from 'axios';

export const getAllBookings = async (page = 1, limit = 10) => {
  const res = await axios.get(`/api/bookings/admin?page=${page}&limit=${limit}`);
  return res.data;
};

export const getUserBookings = async (status) => {
  const queryParams = status ? `?status=${status}` : '';
  const res = await axios.get(`/api/bookings/user${queryParams}`);
  return res.data;
};

export const getBooking = async (id) => {
  const res = await axios.get(`/api/bookings/${id}`);
  return res.data;
};

export const createBooking = async (bookingData) => {
  const res = await axios.post('/api/bookings', bookingData);
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await axios.patch(`/api/bookings/${id}/status`, { status });
  return res.data;
};

export const getBookingStatsByPackage = async () => {
  const res = await axios.get('/api/bookings/stats/by-package');
  return res.data;
};
