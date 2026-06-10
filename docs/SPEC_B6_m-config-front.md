# Spec — B6: M-Config front (`/crm/agents` + `/crm/settings`)

> **Estado:** implementada (PR #12, en main; `GET /agents` server en PR #46). Smoke e2e contra Docker en el cierre de B6.
> **Owner:** Natalia (web). **Contexto server:** `SPEC_M-Config.md` (implementada en PR #36).
> **Depende de:** server endpoints M-Config (`GET/PUT /agents/{id}`, `GET /users`, `PUT /users/{id}/role`) — todos en main (PR #36) — **más** un nuevo `GET /api/v1/agents` (lista) descrito en §6.

---

## 1. Intent

Construir las dos páginas de config de plataforma, hoy WIP-placeholder:

- `/crm/agents` — editor del agente: system_prompt, modelo, temperature, datos de negocio (ofertas/faq).
- `/crm/settings` — ABM de usuarios/roles del tenant.

Ambas ya están protegidas con `canManageConfig` (`require_platform_operator`). Solo hace falta reemplazar el `<p>WIP</p>` por la UI funcional.

---

## 2. Contratos del backend (ya en main)

### 2.1 Config del agente

```
GET  /api/v1/agents/{id}
  → AgentRead {
      id, organization_id, display_name,
      system_prompt, model, tools: object[],
      config: { ofertas, faq, temperature?, ... },
      is_active,
      current_version: AgentVersionRead | null
    }

PUT  /api/v1/agents/{id}
  Body: AgentUpdate { system_prompt?, model?, config?, change_summary? }
  Reglas: al menos un campo; config.temperature ∈ [0.0, 1.0] si presente;
           config reemplaza el JSON completo (no merge parcial).
  → AgentVersionRead { id, version_number, system_prompt, model, config, change_summary, created_at }
```

### 2.2 Usuarios del tenant

```
GET  /api/v1/users
  → UserWithRoleRead[] {
      id, email, full_name, is_active, is_superuser,
      created_at, updated_at,
      role: 'client_admin' | 'staff'
    }

PUT  /api/v1/users/{user_id}/role
  Body: { role: 'client_admin' | 'staff' }
  → UserWithRoleRead
```

### 2.3 Prerequisito servidor: `GET /api/v1/agents` (lista)

El front necesita descubrir el `agent_id` del tenant actual para llamar `GET /agents/{id}`.
**No existe todavía** en el server — hay que añadir una ruta:

```
GET  /api/v1/agents
  Auth: Bearer (platform_operator)
  → AgentRead[]   (uno por tenant en el MVP)
```

Implementación sugerida (server, mínima): en `config_router.py`, un `@router.get("")` que llame a `AgentConfigService.list_agents(tenant_id)` → `SELECT * FROM agents WHERE organization_id = ?`.

Esto es una adición de ~10 líneas al server; puede ir en el mismo PR de la feature del front o en un PR separado previo. **El front solo puede arrancar cuando esta ruta exista en el stack.**

---

## 3. Desglose

### 3.1 Nuevos archivos

| Archivo | Qué hace |
|---|---|
| `lib/api/agent-config.ts` | Schemas Zod + llamadas tipadas (GET/PUT agent, GET/PUT users) |
| `hooks/use-agent-config.ts` | `useAgentConfig()` — query; `useUpdateAgentConfig()` — mutation |
| `hooks/use-users.ts` | `useUsers()` — query; `useChangeUserRole()` — mutation |
| `app/crm/agents/page.tsx` | Reemplaza el WIP por `<AgentConfigForm />` |
| `app/crm/settings/page.tsx` | Reemplaza el WIP por `<UsersTable />` |
| `components/crm/config/agent-config-form.tsx` | Formulario del agente |
| `components/crm/config/users-table.tsx` | Tabla de usuarios con control de rol |

### 3.2 Schemas Zod (`lib/api/agent-config.ts`)

```ts
const agentVersionReadSchema = z.object({
  id: z.string(),
  version_number: z.number(),
  system_prompt: z.string(),
  model: z.string(),
  config: z.record(z.unknown()),
  change_summary: z.string().nullable(),
  created_at: z.string(),
})

const agentReadSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  system_prompt: z.string(),
  model: z.string(),
  config: z.record(z.unknown()),
  is_active: z.boolean(),
  current_version: agentVersionReadSchema.nullable(),
})

const userWithRoleSchema = z.object({
  id: z.string(),
  email: z.string(),
  full_name: z.string().nullable(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  role: z.enum(['client_admin', 'staff']),
})
```

Funciones:
```ts
async function listAgents(): Promise<AgentRead[]>         // GET /agents
async function getAgent(id: string): Promise<AgentRead>   // GET /agents/{id}
async function updateAgent(id: string, body: AgentUpdate): Promise<AgentVersionRead>
async function listUsers(): Promise<UserWithRole[]>
async function changeUserRole(userId: string, role: 'client_admin' | 'staff'): Promise<UserWithRole>
```

### 3.3 `AgentConfigForm` — campos

| Campo | Input | Fuente en `AgentRead.config` |
|---|---|---|
| **System prompt** | `<textarea>` | `agent.system_prompt` |
| **Modelo** | `<input type="text">` | `agent.model` |
| **Temperatura** | `<input type="number" step="0.01" min="0" max="1">` | `agent.config.temperature` (opcional; si no existe, vacío) |
| **Ofertas** | `<textarea>` (JSON) | `JSON.stringify(agent.config.ofertas, null, 2)` |
| **FAQ** | `<textarea>` (JSON) | `JSON.stringify(agent.config.faq, null, 2)` |
| **Resumen del cambio** | `<input type="text" maxLength={500}>` | vacío (campo nuevo por PUT) |

Al guardar:
- Construir `config` a partir de los valores del form: parsear los textareas JSON; si no parsea → toast de error, no enviar.
- Construir el body `AgentUpdate` con solo los campos que cambiaron.
- En el 200: mostrar toast "Versión {n} guardada" + refrescar la query del agente.
- En el 422 (temperature inválida): mostrar el mensaje del backend.

Estado del form: `useForm` con `defaultValues` del agente cargado; campo `isDirty` para habilitar/deshabilitar el botón "Guardar".

Mostrar el número de versión activa en el header: *"Versión actual: v{current_version.version_number}"* (o "Sin versiones guardadas" si `current_version = null`).

### 3.4 `UsersTable` — columnas

| Columna | Valor |
|---|---|
| Email | `user.email` |
| Nombre | `user.full_name ?? '—'` |
| Rol | Badge: `client_admin` violeta / `staff` zinc. `platform_operator` = `is_superuser=true` → badge ámbar "Operador" (solo lectura, no editable). |
| Acción | `<Select>` con opciones `client_admin` / `staff`; no aparece si `is_superuser=true`. |

Al cambiar el rol:
- `PUT /users/{id}/role` → optimistic update del badge.
- Error: rollback + toast.

---

## 4. Flujo de carga (`/crm/agents`)

1. Montar la página.
2. `useAgentConfig()` llama `listAgents()` → obtiene el primer agente (MVP siempre hay uno).
3. Con ese `id`, llama `getAgent(id)` para tener `current_version` + config completa.
4. Poblar el form.
5. Guardar → `PUT /agents/{id}` → refetch.

(Alternativa simple: fusionar en un único `useAgentConfig()` que llama `listAgents` y toma el primero, sin llamada extra para `getAgent` si la lista ya devuelve `current_version` — depende de si el server incluye `current_version` en la respuesta de la lista.)

---

## 5. Criterios de aceptación (DoD)

- `/crm/agents` visible y funcional para `platform_operator`; `client_admin`/`staff` → redirect a `/crm` (ya implementado por `canManageConfig`).
- Editar system_prompt + temperatura + ofertas/faq y guardar → toast con número de versión; recarga muestra los valores actualizados.
- Temperatura fuera de rango → el server devuelve 422; el form muestra el mensaje de error.
- `/crm/settings` lista los usuarios del tenant con sus roles; cambiar rol → persiste en el servidor.
- `pnpm build && pnpm lint && tsc --noEmit` verdes. Componentes <200 líneas.

---

## 6. Dependencias

- **Prerequisito server:** `GET /api/v1/agents` (lista) — ver §2.3.
- No depende de SSE (B5) ni de ningún otro front pendiente.
- El server ya gatea 403 para no-operadores → el front solo necesita consumir.
