import api from './axiosInstance';

export const getTransactions = (params) =>
  api.get('/transactions', { params }).then((r) => r.data);

export const getTransaction = (id) =>
  api.get(`/transactions/${id}`).then((r) => r.data.data.transaction);

export const createTransaction = (data) =>
  api.post('/transactions', data).then((r) => r.data.data.transaction);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data).then((r) => r.data.data.transaction);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((r) => r.data);
