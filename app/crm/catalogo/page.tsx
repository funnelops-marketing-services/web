'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { usePermissions } from '@/hooks/use-permissions'
import { useAgentConfig } from '@/hooks/use-agent-config'
import { CatalogScreen } from '@/components/crm/catalog/catalog-screen'

export default function CatalogoPage() {
  const router = useRouter()
  const { canManageConfig } = usePermissions()
  const { data: agent, isLoading, isError } = useAgentConfig()

  useEffect(() => {
    if (!canManageConfig) {
      router.replace('/crm')
    }
  }, [canManageConfig, router])

  if (!canManageConfig) return null

  if (isLoading) return <p className="p-8 text-sm text-zinc-500">Cargando agente…</p>
  if (isError || !agent)
    return <p className="p-8 text-sm text-zinc-500">No hay agente configurado para este tenant.</p>

  return <CatalogScreen agentId={agent.id} />
}
