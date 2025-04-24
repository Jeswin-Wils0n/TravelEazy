import axios from 'axios';

export const getPackages = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      queryParams.append(key, filters[key]);
    }
  });
  
  const res = await axios.get(`/api/packages?${queryParams.toString()}`);
  return res.data;
};

export const getPackage = async (id) => {
  const res = await axios.get(`/api/packages/${id}`);
  return res.data;
};

export const createPackage = async (packageData) => {
  const res = await axios.post('/api/packages', packageData);
  return res.data;
};

export const updatePackage = async (id, packageData) => {
  const res = await axios.put(`/api/packages/${id}`, packageData);
  return res.data;
};

export const deletePackage = async (id) => {
  const res = await axios.delete(`/api/packages/${id}`);
  return res.data;
};

export const getPackageStats = async () => {
  const res = await axios.get('/api/packages/stats/overview');
  return res.data;
};