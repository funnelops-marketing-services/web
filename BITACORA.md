# Bitácora de cambios — web

> Registro de cambios **antes de cada commit** del frontend. Objetivo: que todo cambio esté alineado con [docs/FRONTEND_SPEC.md](docs/FRONTEND_SPEC.md) + [CLAUDE.md](CLAUDE.md) y el diseño canónico del agente (`server/docs/`) — para que ningún dev cambie el paradigma sin que quede explícito y acordado.

## Reglas

1. Antes de commitear, agregá una entrada acá (la más nueva arriba) — o usá `/close`.
2. Todo cambio debe **respetar un spec/decisión existente**. Si toca el paradigma (flujo, RBAC, contratos con el backend): **primero se discute y se actualiza el doc de diseño**, recién después se commitea.
3. Hasta integrar con el backend, las pruebas son **locales** (stubs/mocks) con la estructura correcta.

## Formato de entrada

```
### YYYY-MM-DD · <autor> · <pieza>
- Qué cambió:
- Por qué:
- Spec/decisión que respeta:   (FRONTEND_SPEC / server/docs / CLAUDE.md)
- Prueba local:
- Commit:
```

## Entradas

### 2026-06-10 · Natalia · repo — .gitignore: untrack de `next-env.d.ts`
- Qué cambió: `next-env.d.ts` agregado a `.gitignore` (sección Build artifacts) y desrastreado del repo con `git rm --cached` (el archivo permanece en disco).
- Por qué: aparecía perpetuamente como `M next-env.d.ts` ensuciando working tree y diffs. Next.js lo regenera en cada build/dev (el import alterna entre `./.next/dev/types/routes.d.ts` y `./.next/types/routes.d.ts`) y el propio archivo declara *"should not be edited"*. Omisión del scaffolding inicial — Next.js no lo trackea por defecto.
- Spec/decisión que respeta: housekeeping de repo; no toca paradigma, RBAC, contratos ni código. CLAUDE.md (estructura de proyecto).
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes de shadcn/ui, ajenos) y `pnpm tsc --noEmit` limpio — ambos corridos por el hook `.hooks/pre-commit`. `build` no aplica (el hook no lo corre y el cambio no toca código; `next-env.d.ts` se regenera igual esté trackeado o no). Hecho en worktree aislado desde `main` (install con `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false --ignore-scripts`, ver workaround pnpm v11) para no interferir con la sesión paralela (B5 SSE-front) activa en el checkout compartido.
- Commit: 83007fd84d061981aa053384a4728616f01bc95b

### 2026-06-09 · Natalia · crm — B4 (parte 2): espejo de media en el hilo
- Qué cambió: `lib/api/crm.ts` (`threadMessageSchema` + `type` con default `'text'` y `media_url` nullable/opcional — espejo del contrato server), `components/crm/conversation-message.tsx` (nuevo `MessageContent`: `type === 'image'` → `<img>` nativo con la URL, `type === 'document'` → `<a target="_blank" rel="noreferrer">`, default/tipo desconocido → texto plano como hoy; sin `media_url` → fallback de texto).
- Por qué: el server (PR #37) ya espeja `type`/`media_url` en el hilo de la card; el front mostraba solo el fallback textual `"[image: caption]"`. Cierra la parte web del CR media-espejo.
- Spec/decisión que respeta: `server/docs/SPEC_media_espejo.md` §4 (web) y §5 (DoD web): sin librerías nuevas (`<img>` nativo), fallback a texto para tipos desconocidos o sin URL.
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes shadcn/ui, ajenos); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (11 rutas). E2E con media real pendiente de backend corriendo con `MEDIA_BASE_URL` configurado.
- Commit: 49e5a8548ceb404ee9eb781d77018f9ae1c99d95

