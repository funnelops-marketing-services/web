# Spec — CRM front: reemplazar el mock del tablero por datos reales

> **Estado:** spec para acordar (no implementada). Owner: Natalia (web). Depende de: backend M-CRM-api slice 2 (en main: `GET /crm/boards`, `GET /crm/cards/{id}`, `POST move`, `PUT ai-active`). Ref: [docs/FRONTEND_SPEC.md](FRONTEND_SPEC.md), [docs/CONTEXT.md](CONTEXT.md).

## 1. Intent

Reemplazar el **mock** del tablero CRM ([`components/crm-pipeline.tsx`](../components/crm-pipeline.tsx), ~300 líneas hardcoded) por **datos reales del backend**, reusando la infra que ya está (Axios + React Query + Zustand auth). Que un operador logueado vea el tablero real, abra una card con el hilo espejo de WhatsApp, mueva cards y togglee el takeover.

## 2. Estado actual (del relevamiento)

- **Mock:** `components/crm-pipeline.tsx` — 3 columnas fake ("Nuevo Lead / Seguimiento / PDF Enviado"), `Lead[]` hardcoded, drag&drop local sin persistencia, toggle IA que no habla con el backend.
- **Infra lista:** `lib/api/client.ts` (Axios, base `NEXT_PUBLIC_API_URL` default `http://localhost:8000/api/v1`, Bearer en interceptor, 401→logout); React Query (`lib/query/provider.tsx`); Zustand `store/auth-store.ts` (token en localStorage `mirko-auth`); `hooks/use-auth.ts` (+ `/auth/me`). Login y `AuthGuard` funcionan.
- **Faltan:** cliente/hooks del CRM, `hooks/use-permissions.ts`, componente de burbuja de mensaje reusable.
- **Deuda (CONTEXT.md):** `crm-pipeline.tsx` renderiza su propio `<header>`+blobs → choca con el layout. **Fix:** quitarlos.

## 3. Contrato del backend (REAL — usar ESTE, no el mock)

Endpoints de slice 2 (todos `Authorization: Bearer`, tenant del token):
- `GET /api/v1/crm/boards` → `{ pipelines: [{ id, kind, name, position, stages: [{ id, name, position, status_code, cards: [{ id, title, conversation_id, stage_id }] }] }] }`
- `GET /api/v1/crm/cards/{id}` → `{ id, title, conversation_id, stage_id, thread: [{ sender: "lead"|"agent"|"human", text, at }] }`
- `POST /api/v1/crm/cards/{id}/move` `{ stage_id }` → `CardOut`
- `PUT /api/v1/crm/conversations/{id}/ai-active` `{ is_ai_active }` → `{ is_ai_active }`
- **(slice 2b, aún no en main):** `GET /crm/events` (SSE realtime), `POST /crm/cards/{id}/generar-entrada`.

**Roles JWT actuales:** `owner | admin | member` (el modelo de 3 niveles del FRONTEND_SPEC —`platform_operator/client_admin/staff`— **todavía no existe** en el backend; ver §8).

## 4. Desglose

1. **`lib/api/crm.ts`** — schemas Zod (Board, Pipeline, Stage, Card, CardDetail, ThreadMessage) + funciones tipadas (`getBoards`, `getCard`, `moveCard`, `setAiActive`).
2. **Hooks** — `hooks/use-board.ts` (`useQuery` boards), `hooks/use-card.ts` (`useQuery` detalle), `hooks/use-card-mutations.ts` (`useMutation` move + ai-active, con `invalidateQueries`).
3. **`hooks/use-permissions.ts`** — mapea `role` (owner/admin/member) a capacidades (ver/operar CRM = todos; config `agents/settings` = owner/admin). Guards de ruta + ocultar UI. (3-tier diferido, §8.)
4. **Tablero real** (`components/crm/…`, refactor del mock):
   - Columnas = `pipelines → stages` del backend (los **2 pipelines reales**: IA + Gestión Humana), no las 3 fake.
   - Cards reales por stage; click → panel de detalle.
   - **Drag** card → `useMoveCard` (`POST move`) → optimistic o invalidate.
   - **Toggle IA** → `useSetAiActive` (`PUT ai-active`).
   - Quitar header/blobs (fix deuda).
5. **Panel de detalle + hilo espejo** — `components/crm/conversation-message.tsx` (burbuja por `sender`: lead/agent/human) + panel que pinta `card.thread` del `GET /cards/{id}`. (Reuse de Firefly-App: `conversation-message.tsx`, `opportunity-conversation-panel.tsx` — a crear/adaptar.)
6. **Realtime puente** — hasta que exista el SSE (slice 2b): `refetchInterval` de React Query (p. ej. 5–10 s) sobre boards/card. Cuando el SSE esté: `EventSource('/crm/events?token=…')` → `invalidateQueries` por tipo de evento. Documentar el puente.

## 5. Alcance

**In:** tablero real (2 pipelines), card + hilo espejo (lectura), mover card (persistido), toggle IA (persistido), `use-permissions`, polling-puente, fix de la deuda visual.

**Out (diferido):**
- **Input de respuesta humana** (enviar mensaje al lead): el campo queda **deshabilitado/visible-solo** — el envío por WhatsApp está bloqueado por M-Meta-inv ([[project-mmeta-standby]]).
- **`generar-entrada` (UI)** y **SSE real**: cuando aterrice slice 2b.
- **RBAC 3 niveles:** se usa el rol actual del JWT; el rename es CR aparte (§8).

## 6. Criterios de aceptación (DoD)
- `/crm` muestra los **2 pipelines reales** con cards reales del backend (no el mock).
- Abrir una card → **hilo espejo real** (lead/agent) del `GET /cards/{id}`.
- **Drag** card entre stages → persiste (`POST move`) y el refetch lo refleja.
- **Toggle IA** → persiste (`PUT ai-active`).
- Sin sesión → `AuthGuard` redirige a `/login` (ya existe).
- `npx pnpm build` (type-check estricto) + `npx pnpm lint` verdes; componentes <200 líneas; UI en español.

## 7. No-funcionales / constraints
- Stack: Next 16 App Router, Tailwind v4, shadcn/ui, Zustand (UI), React Query (server state), Axios, Zod. TS estricto (sin `any`, evitar `as`). Componentes <200 líneas. Código en inglés; UI/copy en español. Dark mode, acentos violet/fuchsia.

## 8. Dependencias / bloqueos
- **Input humano + `generar-entrada` UI** → M-Meta-inv / slice 2b.
- **SSE realtime** → slice 2b (mientras: polling con `refetchInterval`).
- **RBAC 3 niveles:** el FRONTEND_SPEC asume `platform_operator/client_admin/staff`, pero el backend emite `owner/admin/member`. Slice 3 mapea contra los roles reales; alinear los 3 niveles es un CR propio (coordinado con el server). **No inventar roles que el JWT no trae.**

## 9. Decisiones abiertas
1. **Vista de los 2 pipelines:** ¿un solo board con ambos (IA + Gestión Humana) o tabs/secciones separadas? (Firefly = un board por kind.)
2. **Polling interval** del puente realtime (5 s vs 10 s) hasta el SSE.
3. ¿Refactor in-place de `crm-pipeline.tsx` o nuevo árbol `components/crm/` y reemplazo? (Recomiendo nuevo árbol + borrar el mock.)
