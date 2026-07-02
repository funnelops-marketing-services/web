'use client'

import { useAuth } from '@/hooks/use-auth'

interface Capabilities {
  /** Ver el tablero/inbox CRM. */
  canViewCrm: boolean
  /** Operar el CRM: mover cards, toggle IA, responder. */
  canOperateCrm: boolean
  /** Configurar agente y crear users/roles (pantallas agents/users). Solo platform_operator. */
  canManageConfig: boolean
  /** Administrar el catálogo (servicios/materiales). client_admin + platform_operator. */
  canManageCatalog: boolean
}

/** Mapea la sesión a capacidades; default sin permisos si no hay sesión. */
export function usePermissions(): Capabilities {
  const { session } = useAuth()
  const isPlatformOperator = session?.is_platform_operator ?? false
  return {
    canViewCrm: session !== null,
    canOperateCrm: session !== null,
    canManageConfig: isPlatformOperator,
    canManageCatalog: isPlatformOperator || session?.role === 'client_admin',
  }
}
