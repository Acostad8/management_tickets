import { api } from '../lib/api';

export const ticketsService = {
  list: (params) => api.get('/tickets', { params }).then((r) => r.data),
  get: (id) => api.get(`/tickets/${id}`).then((r) => r.data),
  create: (body) => api.post('/tickets', body).then((r) => r.data),
  update: (id, body) => api.put(`/tickets/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/tickets/${id}`).then((r) => r.data),
  asignar: (id, empleadoId) => api.patch(`/tickets/${id}/asignar`, { empleadoId }).then((r) => r.data),
  cambiarEstado: (id, estado) => api.patch(`/tickets/${id}/estado`, { estado }).then((r) => r.data),
  responder: (id, mensaje, esInterno = false) =>
    api.post(`/tickets/${id}/respuestas`, { mensaje, esInterno }).then((r) => r.data),
  registrarSolucion: (id, descripcion) =>
    api.put(`/tickets/${id}/solucion`, { descripcion }).then((r) => r.data),
};

export const MODULOS = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio'];
export const ESTADOS = ['nuevo', 'en_proceso', 'en_espera', 'resuelto', 'cerrado'];
export const PRIORIDADES = ['baja', 'media', 'alta', 'critica'];
export const TIPOS = ['incidente', 'sugerencia'];

export const DETALLES_SCHEMA = {
  ventas_online: [
    { name: 'idPasarela',  label: 'ID Pasarela de pago' },
    { name: 'urlError',    label: 'URL del error' },
    { name: 'navegador',   label: 'Navegador' },
    { name: 'logApi',      label: 'Log de API', type: 'textarea' },
  ],
  inventarios: [
    { name: 'codigoProducto',       label: 'Código de producto' },
    { name: 'cantidadDiscrepancia', label: 'Cantidad en discrepancia', type: 'number' },
    { name: 'bodega',               label: 'Bodega' },
  ],
  compras: [
    { name: 'numeroOrden',         label: 'Número de orden' },
    { name: 'proveedor',           label: 'Proveedor' },
    { name: 'montoDiscrepancia',   label: 'Monto en discrepancia', type: 'number' },
  ],
  produccion: [
    { name: 'idMaquinaria', label: 'ID Maquinaria' },
    { name: 'codigoLote',   label: 'Código de lote' },
    { name: 'faseProceso',  label: 'Fase del proceso' },
    { name: 'temperatura',  label: 'Temperatura (°C)', type: 'number' },
  ],
  ventas_sitio: [
    { name: 'numeroCaja', label: 'Número de caja' },
    { name: 'turno',      label: 'Turno' },
    { name: 'cajero',     label: 'Cajero' },
  ],
};

export const ESTADO_COLORS = {
  nuevo:      'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  en_proceso: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  en_espera:  'bg-purple-500/10 text-purple-300 border border-purple-500/20',
  resuelto:   'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  cerrado:    'bg-zinc-800 text-zinc-400 border border-zinc-700',
};

export const PRIORIDAD_COLORS = {
  baja:    'bg-zinc-800 text-zinc-400 border border-zinc-700',
  media:   'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  alta:    'bg-orange-500/10 text-orange-300 border border-orange-500/20',
  critica: 'bg-red-500/10 text-red-300 border border-red-500/20',
};
