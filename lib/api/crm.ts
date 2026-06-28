import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// ---------- Schemas (espejo del contrato backend M-CRM-api slice 2) ----------
// Los ids llegan como strings opacos; el contrato (SPEC_CRM_FRONT §3) no fija
// formato, así que no asumimos uuid para no romper el parse.

export const threadSenderSchema = z.enum(['lead', 'agent', 'human'])

// type: 'text' | 'image' | 'document' — plain string so unknown types
// degrade to the text fallback instead of failing the parse.
export const threadMessageSchema = z.object({
  sender: threadSenderSchema,
  text: z.string(),
  at: z.string(),
  type: z.string().default('text'),
  media_url: z.string().nullable().optional(),
})

export const cardSchema = z.object({
  id: z.string(),
  title: z.string(),
  conversation_id: z.string(),
  stage_id: z.string(),
  phone: z.string(), // external_id (wa_id) de la conversación; habilita búsqueda por número
})

// Un paso del historial de movimientos de la card (traceability del detalle #75/#55).
// stage_from_* es null en el alta de la card (primer move sin origen).
export const cardMoveSchema = z.object({
  stage_from_name: z.string().nullable(),
  stage_from_color: z.string().nullable(),
  stage_to_name: z.string(),
  stage_to_color: z.string().nullable(),
  moved_by: z.string(), // 'agent' | user_id
  moved_at: z.string(),
})

export const cardDetailSchema = cardSchema.extend({
  is_ai_active: z.boolean(),
  thread: z.array(threadMessageSchema),
  moves: z.array(cardMoveSchema), // historial cronológico (asc por moved_at)
})

export const qrEntrySchema = z.object({
  card_id: z.string(),
  token: z.string(),
  qr_ref: z.string(),
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
export type CardMove = z.infer<typeof cardMoveSchema>
export type CardDetail = z.infer<typeof cardDetailSchema>
export type Stage = z.infer<typeof stageSchema>
export type Pipeline = z.infer<typeof pipelineSchema>
export type Boards = z.infer<typeof boardsSchema>
export type AiActive = z.infer<typeof aiActiveSchema>
export type QrEntryOut = z.infer<typeof qrEntrySchema>

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

export async function generateEntry(cardId: string): Promise<QrEntryOut> {
  const { data } = await apiClient.post(`/crm/cards/${cardId}/generate-entry`)
  return qrEntrySchema.parse(data)
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

export async function sendHumanReply(
  cardId: string,
  text: string,
): Promise<ThreadMessage> {
  const { data } = await apiClient.post(`/crm/cards/${cardId}/send`, { text })
  return threadMessageSchema.parse(data)
}
