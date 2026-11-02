import { api } from '../lib/api';

export const usuariosService = {
  list: (params) => api.get('/usuarios', { params }).then((r) => r.data),
  get: (id) => api.get(`/usuarios/${id}`).then((r) => r.data),
  create: (body) => api.post('/usuarios', body).then((r) => r.data),
  update: (id, body) => api.put(`/usuarios/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/usuarios/${id}`).then((r) => r.data),
  assignRoles: (id, roles) => api.patch(`/usuarios/${id}/roles`, { roles }).then((r) => r.data),
  cambiarEstado: (id, estado) => api.patch(`/usuarios/${id}/estado`, { estado }).then((r) => r.data),
  unlock: (id) => api.post(`/usuarios/${id}/unlock`).then((r) => r.data),
};
