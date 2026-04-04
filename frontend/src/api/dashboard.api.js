import api from './axiosInstance';

export const getSummary = (params) =>
  api.get('/dashboard/summary', { params }).then((r) => r.data.data);

export const getTrends = (params) =>
  api.get('/dashboard/trends', { params }).then((r) => r.data.data);

export const getCategories = (params) =>
  api.get('/dashboard/categories', { params }).then((r) => r.data.data);

export const getRecent = () =>
  api.get('/dashboard/recent').then((r) => r.data.data);
