import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { AuthenticatedUser, TenantRead, TenantUserRole, UserRead } from '@/lib/api/auth'

interface SessionData {
  user: UserRead
  tenant: TenantRead
  role: TenantUserRole
}

interface AuthState {
  token: string | null
  user: UserRead | null
  tenant: TenantRead | null
  role: TenantUserRole | null
  hasHydrated: boolean
  setToken: (token: string) => void
  setSession: (session: SessionData | AuthenticatedUser) => void
  clear: () => void
  _setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      tenant: null,
      role: null,
      hasHydrated: false,
      setToken: (token) => set({ token }),
      setSession: (session) =>
        set({
          user: session.user,
          tenant: session.tenant,
          role: session.role,
        }),
      clear: () => set({ token: null, user: null, tenant: null, role: null }),
      _setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'mirko-auth',
      storage: createJSONStorage(() => localStorage),
      // Sólo persistimos el token; user/tenant/role se re-obtienen vía /auth/me al hidratar.
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true)
      },
    },
  ),
)
