'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createOffer,
  deleteOffer,
  listOffers,
  publishCatalog,
  updateOffer,
  uploadAsset,
  type AssetRead,
  type CatalogPublishResult,
  type OfferCreate,
  type OfferRead,
  type OfferUpdate,
} from '@/lib/api/catalogo'
import { apiErrorMessage } from '@/lib/api/errors'

export const catalogKeys = {
  offers: (agentId: string) => ['catalog', 'offers', agentId] as const,
}

export function useOffers(agentId: string | undefined) {
  return useQuery<OfferRead[]>({
    queryKey: catalogKeys.offers(agentId ?? 'none'),
    queryFn: () => listOffers(agentId as string),
    enabled: Boolean(agentId),
  })
}

function fail(error: unknown, fallback: string): void {
  toast.error(apiErrorMessage(error) ?? fallback)
}

export function useCreateOffer(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation<OfferRead, Error, OfferCreate>({
    mutationFn: (body) => createOffer(agentId, body),
    onSuccess: (offer) => {
      toast.success(`Oferta "${offer.nombre}" creada`)
      queryClient.invalidateQueries({ queryKey: catalogKeys.offers(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo crear la oferta.'),
  })
}

export function useUpdateOffer(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation<OfferRead, Error, { offerId: string; body: OfferUpdate }>({
    mutationFn: ({ offerId, body }) => updateOffer(offerId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.offers(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo actualizar la oferta.'),
  })
}

export function useDeleteOffer(agentId: string) {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (offerId) => deleteOffer(offerId),
    onSuccess: () => {
      toast.success('Oferta desactivada')
      queryClient.invalidateQueries({ queryKey: catalogKeys.offers(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo desactivar la oferta.'),
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
        `Catálogo publicado · versión ${result.version_number} (${result.offers_published} ofertas)`,
      )
      queryClient.invalidateQueries({ queryKey: catalogKeys.offers(agentId) })
    },
    onError: (error) => fail(error, 'No se pudo publicar el catálogo.'),
  })
}
