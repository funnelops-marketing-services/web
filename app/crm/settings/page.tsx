'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { ChangePasswordForm } from '@/components/crm/account/change-password-form'
import { UsersTable } from '@/components/crm/config/users-table'

export default function SettingsPage() {
  const { canManageConfig } = usePermissions()

  return (
    <div className="space-y-12 p-8">
      <h1 className="text-2xl font-bold text-white">Ajustes</h1>

      {/* Mi cuenta — disponible para cualquier usuario logueado. */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-white">Mi cuenta</h2>
        <p className="mb-6 text-sm text-zinc-500">Cambiá la contraseña de tu cuenta.</p>
        <ChangePasswordForm />
      </section>

      {/* Config de plataforma — solo platform_operator. */}
      {canManageConfig ? (
        <section>
          <h2 className="mb-1 text-lg font-semibold text-white">Usuarios y roles</h2>
          <p className="mb-6 text-sm text-zinc-500">Usuarios y roles de este tenant.</p>
          <UsersTable />
        </section>
      ) : null}
    </div>
  )
}
