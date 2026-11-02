import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TicketsListPage } from '../pages/tickets/TicketsListPage';
import { TicketCreatePage } from '../pages/tickets/TicketCreatePage';
import { TicketDetailPage } from '../pages/tickets/TicketDetailPage';
import { UsuariosListPage } from '../pages/usuarios/UsuariosListPage';
import { RolesListPage } from '../pages/roles/RolesListPage';
import { KbListPage } from '../pages/kb/KbListPage';
import { KbDetailPage } from '../pages/kb/KbDetailPage';
import { KbCreatePage } from '../pages/kb/KbCreatePage';
import { ReportesPage } from '../pages/ReportesPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },

      { path: '/tickets',          element: <TicketsListPage /> },
      { path: '/tickets/nuevo',    element: <TicketCreatePage /> },
      { path: '/tickets/:id',      element: <TicketDetailPage /> },

      { path: '/usuarios',         element: <UsuariosListPage /> },
      { path: '/roles',            element: <RolesListPage /> },

      { path: '/base-conocimiento',          element: <KbListPage /> },
      { path: '/base-conocimiento/nuevo',    element: <KbCreatePage /> },
      { path: '/base-conocimiento/:id',      element: <KbDetailPage /> },

      { path: '/reportes',         element: <ReportesPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
