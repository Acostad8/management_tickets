import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
