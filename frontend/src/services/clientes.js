import { api } from '../lib/api';

export const clientesService = {
  list: (params) => api.get('/clientes', { params }).then((r) => r.data),
  get: (id) => api.get(`/clientes/${id}`).then((r) => r.data),
  create: (body) => api.post('/clientes', body).then((r) => r.data),
  update: (id, body) => api.put(`/clientes/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/clientes/${id}`).then((r) => r.data),
  cambiarEstado: (id, estado) => api.patch(`/clientes/${id}/estado`, { estado }).then((r) => r.data),
};
