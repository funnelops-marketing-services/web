# Spec — Cambiar contraseña (Mi cuenta) en `/crm/settings`

> **Estado:** en implementación (rama `feat/change-password-ui`). Contra contrato; integración real cuando S2 (endpoint server) esté en prod.
> **Owner:** Natalia (web). **Contraparte server:** S2 (`feat/change-password-endpoint`) — implementa `POST /auth/change-password`.
> **Depende de:** nada para construir (se trabaja contra el contrato §2). El smoke e2e real corre post-merge de S2 a prod.

---

## 1. Intent

Cualquier usuario logueado (operator, client_admin, staff) puede **cambiar su propia
contraseña** desde `/crm/settings`, en una sección separada **"Mi cuenta"**.

Esto **no** es la config de plataforma (usuarios/roles, agente), que sigue siendo
**operador-only**. Cambiar la clave propia es para todos.

---

## 2. Contrato del backend (S2 — se construye contra él)

```
POST /api/v1/auth/change-password
  Auth: Bearer (cualquier usuario autenticado; el server resuelve el user del JWT)
  Body: { current_password: string, new_password: string }   // snake_case (espejo Pydantic)
  Reglas server: new_password min 8, max 128.

  Respuestas:
    204 No Content   → clave cambiada (sin body).
    400 Bad Request  → contraseña actual incorrecta. { detail: string }
    422 Unprocessable→ validación (p. ej. nueva == actual, o no cumple política).
                       { detail: string | [{ msg }] }
```

> El endpoint sigue la convención del `auth_router.py` existente: prefijo `/auth`,
> body snake_case, errores en formato `detail` de FastAPI.

---

## 3. Desglose

### 3.1 Archivos

| Archivo | Qué hace |
|---|---|
| `lib/api/auth.ts` (edit) | `changePasswordRequestSchema` + `changePassword()` |
| `hooks/use-change-password.ts` (new) | `useChangePassword()` mutation + clasificador de error 400/422 |
| `components/crm/account/change-password-form.tsx` (new) | Form react-hook-form + Zod (3 campos) |
| `app/crm/settings/page.tsx` (edit) | "Mi cuenta" para todos + config de plataforma operador-only |
| `components/layout/Sidebar.tsx` (edit) | Link "Ajustes" visible para todo usuario logueado |

### 3.2 API (`lib/api/auth.ts`)

```ts
export const changePasswordRequestSchema = z.object({
  current_password: z.string().min(1, 'Contraseña actual requerida'),
  new_password: z.string().min(8, 'Mínimo 8 caracteres').max(128),
})
export type ChangePasswordPayload = z.infer<typeof changePasswordRequestSchema>

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.post('/auth/change-password', payload)   // 204, sin body
}
```

### 3.3 Form — campos y validación (cliente)

| Campo | Input | Validación Zod |
|---|---|---|
| Contraseña actual | `type="password"` | requerida (min 1) |
| Nueva contraseña | `type="password"` | min 8, max 128 |
| Confirmar nueva | `type="password"` | `== nueva` (`.refine`, error en este campo) |

Sólo `current_password` + `new_password` se envían al server (confirmar es client-only).

### 3.4 Manejo de respuestas

| Resultado | UI |
|---|---|
| 204 | `toast.success('Contraseña actualizada.')` + `reset()` (limpia los 3 campos) |
| 400 | `setError('current_password', …)` con el `detail` del server |
| 422 | `toast.error(detail)` (mensaje de validación del backend) |
| Otro/red | `toast.error('No se pudo cambiar la contraseña.')` |

### 3.5 Ubicación en `/crm/settings`

La página deja de redirigir a no-operadores. Estructura:

1. **Mi cuenta** (`<ChangePasswordForm />`) — siempre visible (cubierto por `AuthGuard` del layout).
2. **Usuarios y roles** (`<UsersTable />`) — sólo si `canManageConfig` (operador).

Sidebar: "Ajustes" deja de requerir `requiresConfig` → visible para todos. (Operador
sigue viendo además "Agentes".)

---

## 4. Criterios de aceptación (DoD)

- `/crm/settings` accesible para cualquier usuario logueado; muestra "Mi cuenta".
- La sección "Usuarios y roles" sólo aparece para `platform_operator`.
- Form valida en cliente: nueva min 8; confirmar == nueva (error en el campo).
- 204 → toast de éxito + form limpio. 400 → error en "contraseña actual". 422 → toast con el mensaje.
- TS estricto sin `any`; componente <200 líneas; `cn()` para clases; copy en español.
- `pnpm lint && tsc --noEmit && build` verdes.

---

## 5. Pruebas

- **Ahora (sin S2):** validación de form (min 8, mismatch de confirmar), estados de
  loading/disabled, render condicional de la sección operador. Lint/tsc/build verdes.
- **Post-S2 en prod:** e2e real — cambiar clave con actual correcta (204), actual
  incorrecta (400 en campo), nueva inválida (422). Ver `server/docs/SPECS_MVP.md` §"Regla de pruebas".
