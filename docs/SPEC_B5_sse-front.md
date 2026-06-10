# Spec — B5: SSE front (realtime CRM sin polling)

> **Estado:** implementada (PR #11, en main). DoD de runtime validado contra backend Docker el 2026-06-10 (EventSource abierto, `card_moved` push <1s, board re-render sin reload, cleanup del stream verificado en Redis).
> **Owner:** Natalia (web). **Contexto server:** `SPEC_M-CRM-api-2b.md` (implementada en PR #35).
> **Depende de:** `GET /api/v1/crm/events?token=<jwt>` — en main (PR #35).

---

## 1. Intent

Reemplazar el polling REST de React Query por un **EventSource** (SSE) que invalida queries puntualmente. El tablero y el hilo pasan a ser reactivos (actualización en segundos) sin 10s/5s de lag ni tráfico periódico innecesario.

El polling actual vive en:
- `hooks/use-board.ts` → `refetchInterval: POLL_BOARD_MS` (10 s)
- `hooks/use-card.ts` → `refetchInterval: POLL_CARD_MS` (5 s)
- `lib/crm/realtime.ts` → constantes + comentario de swap pendiente

---

## 2. Contrato del servidor (ya en main)

```
GET  /api/v1/crm/events?token=<jwt>
Content-Type: text/event-stream

Eventos:
  data: {"type":"card_moved",       "card_id":"...", "stage":"...", "pipeline_kind":"...", "conversation_id":"..."}
  data: {"type":"handoff",          "conversation_id":"...", "external_id":"...", "reason":"...", "summary":"..."}
  data: {"type":"ai_active_changed","conversation_id":"...", "is_ai_active":true|false}

Heartbeat: `: ping` cada ~15 s (mantiene viva la conexión).
Sin token / token inválido → 401 (corta el stream).
Multi-tenant: el stream solo emite eventos del tenant del token.
```

Auth: `EventSource` del browser **no admite headers custom** → el JWT va en `?token=`. El token está en `useAuthStore((s) => s.token)` (localStorage, clave `mirko-auth`).

---

## 3. Desglose

### 3.1 Nuevos archivos

| Archivo | Qué hace |
|---|---|
| `hooks/use-realtime-events.ts` | Hook que abre/cierra el EventSource y despacha invalidaciones |
| `components/crm/realtime-sync.tsx` | Componente "invisible" que monta el hook; se inyecta en el CRM layout |

### 3.2 `useRealtimeEvents` — lógica

```ts
// Pseudocódigo
function useRealtimeEvents() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!token) return

    const url = `${process.env.NEXT_PUBLIC_API_URL}/crm/events?token=${token}`
    const es = new EventSource(url)

    es.onmessage = (e) => {
      const event = JSON.parse(e.data) as CrmEvent
      handleEvent(event, queryClient)
    }

    es.onerror = () => {
      // El browser reintenta automáticamente (EventSource nativo).
      // No cerrar aquí; dejar que el browser maneje la reconexión.
    }

    return () => es.close()
  }, [token, queryClient])
}
```

**`handleEvent`:**

| `type` | Invalidación |
|---|---|
| `card_moved` | `queryClient.invalidateQueries(boardKeys.all)` |
| `handoff` | `queryClient.invalidateQueries(boardKeys.all)` |
| `ai_active_changed` | `queryClient.invalidateQueries(boardKeys.all)` + si hay `conversation_id`, buscar la card por id en el cache y además invalidar `cardKeys.detail` de esa card (si está en cache). |

Nota: `card_moved` incluye `card_id` → invalidar `cardKeys.detail(card_id)` también.

### 3.3 Schema Zod para eventos

```ts
const crmEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('card_moved'),
    card_id: z.string(), stage: z.string(),
    pipeline_kind: z.string().optional(), conversation_id: z.string().optional() }),
  z.object({ type: z.literal('handoff'),
    conversation_id: z.string(), external_id: z.string(),
    reason: z.string(), summary: z.string() }),
  z.object({ type: z.literal('ai_active_changed'),
    conversation_id: z.string(), is_ai_active: z.boolean() }),
])
type CrmEvent = z.infer<typeof crmEventSchema>
```

Parsear con `crmEventSchema.safeParse(JSON.parse(e.data))`. Si falla el parse (tipo desconocido, heartbeat `: ping`): ignorar silenciosamente.

### 3.4 `RealtimeSync` — componente invisible

```tsx
'use client'
export function RealtimeSync() {
  useRealtimeEvents()
  return null
}
```

Inyectarlo en `app/crm/layout.tsx`:
```tsx
// layout.tsx (server component) puede importar un client component
import { RealtimeSync } from '@/components/crm/realtime-sync'
// ... dentro del JSX del layout:
<RealtimeSync />
```

### 3.5 Ajuste de polling

Cuando SSE está activo, el polling periódico se vuelve redundante. Pero mantenerlo como fallback es conservador para el MVP: si el SSE falla o se desconecta temporalmente, el polling sigue refrescando.

**Decisión MVP:** mantener los `refetchInterval` actuales; el SSE los hace superfluos pero no dañan. Actualizar el comentario en `lib/crm/realtime.ts` para reflejar el cambio de estado.

Si en la práctica el polling genera ruido, se puede eliminar en un commit de seguimiento simplemente poniendo `refetchInterval: false` en `use-board.ts` y `use-card.ts`.

---

## 4. Criterios de aceptación (DoD)

- Abrir el tablero → en las DevTools de Chrome, Network tab, aparece `crm/events` con tipo `eventsource` y status `200 (pending)`.
- Disparar un `POST /crm/cards/{id}/move` desde otro tab → la card se mueve en el tablero **sin recargar**.
- El hilo de una card se actualiza automáticamente al llegar un mensaje nuevo (server → SSE `card_moved` o `ai_active_changed`).
- Cerrar la tab / navegar fuera del CRM → la conexión SSE se cierra (DevTools muestra la fila como completada).
- Sin token (sesión cerrada): el EventSource no se abre.
- `pnpm build && pnpm lint && tsc --noEmit` verdes. Hook y componente <200 líneas.

---

## 5. Dependencias

- No depende de B6 (M-Config front).
- Requiere stack Docker levantado con el server actualizado (PR #35 en main → ya está).
- Para probar: `docker compose up -d`, abrir el CRM, disparar un webhook desde PowerShell y ver el tablero actualizarse.

---

## 6. Notas de implementación

- El `NEXT_PUBLIC_API_URL` en dev es `http://localhost:8000/api/v1`; la URL del EventSource queda `http://localhost:8000/api/v1/crm/events?token=…`.
- `EventSource` solo funciona en el browser → el componente debe ser `'use client'`. El layout del CRM es server component, pero puede importar client components.
- El token cambia solo en logout/login. Si el usuario renueva sesión durante una visita larga, el `useEffect` con `[token]` como dependencia reabre el stream automáticamente.
- El heartbeat `: ping` es una línea de comentario SSE (empieza con `:`), **no** dispara `onmessage`. El browser lo procesa como keep-alive; el front no necesita hacer nada con él.
