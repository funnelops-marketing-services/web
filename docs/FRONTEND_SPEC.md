# Frontend spec — CRM / Inbox del agente (web)

> Front del CRM que opera el staff de Mirko. **Diseño canónico del agente: repo `server`** (`server/docs/FLUJO_AGENTE.md`, `DESIGN_AGENT_ARCHITECTURE.md`, `SPECS_MVP.md`). Este doc cubre las piezas de **frontend**.
> Stack: Next.js 16 App Router · Tailwind v4 · shadcn · Zustand · React Query · Axios · Zod (ver [CLAUDE.md](../CLAUDE.md)).

## Pantallas (en `/crm`)

1. **Inbox de conversaciones** — lista (contacto, último mensaje, etapa del funnel, **badge 🔥 cuando `handed_off`**) + panel de hilo con burbujas. Reutilizable: burbujas de chat de Firefly-App (`conversation-message.tsx`).
2. **Takeover** — toggle **IA on/off** por conversación (`is_ai_active`). Con IA on, el input se deshabilita; con IA off (humano tomó), el humano escribe por el hilo (envío vía backend → Meta).
3. **Pipeline "Gestión Humana"** (kanban) — los leads derivados (handoff) entran acá. Stages: `Por validar pago → Pago validado → Entrada enviada (Cerrado)` → [Fase 2] `Asistió / No asistió / Lost`. Acción **`/generarEntrada`** (dispara al backend) desde la card al validar el pago.
4. **Config del agente (ABM) — solo `platform_operator` (Natalia + equipo):** editar system prompt (textarea), nivel de emojis (switch mucho/poco/nada), temperatura (slider); guardar crea `agent_version`. **Mirko (`client_admin`) y el staff NO** ven esta pantalla.

## RBAC (front) — 3 niveles

> **Actualizado 2026-06-06** (anula "admin = Mirko"). Modelo canónico: `server/docs/SPECS_MVP.md` §RBAC.

- **`platform_operator`** (Natalia + equipo, p. ej. Chris): ve **todo**, incl. config del agente, crear users/roles, settings.
- **`client_admin`** (Mirko): **solo operación** de su organización — inbox + tablero CRM + sus leads. **NO** config, **NO** users/roles, **NO** edición del agente.
- **`staff`** (la hermana): inbox + pipeline Gestión Humana + takeover. **NO** config.

Guards de ruta + ocultar UI (reusar `use-permissions.ts` de Firefly-App); el backend **revalida** (no confiar solo en el front).

## Realtime

- Mensajes nuevos (entrantes de Meta y respuestas del agente) aparecen sin recargar: el backend publica por **Redis Pub/Sub** → el front escucha por **WebSocket/SSE propio** (NO socket.io de terceros). Hasta integrar, mockear con polling.

## Contratos que consume (del backend — ver `server/docs/SPECS_MVP.md`)

- API de conversaciones/mensajes · toggle `is_ai_active` · `GET/PUT /api/v1/agents/{id}/config` (admin-only) · endpoint que dispara `/generarEntrada`.

## Reglas

- **UI copy en español** (cliente boliviano); código y comentarios en **inglés** (mínimos). Dark mode violeta/fucsia. Componentes <200 líneas.
- **Hasta integrar con el backend:** trabajar contra stubs/mocks de la API, pruebas locales con la estructura correcta. No romper lo existente. Ver `server/docs/SPECS_MVP.md` §"Regla de pruebas".
