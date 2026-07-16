import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// ---------- Schema (espejo de ContactOut del server, #101) ----------

export const contactReadSchema = z.object({
  id: z.string(),
  phone: z.string(),
  full_name: z.string().nullable(),
  created_at: z.string(),
})

export type ContactRead = z.infer<typeof contactReadSchema>

export interface ContactCreate {
  phone: string
  full_name?: string | null
}

export interface ContactUpdate {
  full_name?: string | null
}

// ---------- Llamadas tipadas ----------

export async function listContacts(): Promise<ContactRead[]> {
  const { data } = await apiClient.get('/crm/contacts')
  return z.array(contactReadSchema).parse(data)
}

export async function createContact(body: ContactCreate): Promise<ContactRead> {
  const { data } = await apiClient.post('/crm/contacts', body)
  return contactReadSchema.parse(data)
}

export async function getContact(contactId: string): Promise<ContactRead> {
  const { data } = await apiClient.get(`/crm/contacts/${contactId}`)
  return contactReadSchema.parse(data)
}

export async function updateContact(contactId: string, body: ContactUpdate): Promise<ContactRead> {
  const { data } = await apiClient.patch(`/crm/contacts/${contactId}`, body)
  return contactReadSchema.parse(data)
}

export async function deleteContact(contactId: string): Promise<void> {
  await apiClient.delete(`/crm/contacts/${contactId}`)
}

// ---------- Export CSV (#113, BE server#176) ----------

export type ExportRating = 'hot' | 'medium' | 'cold'

export interface ContactsExport {
  blob: Blob
  filename: string
}

/** Baja el CSV de leads: todos, o filtrado por calificación (`cold` = leads fríos). */
export async function exportContacts(rating?: ExportRating): Promise<ContactsExport> {
  const response = await apiClient.get<Blob>('/crm/contacts/export', {
    params: rating ? { rating } : undefined,
    responseType: 'blob',
  })
  const disposition = String(response.headers['content-disposition'] ?? '')
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? 'leads.csv'
  return { blob: response.data, filename }
}
