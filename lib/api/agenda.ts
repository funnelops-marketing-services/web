import { z } from 'zod'

import { apiClient } from '@/lib/api/client'

// Agenda de eventos (server#276). El escáner de la puerta la usa de una sola forma:
// saber **qué evento se está controlando**, para poder rechazar una entrada de otra
// fecha y para pedir la lista de asistencia.
//
// La ruta es `/crm/agenda` y no `/crm/events` porque esa última ya existe y es el stream
// SSE del CRM (`useRealtimeEvents`).

export const EVENT_STATUS_ACTIVE = 'active'
export const EVENT_STATUS_CLOSED = 'closed'

/** `status` queda como `string` y no como enum, igual que los `flags` de la card: un
 *  estado nuevo del backend no debe romper el parse de la pantalla entera. */
export const eventSchema = z.object({
  id: z.string(),
  service_id: z.string(),
  nombre: z.string(),
  starts_at: z.string(),
  location: z.string().nullable(),
  maps_url: z.string().nullable(),
  capacity: z.number().nullable(),
  status: z.string(),
  issued: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
})

export type EventRead = z.infer<typeof eventSchema>

/** Eventos de la organización, del más próximo al más lejano (los ordena el backend).
 *
 *  Requiere `client_admin` o `platform_operator`: el `staff` recibe **403**. El escáner
 *  lo tolera y sigue funcionando sin evento — ver `components/crm/entries/event-picker`. */
export async function listEvents(): Promise<EventRead[]> {
  const { data } = await apiClient.get('/crm/agenda')
  return z.array(eventSchema).parse(data)
}
