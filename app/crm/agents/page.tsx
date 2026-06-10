'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { usePermissions } from '@/hooks/use-permissions'

export default function AgentsPage() {
  const router = useRouter()
  const { canManageConfig } = usePermissions()

  useEffect(() => {
    if (!canManageConfig) {
      router.replace('/crm')
    }
  }, [canManageConfig, router])

  if (!canManageConfig) return null

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-white">Agentes</h1>
      <p className="text-sm text-zinc-500">WIP</p>
    </div>
  )
}
