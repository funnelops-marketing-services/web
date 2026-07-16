### 2026-07-16 · Natalia · crm/contactos — export por contexto + nombre obligatorio
- Qué cambió:
  1. Embudo de ventas: el menú Exportar ya NO muestra "Solo contactos (cerrados)" — solo "Todos los leads" y "Solo leads fríos" (`LeadsExportMenu`).
  2. Contactos: el botón Exportar deja de ser menú y baja directo todos los contactos (`scope=contacts`) en un click (`ContactsExportButton`).
  3. Nombre obligatorio en el ABM: form de alta (`contact-create`) y ficha de edición (`contact-detail`) exigen nombre no vacío para habilitar Guardar/Crear; interfaces `ContactCreate`/`ContactUpdate` con `full_name: string`. Alta desde la oportunidad precarga el nombre ya capturado (`defaultName`).
- Por qué: feedback de Natalia — la opción "cerrados" no aplica al Embudo; en Contactos exportar es siempre "todos" (sin preguntar); y no puede haber un contacto sin nombre. Espeja server#229 (nombre requerido en el schema).
- Spec/decisión que respeta: export #113/server#176 (scope leads|contacts), ABM de contactos #101, identidad de lead #222.
- Prueba local: `pnpm lint` 0 errores (5 warnings preexistentes), `tsc --noEmit` limpio, `pnpm build` OK.
- Commit: 3b18e5d — PR #151