### 2026-06-09 · Natalia · crm — B3: input de respuesta humana en el panel
- Qué cambió: `lib/api/crm.ts` (`sendHumanReply(cardId, text)` → `POST /crm/cards/{id}/send`, parse con `threadMessageSchema`), `hooks/use-card-mutations.ts` (`useSendHumanReply(cardId)`: al éxito invalida `cardKeys.detail(cardId)`, error → toast), `components/crm/conversation-panel.tsx` (reemplazado el placeholder deshabilitado por input + botón "Enviar" reales; `<form>` con submit, deshabilitado durante el envío, limpia al éxito; visible solo con `!card.is_ai_active && canOperateCrm`).
- Por qué: el staff no podía responder a un lead desde el front en takeover manual; el endpoint server (PR #31) ya existe, faltaba el input que lo dispara y refresca el hilo.
- Spec/decisión que respeta: `server/docs/SPEC_human_reply.md §4` + handoff B3. `canOperateCrm` cubre "responder" (`use-permissions.ts`). Refresco del hilo por invalidación de query REST (el `useCard` ya poll-ea), sin SSE — coherente con la spec (§7) y con `showGenerateEntry`, que también lee `card.is_ai_active`.
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes en shadcn/ui, ajenos); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (11 rutas). E2E real con backend integrado pendiente de prueba manual.
- Commit: c0fdaad73dd8346d3c6880ca8b7af287fd9f6160

