// Puente realtime (SPEC_CRM_FRONT §4.6 / §8).
//
// Hasta que slice 2b exponga `GET /crm/events` (SSE), no hay push del backend:
// refrescamos con polling de React Query (`refetchInterval`). El board cambia
// poco → intervalo largo; la card abierta es la conversación activa → más corto.
//
// Cuando aterrice el SSE, reemplazar estos intervalos por un `EventSource`
// (`/crm/events?token=…`) que llame a `invalidateQueries` por tipo de evento.

export const POLL_BOARD_MS = 10_000
export const POLL_CARD_MS = 5_000
