import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setSession: (data) => set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null }),

      isAuthenticated: () => !!get().accessToken,

      hasPermission: (permiso) => {
        const perms = get().user?.permisos || [];
        return perms.includes('*') || perms.includes(permiso);
      },

      hasRole: (rol) => {
        const roles = get().user?.roles || [];
        return roles.includes(rol);
      },
    }),
    { name: 'tickets-auth' }
  )
);
