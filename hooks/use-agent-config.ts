'use client'

import { isAxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  listAgents,
  listModels,
  updateAgent,
  type AgentRead,
  type AgentUpdate,
  type AgentVersionRead,
  type ModelRead,
} from '@/lib/api/agent-config'

export const agentConfigKeys = {
  current: ['agent-config', 'current'] as const,
  models: ['agent-config', 'models'] as const,
}

/** Config del agente del tenant. MVP: un agente por tenant → tomamos el primero. */
export function useAgentConfig() {
  return useQuery<AgentRead | null>({
    queryKey: agentConfigKeys.current,
    queryFn: async () => (await listAgents())[0] ?? null,
  })
}

/** Catálogo de modelos para el dropdown. Estático → no refetchear. */
export function useAgentModels() {
  return useQuery<ModelRead[]>({
    queryKey: agentConfigKeys.models,
    queryFn: listModels,
    staleTime: Infinity,
  })
}

interface FastApiError {
  detail?: string | { msg?: string }[]
}

/** Mensaje legible de un 4xx de FastAPI (string o lista de errores de validación). */
function apiErrorMessage(error: unknown): string | null {
  if (!isAxiosError(error)) return null
  const detail = (error.response?.data as FastApiError | undefined)?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const joined = detail
      .map((item) => item.msg)
      .filter((msg): msg is string => Boolean(msg))
      .join('; ')
    return joined || null
  }
  return null
}

/** PUT del agente → crea versión nueva. Toast con el número; 422 muestra el mensaje del backend. */
export function useUpdateAgentConfig(agentId: string) {
  const queryClient = useQueryClient()

  return useMutation<AgentVersionRead, Error, AgentUpdate>({
    mutationFn: (body) => updateAgent(agentId, body),
    onSuccess: (version) => {
      toast.success(`Versión ${version.version_number} guardada`)
      queryClient.invalidateQueries({ queryKey: agentConfigKeys.current })
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error) ?? 'No se pudo guardar la configuración.')
    },
  })
}
