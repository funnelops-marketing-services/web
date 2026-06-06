import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// ---------- Schemas (espejo del contrato backend M-CRM-api slice 2) ----------
// Los ids llegan como strings opacos; el contrato (SPEC_CRM_FRONT §3) no fija
// formato, así que no asumimos uuid para no romper el parse.

export const threadSenderSchema = z.enum(['lead', 'agent', 'human'])

export const threadMessageSchema = z.object({
  sender: threadSenderSchema,
  text: z.string(),
  at: z.string(),
})

export const cardSchema = z.object({
  id: z.string(),
  title: z.string(),
  conversation_id: z.string(),
  stage_id: z.string(),
})

export const cardDetailSchema = cardSchema.extend({
  thread: z.array(threadMessageSchema),
})

export const stageSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.number(),
  status_code: z.string(),
  cards: z.array(cardSchema),
})

export const pipelineSchema = z.object({
  id: z.string(),
  kind: z.string(),
  name: z.string(),
  position: z.number(),
  stages: z.array(stageSchema),
})

export const boardsSchema = z.object({
  pipelines: z.array(pipelineSchema),
})

export const aiActiveSchema = z.object({
  is_ai_active: z.boolean(),
})

// ---------- Tipos derivados ----------

export type ThreadSender = z.infer<typeof threadSenderSchema>
export type ThreadMessage = z.infer<typeof threadMessageSchema>
export type Card = z.infer<typeof cardSchema>
export type CardDetail = z.infer<typeof cardDetailSchema>
export type Stage = z.infer<typeof stageSchema>
export type Pipeline = z.infer<typeof pipelineSchema>
export type Boards = z.infer<typeof boardsSchema>
export type AiActive = z.infer<typeof aiActiveSchema>

// ---------- Llamadas tipadas ----------

export async function getBoards(): Promise<Boards> {
  const { data } = await apiClient.get('/crm/boards')
  return boardsSchema.parse(data)
}

export async function getCard(cardId: string): Promise<CardDetail> {
  const { data } = await apiClient.get(`/crm/cards/${cardId}`)
  return cardDetailSchema.parse(data)
}

export async function moveCard(cardId: string, stageId: string): Promise<Card> {
  const { data } = await apiClient.post(`/crm/cards/${cardId}/move`, {
    stage_id: stageId,
  })
  return cardSchema.parse(data)
}

export async function setAiActive(
  conversationId: string,
  isAiActive: boolean,
): Promise<AiActive> {
  const { data } = await apiClient.put(
    `/crm/conversations/${conversationId}/ai-active`,
    { is_ai_active: isAiActive },
  )
  return aiActiveSchema.parse(data)
}
