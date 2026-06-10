# Spec — RBAC front: alinear el front con el RBAC de 3 niveles del backend

> **Estado:** aprobada / lista para implementar. Owner: Natalia (web). Depende de: backend RBAC 3 niveles (YA en `main` del server: PR #22 + seed fix #23, head `97cc3e4`). Ref: [docs/FRONTEND_SPEC.md](FRONTEND_SPEC.md), [docs/SPEC_CRM_FRONT.md](SPEC_CRM_FRONT.md) §8, [CLAUDE.md](../CLAUDE.md) (invariante config). Decisiones cerradas 2026-06-09: §4.5 entra en este CR; badge de rol fuera.

## 1. Intent

El backend mergeó el **RBAC de 3 niveles** y cambió el contrato de auth: el rol por-tenant ahora es `client_admin | staff` (ya no `owner/admin/member`), y la capacidad de configurar (agente + users/roles) pasó a una **dimensión global** `is_platform_operator` (= `User.is_superuser`), no a un rol. El front quedó **desalineado**: su enum Zod sigue en `owner/admin/member` → al pegar contra el backend real, `GET /auth/me` devuelve `role: "client_admin"` y el **parse de Zod falla → la sesión no hidrata → `AuthGuard` deja a todos afuera**. Este CR alinea el contrato de auth del front y reescribe el mapeo de permisos al modelo de 3 niveles.

## 2. Estado actual (del relevamiento)

Touchpoints del modelo viejo (`owner/admin/member`, permisos por rol). Inventario completo (grep del repo):

| Archivo | Qué tiene hoy (roto/desalineado) |
|---|---|
| [lib/api/auth.ts](../lib/api/auth.ts) | `tenantUserRoleSchema = z.enum(['owner','admin','member'])` (L30) → **rompe el parse** de `/auth/me`; `authenticatedUserSchema` (L51-55) tiene `role` pero **falta** `is_platform_operator`. `userReadSchema` **ya** trae `is_superuser` (L37) ✅ |
| [store/auth-store.ts](../store/auth-store.ts) | `SessionData`/`AuthState` tipan `role: TenantUserRole`; **no** tienen `is_platform_operator` → `setSession(data: AuthenticatedUser)` daría type error al traer el campo nuevo; `clear` no lo resetea |
| [hooks/use-auth.ts](../hooks/use-auth.ts) | reconstruye `session: AuthenticatedUser` desde el store (L54-55) con `{ user, tenant, role }` — sin `is_platform_operator` |
| [hooks/use-permissions.ts](../hooks/use-permissions.ts) | `CONFIG_ROLES = ['owner','admin']` (L18) — roles inexistentes en el enum nuevo; `canManageConfig = role ∈ CONFIG_ROLES` — **modelo equivocado** (config es global, no por-rol) |
| [app/(auth)/register/page.tsx](../app/(auth)/register/page.tsx) | copy "Tu workspace inicial te asignará como **OWNER**" (≈L101) — rol viejo; register ahora asigna `client_admin` |

Consumidor que **no** cambia: [components/crm/conversation-panel.tsx](../components/crm/conversation-panel.tsx) usa `canOperateCrm` (sigue `true` para cualquier sesión).

## 3. Contrato del backend (REAL — verificado en server `main`)

Fuente: `server/src/server/modules/core/domain/{schemas,models}.py`, `.../services/auth_service.py`.

- `GET /api/v1/auth/me` → `AuthenticatedUser`:
  ```
  { user: UserRead{ id, email, full_name, is_active, is_superuser, created_at, updated_at },
    tenant: TenantRead{ ... },
    role: "client_admin" | "staff",
    is_platform_operator: bool }
  ```
- Enum por-tenant: `TenantUserRole = { CLIENT_ADMIN="client_admin", STAFF="staff" }`. **`platform_operator` NO vive en el enum** — es la dimensión global `is_platform_operator` (derivada de `User.is_superuser`, autoritativa desde DB).
- JWT claims: `{ sub, tenant_id, role, is_superuser }`.
- `register` / `create-tenant` → asignan `client_admin`.
- **`is_platform_operator` es autoritativo desde DB:** aunque el JWT trae `is_superuser`, `AuthenticatedUser.is_platform_operator` lo deriva de `User.is_superuser` consultado en DB en cada `GET /auth/me`. Si se revoca `is_superuser`, la sesión pierde config en el siguiente `/auth/me` sin esperar a que expire el token. El front lo trata como dato del backend (no lo infiere ni lo cachea más allá de `/auth/me`).

**Modelo canónico de capacidades (CLAUDE.md / FRONTEND_SPEC).** Hay **dos dimensiones ortogonales**: el rol por-tenant del enum (`client_admin`/`staff`) y la dimensión **global** `is_platform_operator` (= `is_superuser`), que NO es un rol del enum:
| Dimensión / valor | Quién | Ve/opera CRM (inbox + tablero) | Config agente + ABM users/roles |
|---|---|---|---|
| global `is_platform_operator = true` | Natalia + equipo (p. ej. Chris) | sí | **sí** |
| rol `client_admin` (sin operator) | Mirko | sí | no |
| rol `staff` (sin operator) | equipo de Mirko | sí | no |

## 4. Desglose

Nombre del campo en el front = **`is_platform_operator`** (snake_case, espeja el contrato y el patrón existente del store, que ya nombra `user/tenant/role` igual que la API → `setSession` no necesita mapeo).

1. **`lib/api/auth.ts`** — `tenantUserRoleSchema → z.enum(['client_admin','staff'])`; agregar `is_platform_operator: z.boolean().default(false)` a `authenticatedUserSchema`. Tipos derivados (`TenantUserRole`, `AuthenticatedUser`) se actualizan solos.
2. **`store/auth-store.ts`** — agregar `is_platform_operator: boolean` a `AuthState` **y** a `SessionData` (resuelve el type error de `setSession(data: AuthenticatedUser)`); `setSession` lo setea desde `session.is_platform_operator`; estado inicial y `clear` lo dejan en `false`. Sigue persistiéndose **solo** el token (el resto se re-obtiene vía `/auth/me`).
3. **`hooks/use-auth.ts`** — leer `is_platform_operator` del store; en la reconstrucción de `session` (L54-55) incluir el campo: `{ user, tenant, role, is_platform_operator }`; el `useEffect` que llama `setSession(data)` ya lo propaga al store al hidratar.
4. **`hooks/use-permissions.ts`** — **borrar `CONFIG_ROLES`**. Cambiar la firma `capabilitiesFor(role)` → `capabilitiesFor(session)` (o pasar `isPlatformOperator: boolean`). Mapeo nuevo: `canViewCrm = Boolean(session)`, `canOperateCrm = Boolean(session)`, `canManageConfig = session?.is_platform_operator ?? false`. **Sin** ningún check de literal de rol para config.
5. **(In — confirmado)** — ocultar los ítems de nav `Agentes`/`Ajustes` ([components/layout/Sidebar.tsx](../components/layout/Sidebar.tsx)) cuando `!canManageConfig`, y gatear las rutas stub [app/crm/agents/page.tsx](../app/crm/agents/page.tsx) y [app/crm/settings/page.tsx](../app/crm/settings/page.tsx) (redirect a `/crm` si `!canManageConfig`). Completa el invariante de [CLAUDE.md](../CLAUDE.md) ("config solo `platform_operator`; `client_admin`/`staff` NO la ven").
6. **`app/(auth)/register/page.tsx`** — actualizar el copy del rol viejo ("…como **OWNER**") a la realidad nueva (register asigna `client_admin`; texto p. ej. "administrador de tu workspace").

## 5. Alcance

**In:** alinear enum + schema de auth (§4.1), propagar `is_platform_operator` por store/hook (§4.2-4.3), reescribir `use-permissions` al modelo de 3 niveles (§4.4), gating de nav + rutas de config (§4.5 — confirmado), corregir el copy de `register` (§4.6).

**Out (diferido):**
- **Pantallas reales de config / ABM** (editar agente, crear users/roles): es **M-Config**, aún **no existe en el server** (solo spec) — CR aparte.
- **Badge/visualización del rol** en el Topbar: cosmético, fuera de este CR salvo que se decida en §10.
- No se tocan los contratos del CRM (slice 2) ni el polling-puente.

## 6. Criterios de aceptación (DoD)
- `GET /auth/me` con `role: "client_admin" | "staff"` + `is_platform_operator` **parsea sin error** y la sesión hidrata (sin el parse-break actual). (Verificable con un payload de la estructura §3; ver §8 sobre E2E real.)
- `usePermissions()` → `canManageConfig === session.is_platform_operator`; `canViewCrm`/`canOperateCrm === Boolean(session)`. `CONFIG_ROLES` eliminado; ningún literal de rol decide config.
- Sesión con `is_platform_operator = false` (sea `client_admin` o `staff`): **no** ve el nav `Agentes`/`Ajustes` y al navegar a `/crm/agents` o `/crm/settings` es **redirigida a `/crm`** (con §4.5). Ve y opera el CRM normalmente.
- Sesión con `is_platform_operator = true`: ve el nav de config y las rutas no redirigen. (La validación *positiva* de editar config real se difiere a **M-Config** — acá solo se valida el gate, no hay pantallas de config aún.)
- Sin sesión → `AuthGuard` redirige a `/login` (ya existe; no regresa).
- `npx pnpm build` + `npx pnpm lint` + `npx pnpm tsc --noEmit` verdes; sin `any`/`as`; componentes <200 líneas; UI en español.

## 7. No-funcionales / constraints
- Stack y reglas de [CLAUDE.md](../CLAUDE.md): Next 16, Zod, Zustand, React Query, TS estricto. **No inventar roles que el JWT no trae** (solo `client_admin`/`staff` + dimensión global). `canManageConfig` se deriva de `is_platform_operator`, nunca de un literal de rol.
- `is_platform_operator` es autoritativo desde el backend (no se infiere ni se cachea más allá del `/auth/me`); solo persiste el token.

## 8. Dependencias / bloqueos
- **Backend RBAC:** ✅ en `main` del server (#22/#23). Contrato **fijo y verificado** → este CR está **desbloqueado**.
- **M-Config (server):** ❌ solo spec. Las pantallas de config reales esperan ese módulo; este CR solo corrige el contrato de auth y el gating, no construye config.
- **Pruebas E2E reales:** requieren el backend RBAC corriendo localmente (hoy no garantizado); validar contra la estructura del contrato §3 mientras tanto.

## 9. Riesgos
- Si algún usuario seed/dev quedó con rol viejo en una DB no migrada, `/auth/me` podría devolver un rol fuera del enum nuevo → parse error. La migración `0007` del server ya convierte datos; este CR asume DB migrada.

## 10. Decisiones (cerradas — 2026-06-09)

| # | Decisión | Resultado |
|---|---|---|
| 1 | §4.5 gating de nav + rutas de config en este CR | **Sí** — entra. Barato y completa el invariante CLAUDE.md. |
| 2 | Badge de rol en Topbar | **No** — diferido; cosmético, fuera de este CR. |
