'use client'

import { ChangePasswordForm } from '@/components/crm/account/change-password-form'

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-12 p-8">
      <h1 className="text-2xl font-bold text-white">Ajustes</h1>

      {/* Mi cuenta — disponible para cualquier usuario logueado. */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-white">Mi cuenta</h2>
        <p className="mb-6 text-sm text-zinc-500">Cambiá la contraseña de tu cuenta.</p>
        <ChangePasswordForm />
      </section>
    </div>
  )
}
