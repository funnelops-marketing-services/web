### 2026-07-16 · Natalia · crm/contactos — botón de export (#113)
- Qué cambió: menú "Exportar" compartido entre el Embudo de ventas y Contactos (`LeadsExportMenu`, mismo componente en ambos headers) con tres acciones: "Todos los leads", "Solo leads fríos" y "Solo contactos (cerrados)" (`?scope=contacts`). Baja el CSV de `GET /crm/contacts/export` (server#176) y dispara la descarga con el filename del `Content-Disposition`. Nuevos: `exportContacts` en `lib/api/contacts.ts`, `useExportContacts` (toast éxito/error), capacidad `canExportContacts` en `use-permissions`.
- Por qué: issue #113 — Mirko necesita exportar la base de leads (en particular los fríos) para recontacto manual desde el CRM.
- Spec/decisión que respeta: RBAC 3 niveles — export solo client_admin + platform_operator (misma matriz que Catálogo); staff no ve el botón y el endpoint igual responde 403. UI copy en español, dark theme y componentes shadcn existentes.
- Prueba local: `pnpm lint` 0 errores (5 warnings preexistentes), `tsc --noEmit` limpio, `pnpm build` OK. Prueba e2e manual pendiente de mergear server#227 (endpoint).
- Commit: 85a3ca2 — PR #149
