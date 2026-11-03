import { api } from '../lib/api';

export const pagosService = {
  list: (params) => api.get('/pagos', { params }).then((r) => r.data),
  get: (id) => api.get(`/pagos/${id}`).then((r) => r.data),
  byCliente: (clienteId) => api.get(`/pagos/cliente/${clienteId}`).then((r) => r.data),
  create: (body) => api.post('/pagos', body).then((r) => r.data),
  update: (id, body) => api.put(`/pagos/${id}`, body).then((r) => r.data),
  anular: (id, motivo) => api.post(`/pagos/${id}/anular`, { motivo }).then((r) => r.data),
  remove: (id) => api.delete(`/pagos/${id}`).then((r) => r.data),
};
