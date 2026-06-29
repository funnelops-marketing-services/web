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

  if (isLoading) return <p className="text-sm text-zinc-500">Cargando usuarios…</p>
  if (isError || !users) return <p className="text-sm text-zinc-500">No se pudieron cargar los usuarios.</p>
  if (users.length === 0) return <p className="text-sm text-zinc-500">Sin usuarios en este tenant.</p>

  // Read-only por ahora: la edición de roles vuelve con el RBAC coherente
  // (sin auto-degradación del superadmin). Ver issue de RBAC.
  return (
    <div className="max-w-3xl rounded-xl border border-white/5 bg-white/[0.02]">
      <Table className="min-w-120">
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-zinc-400">Email</TableHead>
            <TableHead className="text-zinc-400">Nombre</TableHead>
            <TableHead className="text-zinc-400">Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function UserRow({ user }: { user: UserWithRole }) {
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
    </TableRow>
  )
}
