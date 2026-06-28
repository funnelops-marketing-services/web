import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// ---------- Enums de negocio (espejo de catalog_schemas.py) ----------

export const serviceCurrencies = ['BOB', 'USD'] as const
export const serviceClosings = ['pago_qr', 'handoff_consultivo'] as const

export const currencySchema = z.enum(serviceCurrencies)
export const closingSchema = z.enum(serviceClosings)

// ---------- Schemas (espejo del contrato server) ----------

export const assetReadSchema = z.object({
  id: z.string(),
  kind: z.enum(['pdf', 'image']),
  filename: z.string(),
  public_url: z.string(),
  bytes: z.number(),
  created_at: z.string(),
})

export const serviceCategoryReadSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  nombre: z.string(),
  orden: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const serviceReadSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  agent_id: z.string(),
  slug: z.string(),
  nombre: z.string(),
  category_id: z.string().nullable(),
  category: serviceCategoryReadSchema.nullable(),
  resumen: z.string(),
  detalle: z.string().nullable(),
  precio: z.string(),
  moneda: z.string(),
  flujo_cierre: z.string(),
  materials: z.array(assetReadSchema),
  orden: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

// ---------- Tipos derivados ----------

export type AssetRead = z.infer<typeof assetReadSchema>
export type ServiceCategoryRead = z.infer<typeof serviceCategoryReadSchema>
export type ServiceRead = z.infer<typeof serviceReadSchema>
export type ServiceCurrency = (typeof serviceCurrencies)[number]
export type ServiceClosing = (typeof serviceClosings)[number]

export interface ServiceCreate {
  slug: string
  nombre: string
  category_id?: string | null
  resumen: string
  detalle?: string | null
  precio: string
  moneda: ServiceCurrency
  flujo_cierre?: ServiceClosing
  asset_ids?: string[]
  orden?: number
}

export interface ServiceUpdate {
  nombre?: string
  category_id?: string | null
  resumen?: string
  detalle?: string | null
  precio?: string
  moneda?: ServiceCurrency
  flujo_cierre?: ServiceClosing
  asset_ids?: string[]
  orden?: number
  is_active?: boolean
}

export interface ServiceCategoryCreate {
  nombre: string
  orden?: number
}

export interface ServiceCategoryUpdate {
  nombre?: string
  orden?: number
}

// ---------- Llamadas tipadas: servicios ----------

export async function listServices(agentId: string): Promise<ServiceRead[]> {
  const { data } = await apiClient.get(`/agents/${agentId}/services`)
  return z.array(serviceReadSchema).parse(data)
}

export async function createService(agentId: string, body: ServiceCreate): Promise<ServiceRead> {
  const { data } = await apiClient.post(`/agents/${agentId}/services`, body)
  return serviceReadSchema.parse(data)
}

export async function updateService(serviceId: string, body: ServiceUpdate): Promise<ServiceRead> {
  const { data } = await apiClient.put(`/services/${serviceId}`, body)
  return serviceReadSchema.parse(data)
}

export async function deleteService(serviceId: string): Promise<void> {
  await apiClient.delete(`/services/${serviceId}`)
}

export async function uploadAsset(file: File): Promise<AssetRead> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post('/assets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return assetReadSchema.parse(data)
}

// ---------- Llamadas tipadas: categorías (#106, org-scoped) ----------

export async function listServiceCategories(): Promise<ServiceCategoryRead[]> {
  const { data } = await apiClient.get('/service-categories')
  return z.array(serviceCategoryReadSchema).parse(data)
}

export async function createServiceCategory(
  body: ServiceCategoryCreate,
): Promise<ServiceCategoryRead> {
  const { data } = await apiClient.post('/service-categories', body)
  return serviceCategoryReadSchema.parse(data)
}

export async function updateServiceCategory(
  categoryId: string,
  body: ServiceCategoryUpdate,
): Promise<ServiceCategoryRead> {
  const { data } = await apiClient.put(`/service-categories/${categoryId}`, body)
  return serviceCategoryReadSchema.parse(data)
}

export async function deleteServiceCategory(categoryId: string): Promise<void> {
  await apiClient.delete(`/service-categories/${categoryId}`)
}
