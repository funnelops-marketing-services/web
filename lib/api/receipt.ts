import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// Comprobante de pago leído por visión y decidido por checks determinísticos
// (server#272, CR3). El front no re-decide nada: muestra lo que el backend leyó, el
// resultado de cada check y las dos acciones humanas (validar / validar con nota).

export const NOTE_MAX = 2000

export const VERDICT_PASS = 'pass'

/** `code` es un string libre a propósito: un check nuevo del backend no debe romper el
 *  parse (mismo criterio que los `flags` de la card). El copy corto vive en el front;
 *  `detail` ya viene en español y listo para mostrar. */
export const receiptCheckSchema = z.object({
  code: z.string(),
  passed: z.boolean(),
  detail: z.string(),
})

export const receiptSchema = z.object({
  id: z.string(),
  card_id: z.string(),
  verdict: z.string(), // 'pass' | 'fail'
  checks: z.array(receiptCheckSchema),
  // Lo que el modelo leyó: amount, currency, paid_at, beneficiary, reference, bank.
  // Un campo ilegible llega en `null`, y puede faltar la clave entera.
  extracted: z.record(z.string(), z.string().nullable()),
  image_url: z.string().nullable(),
  human_confirmed_at: z.string().nullable(),
  human_rejected_at: z.string().nullable(),
  human_note: z.string().nullable(),
  created_at: z.string(),
})

/** El GET devuelve 200 con body `null` cuando el lead no mandó comprobante (no un 404),
 *  y las dos acciones responden con el mismo shape nullable. */
export const receiptOrNullSchema = receiptSchema.nullable()

export type ReceiptCheck = z.infer<typeof receiptCheckSchema>
export type Receipt = z.infer<typeof receiptSchema>

export function receiptPassed(receipt: Receipt): boolean {
  return receipt.verdict === VERDICT_PASS
}

export async function getReceipt(cardId: string): Promise<Receipt | null> {
  const { data } = await apiClient.get(`/crm/cards/${cardId}/receipt`)
  return receiptOrNullSchema.parse(data)
}

/** Valida el pago y dispara la entrega en una sola operación. 400 si el comprobante no
 *  pasó los checks: ese caso va por `overrideReceipt`, que exige la nota. */
export async function validateReceipt(cardId: string): Promise<Receipt | null> {
  const { data } = await apiClient.post(`/crm/cards/${cardId}/receipt/validate`)
  return receiptOrNullSchema.parse(data)
}

/** Valida un comprobante con checks en rojo dejando escrito por qué. La nota queda
 *  auditada en el comprobante y como motivo del movimiento de la card. */
export async function overrideReceipt(
  cardId: string,
  note: string,
): Promise<Receipt | null> {
  const { data } = await apiClient.post(`/crm/cards/${cardId}/receipt/override`, { note })
  return receiptOrNullSchema.parse(data)
}
