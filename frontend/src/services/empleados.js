import { api } from '../lib/api';

export const empleadosService = {
  list: (params) => api.get('/empleados', { params }).then((r) => r.data),
  get: (id) => api.get(`/empleados/${id}`).then((r) => r.data),
  create: (body) => api.post('/empleados', body).then((r) => r.data),
  update: (id, body) => api.put(`/empleados/${id}`, body).then((r) => r.data),
  cambiarEstado: (id, estado) => api.patch(`/empleados/${id}/estado`, { estado }).then((r) => r.data),
};
