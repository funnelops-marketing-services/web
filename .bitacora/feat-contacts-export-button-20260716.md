### 2026-07-16 · Natalia · crm/contactos — botón de export (#113)
- Qué cambió: menú "Exportar" en la sección Contactos con dos acciones: "Todos los leads" y "Solo leads fríos". Baja el CSV de `GET /crm/contacts/export` (server#176) y dispara la descarga con el filename del `Content-Disposition`. Nuevos: `exportContacts` en `lib/api/contacts.ts`, `useExportContacts` (toast éxito/error), capacidad `canExportContacts` en `use-permissions`, componente `ContactsExportMenu`.
- Por qué: issue #113 — Mirko necesita exportar la base de leads (en particular los fríos) para recontacto manual desde el CRM.
- Spec/decisión que respeta: RBAC 3 niveles — export solo client_admin + platform_operator (misma matriz que Catálogo); staff no ve el botón y el endpoint igual responde 403. UI copy en español, dark theme y componentes shadcn existentes.
- Prueba local: `pnpm lint` 0 errores (5 warnings preexistentes), `tsc --noEmit` limpio, `pnpm build` OK. Prueba e2e manual pendiente de mergear server#227 (endpoint).
- Commit: 85a3ca2 — PR #149
