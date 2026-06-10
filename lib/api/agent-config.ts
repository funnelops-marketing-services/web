import { z } from 'zod'

import { apiClient } from '@/lib/api/client'
import { tenantUserRoleSchema, type TenantUserRole } from '@/lib/api/auth'

// ---------- Schemas (espejo del contrato M-Config server, PR #36 + GET /agents) ----------
// `config` es un JSON abierto (temperature, ofertas, faq, emojis, …); lo tratamos
// como record opaco y resolvemos cada clave en la UI.

export const agentVersionReadSchema = z.object({
  id: z.string(),
  version_number: z.number(),
  system_prompt: z.string(),
  model: z.string(),
  config: z.record(z.unknown()),
  change_summary: z.string().nullable(),
  created_at: z.string(),
})

export const agentReadSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  system_prompt: z.string(),
  model: z.string(),
  config: z.record(z.unknown()),
  is_active: z.boolean(),
  current_version: agentVersionReadSchema.nullable(),
})

export const userWithRoleSchema = z.object({
  id: z.string(),
  email: z.string(),
  full_name: z.string().nullable(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  role: tenantUserRoleSchema,
})

// ---------- Tipos derivados ----------

export type AgentVersionRead = z.infer<typeof agentVersionReadSchema>
export type AgentRead = z.infer<typeof agentReadSchema>
export type UserWithRole = z.infer<typeof userWithRoleSchema>

/** Cambios a aplicar; `config` reemplaza el JSON completo (no merge parcial). */
export interface AgentUpdate {
  system_prompt?: string
  model?: string
  config?: Record<string, unknown>
  change_summary?: string
}

// ---------- Llamadas tipadas ----------

export async function listAgents(): Promise<AgentRead[]> {
  const { data } = await apiClient.get('/agents')
  return z.array(agentReadSchema).parse(data)
}

export async function getAgent(id: string): Promise<AgentRead> {
  const { data } = await apiClient.get(`/agents/${id}`)
  return agentReadSchema.parse(data)
}

export async function updateAgent(
  id: string,
  body: AgentUpdate,
): Promise<AgentVersionRead> {
  const { data } = await apiClient.put(`/agents/${id}`, body)
  return agentVersionReadSchema.parse(data)
}

export async function listUsers(): Promise<UserWithRole[]> {
  const { data } = await apiClient.get('/users')
  return z.array(userWithRoleSchema).parse(data)
}

export async function changeUserRole(
  userId: string,
  role: TenantUserRole,
): Promise<UserWithRole> {
  const { data } = await apiClient.put(`/users/${userId}/role`, { role })
  return userWithRoleSchema.parse(data)
}
