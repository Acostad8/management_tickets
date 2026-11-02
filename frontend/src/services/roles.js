import { api } from '../lib/api';

export const rolesService = {
  list: (activo) => api.get('/roles', { params: activo != null ? { activo } : {} }).then((r) => r.data),
  get: (id) => api.get(`/roles/${id}`).then((r) => r.data),
  create: (body) => api.post('/roles', body).then((r) => r.data),
  update: (id, body) => api.put(`/roles/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/roles/${id}`).then((r) => r.data),
  catalogoPermisos: () => api.get('/roles/catalogo/permisos').then((r) => r.data),
};
