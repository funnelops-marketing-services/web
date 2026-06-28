'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createService,
  deleteService,
  listServices,
  publishCatalog,
  updateService,
  uploadAsset,
  type AssetRead,
  type CatalogPublishResult,
  type ServiceCreate,
  type ServiceRead,
  type ServiceUpdate,
} from '@/lib/api/catalogo'
import { apiErrorMessage } from '@/lib/api/errors'

export const catalogKeys = {
  services: (agentId: string) => ['catalog', 'services', agentId] as const,
}

export function useServices(agentId: string | undefined) {
  return useQuery<ServiceRead[]>({
    queryKey: catalogKeys.services(agentId ?? 'none'),
    queryFn: () => listServices(agentId as string),
    enabled: Boolean(agentId),
  })
}

function fail(error: unknown, fallback: string): void {
  toast.error(apiErrorMessage(error) ?? fallback)
}

export function useCreateService(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation<ServiceRead, Error, ServiceCreate>({
    mutationFn: (body) => createService(agentId, body),
    onSuccess: (service) => {
      toast.success(`Servicio "${service.nombre}" creado`)
      queryClient.invalidateQueries({ queryKey: catalogKeys.services(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo crear el servicio.'),
  })
}

export function useUpdateService(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation<ServiceRead, Error, { serviceId: string; body: ServiceUpdate }>({
    mutationFn: ({ serviceId, body }) => updateService(serviceId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.services(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo actualizar el servicio.'),
  })
}

export function useDeleteService(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (serviceId) => deleteService(serviceId),
    onSuccess: () => {
      toast.success('Servicio eliminado')
      queryClient.invalidateQueries({ queryKey: catalogKeys.services(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo eliminar el servicio.'),
  })
}

export function useUploadAsset() {
  return useMutation<AssetRead, Error, File>({
    mutationFn: (file) => uploadAsset(file),
    onError: (error) => fail(error, 'No se pudo subir el PDF.'),
  })
}

export function usePublishCatalog(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation<CatalogPublishResult, Error, void>({
    mutationFn: () => publishCatalog(agentId),
    onSuccess: (result) => {
      toast.success(
        `Catálogo publicado · versión ${result.version_number} (${result.services_published} servicios)`,
      )
      queryClient.invalidateQueries({ queryKey: catalogKeys.services(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo publicar el catálogo.'),
  })
}
