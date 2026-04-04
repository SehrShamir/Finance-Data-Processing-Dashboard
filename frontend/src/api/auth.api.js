import api from './axiosInstance';

export const login = (data) => api.post('/auth/login', data).then((r) => r.data.data);
export const register = (data) => api.post('/auth/register', data).then((r) => r.data.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data.data);
export const changePassword = (data) => api.patch('/auth/change-password', data).then((r) => r.data);
