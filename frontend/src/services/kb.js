import { api } from '../lib/api';

export const kbService = {
  list: (params) => api.get('/base-conocimiento', { params }).then((r) => r.data),
  search: (q, params) => api.get('/base-conocimiento/buscar', { params: { q, ...params } }).then((r) => r.data),
  get: (id) => api.get(`/base-conocimiento/${id}`).then((r) => r.data),
  create: (body) => api.post('/base-conocimiento', body).then((r) => r.data),
  update: (id, body) => api.put(`/base-conocimiento/${id}`, body).then((r) => r.data),
  cambiarEstado: (id, estado) => api.patch(`/base-conocimiento/${id}/estado`, { estado }).then((r) => r.data),
  votarUtil: (id) => api.post(`/base-conocimiento/${id}/util`).then((r) => r.data),
  remove: (id) => api.delete(`/base-conocimiento/${id}`).then((r) => r.data),
};

export const MODULOS_KB = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio', 'general'];
export const ESTADOS_ARTICULO = ['borrador', 'publicado', 'archivado'];
