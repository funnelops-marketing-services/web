'use client'

import { useAuth } from '@/hooks/use-auth'

interface Capabilities {
  /** Ver el tablero/inbox CRM. */
  canViewCrm: boolean
  /** Operar el CRM: mover cards, toggle IA, responder. */
  canOperateCrm: boolean
  /** Configurar agente y crear users/roles (pantallas agents/settings). Solo platform_operator. */
  canManageConfig: boolean
}

/** Mapea la sesión a capacidades; default sin permisos si no hay sesión. */
export function usePermissions(): Capabilities {
  const { session } = useAuth()
  return {
    canViewCrm: session !== null,
    canOperateCrm: session !== null,
    canManageConfig: session?.is_platform_operator ?? false,
  }
}
