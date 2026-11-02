import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggle: () => set((s) => {
        const next = s.theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        return { theme: next };
      }),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    { name: 'tickets-theme' }
  )
);

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export function initTheme() {
  const stored = JSON.parse(localStorage.getItem('tickets-theme') || '{}');
  const theme = stored?.state?.theme || 'light';
  applyTheme(theme);
}
