import { api } from '../lib/api';

export const capacitacionesService = {
  list: (params) => api.get('/capacitaciones', { params }).then((r) => r.data),
  get: (id) => api.get(`/capacitaciones/${id}`).then((r) => r.data),
  create: (body) => api.post('/capacitaciones', body).then((r) => r.data),
  update: (id, body) => api.put(`/capacitaciones/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/capacitaciones/${id}`).then((r) => r.data),
  cambiarEstado: (id, estado) => api.patch(`/capacitaciones/${id}/estado`, { estado }).then((r) => r.data),

  asistencias: (capacitacionId) => api.get(`/capacitaciones/${capacitacionId}/asistencias`).then((r) => r.data),
  registrarAsistencia: (capacitacionId, body) => api.post(`/capacitaciones/${capacitacionId}/asistencias`, body).then((r) => r.data),
  removeAsistencia: (asistenciaId) => api.delete(`/capacitaciones/asistencias/${asistenciaId}`).then((r) => r.data),
};
