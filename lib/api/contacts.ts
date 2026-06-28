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
