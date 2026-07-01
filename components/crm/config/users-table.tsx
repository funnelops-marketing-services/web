'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserCreateDialog } from '@/components/crm/config/user-create-dialog'
import { UserDeleteDialog } from '@/components/crm/config/user-delete-dialog'
import { useAuth } from '@/hooks/use-auth'
import { useUsers } from '@/hooks/use-users'
import type { UserWithRole } from '@/lib/api/agent-config'
import type { TenantUserRole } from '@/lib/api/auth'

const ROLE_META: Record<TenantUserRole, { label: string; className: string }> = {
  client_admin: {
    label: 'Admin',
    className: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  },
  staff: {
    label: 'Staff',
    className: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400',
  },
}

export function UsersTable() {
  const { data: users, isLoading, isError } = useUsers()
  const { session } = useAuth()
  const currentUserId = session?.user.id

  // Alta/baja habilitadas (ABM, #103). La edición de roles sigue fuera hasta el
  // RBAC coherente (sin auto-degradación del superadmin). Ver server #151.
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex justify-end">
        <UserCreateDialog />
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-500">Cargando usuarios…</p>
      ) : isError || !users ? (
        <p className="text-sm text-zinc-500">No se pudieron cargar los usuarios.</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-zinc-500">Sin usuarios en este tenant.</p>
      ) : (
        <div className="rounded-xl border border-white/5 bg-white/[0.02]">
          <Table className="min-w-120">
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-400">Email</TableHead>
                <TableHead className="text-zinc-400">Nombre</TableHead>
                <TableHead className="text-zinc-400">Rol</TableHead>
                <TableHead className="w-16 text-right text-zinc-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} isSelf={user.id === currentUserId} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function UserRow({ user, isSelf }: { user: UserWithRole; isSelf: boolean }) {
  const role = ROLE_META[user.role]

  return (
    <TableRow className="border-white/5 hover:bg-white/[0.02]">
      <TableCell className="text-sm text-white">{user.email}</TableCell>
      <TableCell className="text-sm text-zinc-400">{user.full_name ?? '—'}</TableCell>
      <TableCell>
        {user.is_superuser ? (
          <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">Superadmin</Badge>
        ) : (
          <Badge className={cn('font-medium', role.className)}>{role.label}</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <UserDeleteDialog
          userId={user.id}
          userLabel={user.full_name ?? user.email}
          isSelf={isSelf}
        />
      </TableCell>
    </TableRow>
  )
}
