import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== USERS API ====================
export const usersAPI = {
  getAll: () => api.get('/users/').then(res => res.data.usuarios || []),
  getById: (id) => api.get(`/users/${id}`).then(res => res.data),
  create: (data) => api.post('/users/', data).then(res => res.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/users/${id}`).then(res => res.data),
};


// ==================== RESERVAS API ====================
export const reservasAPI = {
  getAll: () => api.get('/reservas/').then(res => res.data.reservas || []),
  create: (data) => api.post('/reservas/', data).then(res => res.data),
  update: (id, data) => api.put(`/reservas/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/reservas/${id}`).then(res => res.data),
};
export default api;
