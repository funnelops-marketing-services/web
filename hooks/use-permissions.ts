'use client'

import { useAuth } from '@/hooks/use-auth'
import type { TenantUserRole } from '@/lib/api/auth'

interface Capabilities {
  /** Ver el tablero/inbox CRM. */
  canViewCrm: boolean
  /** Operar el CRM: mover cards, toggle IA, responder. */
  canOperateCrm: boolean
  /** Configurar agente y crear users/roles (pantallas agents/settings). */
  canManageConfig: boolean
}

// Roles reales del JWT (owner/admin/member). El RBAC de 3 niveles
// (platform_operator/client_admin/staff) es un CR aparte — SPEC_CRM_FRONT §8.
// No inventar roles que el JWT no trae.
const CONFIG_ROLES: readonly TenantUserRole[] = ['owner', 'admin']

function capabilitiesFor(role: TenantUserRole | null): Capabilities {
  return {
    canViewCrm: role !== null,
    canOperateCrm: role !== null,
    canManageConfig: role !== null && CONFIG_ROLES.includes(role),
  }
}

/** Mapea el rol de la sesión a capacidades; default sin permisos si no hay sesión. */
export function usePermissions(): Capabilities {
  const { session } = useAuth()
  return capabilitiesFor(session?.role ?? null)
}
