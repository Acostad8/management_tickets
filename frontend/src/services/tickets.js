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
  nuevo:      'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  en_proceso: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  en_espera:  'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  resuelto:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  cerrado:    'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export const PRIORIDAD_COLORS = {
  baja:    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  media:   'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  alta:    'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  critica: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
};
