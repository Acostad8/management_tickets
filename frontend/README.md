# Tickets Frontend

React 18 + Vite + TailwindCSS 3 + Axios + Zustand + React Router 6.

## Scripts

```
npm install
npm run dev       # http://localhost:5173
npm run build     # build producción
npm run preview   # preview build
```

Backend debe estar corriendo en `http://localhost:8080` (configurable con `VITE_API_URL`).

## Estructura

```
src/
├── lib/api.js              # Axios + interceptor JWT auto-refresh
├── stores/
│   ├── useAuthStore.js     # Zustand persistido (accessToken, refreshToken, user)
│   └── useThemeStore.js    # Modo claro/oscuro persistido
├── router/index.jsx        # Rutas con ProtectedRoute
├── components/
│   ├── Sidebar.jsx         # Nav responsive filtrada por permisos
│   ├── Topbar.jsx          # User info + logout + theme toggle
│   ├── ThemeToggle.jsx
│   └── ProtectedRoute.jsx
├── layouts/AppLayout.jsx   # Shell principal
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx   # Resumen desde /dashboard/resumen
│   └── NotFoundPage.jsx
└── index.css               # Tailwind + componentes @layer
```

## Features Fase 7

- Login JWT con persistencia en localStorage
- Auto-refresh de access token al recibir 401
- Guard por permisos (`useAuthStore.hasPermission('x')`)
- Sidebar responsive con items filtrados por permisos del usuario
- Modo claro/oscuro con toggle (clase `dark` en `<html>`)
- Dashboard consume agregaciones del backend (`/api/v1/dashboard/resumen`)
- Proxy Vite `/api → :8080` para evitar CORS en dev
