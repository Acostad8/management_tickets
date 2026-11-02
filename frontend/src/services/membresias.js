import { api } from '../lib/api';

export const membresiasService = {
  list: (params) => api.get('/membresias', { params }).then((r) => r.data),
  get: (id) => api.get(`/membresias/${id}`).then((r) => r.data),
  byCliente: (clienteId) => api.get(`/membresias/cliente/${clienteId}`).then((r) => r.data),
  create: (body) => api.post('/membresias', body).then((r) => r.data),
  update: (id, body) => api.put(`/membresias/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/membresias/${id}`).then((r) => r.data),
  cambiarEstado: (id, estado) => api.patch(`/membresias/${id}/estado`, { estado }).then((r) => r.data),
};
