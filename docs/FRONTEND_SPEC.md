# Frontend spec — CRM / Inbox del agente (web)

> Front del CRM que opera el staff de Mirko. **Diseño canónico del agente: repo `server`** (`server/docs/FLUJO_AGENTE.md`, `DESIGN_AGENT_ARCHITECTURE.md`, `SPECS_MVP.md`). Este doc cubre las piezas de **frontend**.
> Stack: Next.js 16 App Router · Tailwind v4 · shadcn · Zustand · React Query · Axios · Zod (ver [CLAUDE.md](../CLAUDE.md)).

## Pantallas (en `/crm`)

1. **Inbox de conversaciones** — lista (contacto, último mensaje, etapa del funnel, **badge 🔥 cuando `handed_off`**) + panel de hilo con burbujas. Reutilizable: burbujas de chat de Firefly-App (`conversation-message.tsx`).
2. **Takeover** — toggle **IA on/off** por conversación (`is_ai_active`). Con IA on, el input se deshabilita; con IA off (humano tomó), el humano escribe por el hilo (envío vía backend → Meta). El composer además permite **adjuntar imagen/PDF** (clip, drag & drop sobre el hilo, o paste; JPG/PNG/PDF ≤5 MB, el texto acompaña como caption) y **enviar el QR de pago** del sistema con un botón dedicado (#169, server#251).
3. **Pipeline "Gestión Humana"** (kanban) — los leads derivados (handoff) entran acá. Stages: `Por atender → Por validar pago → Pago validado → Entregado → Cerrado` → [Fase 2] `Asistió / No asistió / Lost`. Acción **`/generarEntrada`** (dispara al backend) desde la card al validar el pago; el backend la acepta **solo si el servicio aceptado es presencial** y devuelve el motivo en el `detail` del error si no. Los nombres de stage llegan del backend: el front no compara por string (usa `status_code` para won/lost).
4. **Config del agente (ABM) — solo `platform_operator` (Natalia + equipo):** editar system prompt (textarea), nivel de emojis (switch mucho/poco/nada), temperatura (slider); guardar crea `agent_version`. **Mirko (`client_admin`) y el staff NO** ven esta pantalla.

## RBAC (front) — 3 niveles

> **Actualizado 2026-07-22** (split #126, server #200; anula "admin = Mirko" de 2026-06-06). Modelo canónico: `server/docs/SPECS_MVP.md` §RBAC.

- **`platform_operator`** (Natalia + equipo, p. ej. Chris): ve **todo**, incl. config del agente, users/roles de cualquier tenant, settings.
- **`client_admin`** (Mirko): operación de su organización — inbox + tablero CRM + sus leads + catálogo — **+ gestión de su propio staff** (`/crm/users`: alta/baja/cambio de rol `client_admin`↔`staff`; sin tocar operadores). **NO** config de plataforma, **NO** edición del agente.
- **`staff`** (la hermana): inbox + pipeline Gestión Humana + takeover. **NO** config, **NO** usuarios.

Capacidades en `hooks/use-permissions.ts`: `canManageUsers` (operador ‖ client_admin) **separada** de `canManageConfig` (solo operador). Guardas de UI en la tabla de usuarios (espejo de la matriz backend): fila de operador sin selector de rol y sin acciones para client_admin; fila propia sin cambio de rol ni auto-baja. Guards de ruta + ocultar UI; el backend **revalida** (no confiar solo en el front).

## Realtime

- Mensajes nuevos (entrantes de Meta y respuestas del agente) aparecen sin recargar: el backend publica por **Redis Pub/Sub** → el front escucha por **WebSocket/SSE propio** (NO socket.io de terceros). Hasta integrar, mockear con polling.

## Contratos que consume (del backend — ver `server/docs/SPECS_MVP.md`)

- API de conversaciones/mensajes · toggle `is_ai_active` · `GET/PUT /api/v1/agents/{id}/config` (admin-only) · endpoint que dispara `/generarEntrada`.
- **Entrega post-pago (CR1, web#178 / server#268):** el servicio del catálogo agrega `modality` (`presencial` | `virtual` | `null` = sin entrega) y `price_amount` (monto comparable con el comprobante; `null` = validación manual) · links de entrega por servicio (`GET/POST /services/{id}/links`, `PUT/DELETE /service-links/{id}`, tope 5) · config de pagos por organización (`GET/PUT /crm/payment-settings`: beneficiario esperado + QR propio o global, `client_admin` ‖ `platform_operator`).
- **Avisos de entrega (CR2, web#179 / server#270):** la card trae `flags: string[]` (default `[]`) en `/crm/boards`, `/crm/cards/{id}` y la respuesta de `move`. Son **códigos** (`needs_name`, `delivery_pending`, `extra_receipt`, `no_modality`, `missing_link`, `ambiguous_service`) y el copy en español vive en `components/crm/flag-badges.tsx`; un código desconocido se muestra crudo, nunca rompe el parse. `card_move.moved_by` agrega el literal `'system'` (entrega y cierre automáticos) además de `'agent'` y el uuid del operador.

## Reglas

- **UI copy en español** (cliente boliviano); código y comentarios en **inglés** (mínimos). Dark mode violeta/fucsia. Componentes <200 líneas.
- **Hasta integrar con el backend:** trabajar contra stubs/mocks de la API, pruebas locales con la estructura correcta. No romper lo existente. Ver `server/docs/SPECS_MVP.md` §"Regla de pruebas".