### 2026-06-09 · Natalia · auth — alinear RBAC front con 3 niveles del backend
- Qué cambió: `lib/api/auth.ts` (enum `client_admin/staff` + `is_platform_operator`), `store/auth-store.ts` (campo `is_platform_operator` en `SessionData`/`AuthState`/`setSession`/`clear`), `hooks/use-auth.ts` (propagar `is_platform_operator` en reconstrucción de sesión), `hooks/use-permissions.ts` (borrar `CONFIG_ROLES`; `canManageConfig = is_platform_operator`), `app/(auth)/register/page.tsx` (copy "OWNER" → "administrador"), `components/layout/Sidebar.tsx` (ocultar Agentes/Ajustes si `!canManageConfig`), `app/crm/agents/page.tsx` + `app/crm/settings/page.tsx` (redirect a `/crm` si `!canManageConfig`).
- Por qué: el backend mergeó RBAC 3 niveles (#22/#23); el front quedó con enum viejo `owner/admin/member` → parse de `/auth/me` fallaba → sesión no hidrataba → nadie podía entrar. Este CR alinea el contrato y completa el invariante de gating.
- Spec/decisión que respeta: `docs/SPEC_RBAC_FRONT.md` (aprobada 2026-06-09); `CLAUDE.md` invariante "config solo `platform_operator`"; `server/docs/SPECS_MVP.md` §RBAC.
- Prueba local: `pnpm lint` 0 errores, 4 warnings preexistentes (shadcn/ui — ajenos al cambio); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (11 rutas). E2E real pendiente hasta backend corriendo localmente.
- Commit:

### 2026-06-09 · Natalia · docs — spec RBAC front alineada con RBAC 3 niveles
- Qué cambió: agregar `docs/SPEC_RBAC_FRONT.md` — spec para alinear el contrato de auth del front con el RBAC de 3 niveles del backend (PR #22/#23). Cubre: enum `client_admin/staff`, dimensión global `is_platform_operator`, gating de nav/rutas config, corrección de copy en register.
- Por qué: la spec estaba untracked local; se cierra como PR de docs antes de implementar. Decisiones abiertas resueltas el 2026-06-09: §4.5 entra en el CR (confirma invariante CLAUDE.md); badge de rol fuera.
- Spec/decisión que respeta: `docs/FRONTEND_SPEC.md`; `CLAUDE.md` invariante config; `server/docs/SPECS_MVP.md` §RBAC.
- Prueba local: solo docs — sin lint/tsc/build necesarios.
- Commit: 157b80b

### 2026-06-06 · Natalia · CRM front — tablero real (reemplaza el mock)
- Qué cambió: reemplazo del mock `components/crm-pipeline.tsx` (~300 líneas hardcoded) por el tablero real contra la API M-CRM-api slice 2. Nuevo: `lib/api/crm.ts` (schemas Zod + `getBoards`/`getCard`/`moveCard`/`setAiActive`), `lib/crm/realtime.ts` (constantes de polling-puente), hooks `use-board`/`use-card`/`use-card-mutations`/`use-permissions`, y árbol `components/crm/` (crm-board con tabs por pipeline, pipeline-board, board-column, board-card, conversation-panel con hilo espejo, conversation-message). `app/crm/page.tsx` apunta al nuevo board; mock borrado.
- Por qué: implementar `SPEC_CRM_FRONT.md` — operador logueado ve los 2 pipelines reales, abre la card con el hilo espejo de WhatsApp, mueve cards (persistido) y togglea el takeover IA.
- Spec/decisión que respeta: `docs/SPEC_CRM_FRONT.md` (intent, contrato §3, alcance §5, DoD §6); roles reales `owner/admin/member` (§8, 3-tier diferido — no inventar roles); decisiones abiertas §9 resueltas: tabs por pipeline, polling adaptativo 10s/5s, nuevo árbol + borrar mock.
- Mejora de flujo: realtime por `refetchInterval` (board 10s / card abierta 5s) como **puente** hasta el SSE de slice 2b; al aterrizar el SSE se reemplaza por `EventSource` + `invalidateQueries` (documentado en `lib/crm/realtime.ts`). Sin librerías de realtime de terceros.
- Diferidos (bloqueados, según spec §5/§8): input de respuesta humana visible pero deshabilitado (envío WhatsApp bloqueado por M-Meta-inv); `generar-entrada` UI y SSE real → slice 2b. Gap de contrato registrado: `GET /cards/{id}` no expone `is_ai_active`, así que el toggle persiste vía PUT pero su estado mostrado se siembra "activo" y se actualiza con la respuesta del PUT (reflexión al recargar requiere que el backend exponga el campo).
- Prueba local: `pnpm lint` 0 errores, 4 warnings (todos preexistentes: `ui/carousel`, `ui/sidebar`, `ui/use-mobile`, `hooks/use-mobile`; ninguno en archivos del cambio); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (TypeScript estricto ✓, 11 rutas). Happy-path E2E contra datos reales NO ejecutado: el backend slice 2 no está corriendo/accesible localmente; schemas espejados 1:1 del contrato §3.
- Commit: b131a8b

### 2026-06-06 · Natalia · docs — RBAC 3 niveles (alinear con server)
- Qué cambió: `docs/FRONTEND_SPEC.md` (pantalla 4 ABM + sección RBAC) y `CLAUDE.md` (invariante config) reescritos a **RBAC de 3 niveles**: `platform_operator` (Natalia+equipo, p. ej. Chris) ve config/users/roles/agente; `client_admin` (Mirko) y `staff` solo operan (inbox + CRM). Anula "admin = Mirko".
- Por qué: alinear el front con el cambio ya mergeado/en PR del server (PR #9: SPECS_MVP §RBAC + FLUJO §4); el cliente no es admin de plataforma.
- Spec/decisión que respeta: `server/docs/SPECS_MVP.md` §RBAC (modelo canónico); decisión de negocio (Natalia, 2026-06-06).
- Prueba local: docs-only, ningún `.ts/.tsx` tocado. Pre-commit hook (pnpm lint + tsc) verde: 0 errores (4 warnings preexistentes en shadcn/ui, ajenos al cambio).
- Commit: 447fb80

### 2026-06-05 · Natalia · docs + workflow
- Qué cambió:
  - **Workflow:** `.claude/commands/close.md` — reescrito completo; ahora crea branch, commitea, pushea y abre PR a main con validación de paradigma (RBAC, realtime, takeover, contratos backend) antes de cada paso.
  - **Hooks:** `.hooks/pre-commit` — nuevo; pnpm lint + tsc como guardrail rápido en cada commit local.
  - **Docs (sesión anterior):** alta de `docs/FRONTEND_SPEC.md`, `BITACORA.md`, `CLAUDE.md` actualizado, skill `/close`. Handoff histórico archivado en `docs/archive/`.
- Por qué: versionar el conocimiento en el repo, dejar lista la división de trabajo y establecer el flujo de cierre con branch + PR.
- Spec/decisión que respeta: decisiones 2026-06-05 (CRM en `/crm`, takeover, WebSocket/SSE propio, RBAC admin/staff).
- Prueba local: n/a (docs + config).
- Commit: cabf00f — PR #1
