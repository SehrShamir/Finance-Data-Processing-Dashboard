import api from './axiosInstance';

export const getUsers = (params) =>
  api.get('/users', { params }).then((r) => r.data);

export const getUser = (id) =>
  api.get(`/users/${id}`).then((r) => r.data.data.user);

export const createUser = (data) =>
  api.post('/users', data).then((r) => r.data.data.user);

export const updateUser = (id, data) =>
  api.patch(`/users/${id}`, data).then((r) => r.data.data.user);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then((r) => r.data);

export const restoreUser = (id) =>
  api.patch(`/users/${id}/restore`).then((r) => r.data.data.user);
