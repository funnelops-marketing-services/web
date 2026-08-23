import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// Config de pagos por organización (espejo de payment_schemas.py).
// `payment_qr_url` llega resuelta: si la org no cargó una propia es la global de la
// plataforma, y ahí `is_qr_url_custom` es false.

export const BENEFICIARY_MAX = 120
export const QR_URL_MAX = 500

export const paymentSettingsReadSchema = z.object({
  expected_beneficiary: z.string().nullable(),
  payment_qr_url: z.string(),
  is_qr_url_custom: z.boolean(),
})

export type PaymentSettingsRead = z.infer<typeof paymentSettingsReadSchema>

/** PUT parcial: omitir deja intacto, `null` explícito borra (el QR vuelve al global). */
export interface PaymentSettingsUpdate {
  expected_beneficiary?: string | null
  payment_qr_url?: string | null
}

export async function getPaymentSettings(): Promise<PaymentSettingsRead> {
  const { data } = await apiClient.get('/crm/payment-settings')
  return paymentSettingsReadSchema.parse(data)
}

export async function updatePaymentSettings(
  body: PaymentSettingsUpdate,
): Promise<PaymentSettingsRead> {
  const { data } = await apiClient.put('/crm/payment-settings', body)
  return paymentSettingsReadSchema.parse(data)
}
