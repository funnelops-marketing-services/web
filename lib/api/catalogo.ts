import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// ---------- Enums de negocio (espejo de catalog_schemas.py) ----------

export const serviceCategories = ['formacion', 'produccion', 'edicion', 'general'] as const
export const serviceCurrencies = ['BOB', 'USD'] as const
export const serviceClosings = ['pago_qr', 'handoff_consultivo'] as const

export const categorySchema = z.enum(serviceCategories)
export const currencySchema = z.enum(serviceCurrencies)
export const closingSchema = z.enum(serviceClosings)

// ---------- Schemas (espejo del contrato server Fase 1) ----------

export const assetReadSchema = z.object({
  id: z.string(),
  kind: z.enum(['pdf', 'image']),
  filename: z.string(),
  public_url: z.string(),
  bytes: z.number(),
  created_at: z.string(),
})

export const serviceReadSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  agent_id: z.string(),
  slug: z.string(),
  nombre: z.string(),
  categoria: z.string(),
  resumen: z.string(),
  detalle: z.string().nullable(),
  precio: z.string(),
  moneda: z.string(),
  flujo_cierre: z.string(),
  asset_id: z.string().nullable(),
  asset: assetReadSchema.nullable(),
  orden: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const catalogPublishResultSchema = z.object({
  version_id: z.string(),
  version_number: z.number(),
  services_published: z.number(),
})

// ---------- Tipos derivados ----------

export type AssetRead = z.infer<typeof assetReadSchema>
export type ServiceRead = z.infer<typeof serviceReadSchema>
export type CatalogPublishResult = z.infer<typeof catalogPublishResultSchema>
export type ServiceCategory = (typeof serviceCategories)[number]
export type ServiceCurrency = (typeof serviceCurrencies)[number]
export type ServiceClosing = (typeof serviceClosings)[number]

export interface ServiceCreate {
  slug: string
  nombre: string
  categoria: ServiceCategory
  resumen: string
  detalle?: string | null
  precio: string
  moneda: ServiceCurrency
  flujo_cierre?: ServiceClosing
  asset_id?: string | null
  orden?: number
}

export interface ServiceUpdate {
  nombre?: string
  categoria?: ServiceCategory
  resumen?: string
  detalle?: string | null
  precio?: string
  moneda?: ServiceCurrency
  flujo_cierre?: ServiceClosing
  asset_id?: string | null
  orden?: number
  is_active?: boolean
}

// ---------- Llamadas tipadas ----------

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

export async function publishCatalog(agentId: string): Promise<CatalogPublishResult> {
  const { data } = await apiClient.post(`/agents/${agentId}/catalog/publish`)
  return catalogPublishResultSchema.parse(data)
}
