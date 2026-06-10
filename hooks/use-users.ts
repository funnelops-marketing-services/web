'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { changeUserRole, listUsers, type UserWithRole } from '@/lib/api/agent-config'
import type { TenantUserRole } from '@/lib/api/auth'

export const userKeys = {
  all: ['users'] as const,
}

/** Usuarios del tenant activo con su rol (platform_operator only). */
export function useUsers() {
  return useQuery<UserWithRole[]>({
    queryKey: userKeys.all,
    queryFn: listUsers,
  })
}

interface RoleArgs {
  userId: string
  role: TenantUserRole
}

interface RoleContext {
  previous?: UserWithRole[]
}

/** Cambia el rol (PUT) con update optimista del badge + rollback ante error. */
export function useChangeUserRole() {
  const queryClient = useQueryClient()

  return useMutation<UserWithRole, Error, RoleArgs, RoleContext>({
    mutationFn: ({ userId, role }) => changeUserRole(userId, role),
    onMutate: async ({ userId, role }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.all })
      const previous = queryClient.getQueryData<UserWithRole[]>(userKeys.all)
      if (previous) {
        queryClient.setQueryData<UserWithRole[]>(
          userKeys.all,
          previous.map((user) => (user.id === userId ? { ...user, role } : user)),
        )
      }
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.all, context.previous)
      }
      toast.error('No se pudo cambiar el rol. Reintentá.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
