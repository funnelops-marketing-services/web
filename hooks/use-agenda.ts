'use client'

import { useQuery } from '@tanstack/react-query'

import { listEvents, type EventRead } from '@/lib/api/agenda'
import { isForbidden } from '@/lib/api/errors'

export const agendaKeys = {
  list: ['crm', 'agenda'] as const,
}

/** Eventos de la organización. No se reintenta ante un 403: `GET /crm/agenda` exige
 *  `client_admin`, así que para el `staff` que atiende la puerta el error es definitivo
 *  y la pantalla tiene que explicarlo, no insistir. */
export function useEvents() {
  return useQuery<EventRead[]>({
    queryKey: agendaKeys.list,
    queryFn: () => listEvents(),
    retry: (failureCount, error) => !isForbidden(error) && failureCount < 2,
  })
}
