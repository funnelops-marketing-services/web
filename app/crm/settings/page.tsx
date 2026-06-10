'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { usePermissions } from '@/hooks/use-permissions'
import { UsersTable } from '@/components/crm/config/users-table'

export default function SettingsPage() {
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
      <h1 className="mb-1 text-2xl font-bold text-white">Ajustes</h1>
      <p className="mb-6 text-sm text-zinc-500">Usuarios y roles de este tenant.</p>
      <UsersTable />
    </div>
  )
}
