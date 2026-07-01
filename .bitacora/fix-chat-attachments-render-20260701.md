### 2026-07-01 · Nova67 · CRM / conversation-message (ventana de chat de la oportunidad)
- Qué cambió: los adjuntos del hilo (imagen/documento) ahora se pueden abrir/descargar desde el chat del CRM. La imagen es una miniatura clickeable que abre el original a tamaño completo; el documento se renderiza como chip con ícono, nombre de archivo (derivado de la URL) y acción de descarga (`download`).
- Por qué: issue web#112 — la ventana de chat no ofrecía forma de abrir/descargar los adjuntos. Contraparte del BE server#175 (que ahora expone también la media saliente que el agente envía al lead).
- Spec/decisión que respeta: FRONTEND_SPEC (Inbox + hilo espejo del CRM); consume `ThreadMessage.type` + `ThreadMessage.media_url` ya definidos en el contrato con el backend (server/docs/SPECS_MVP §M-CRM). Sin cambios de schema: el nombre del documento se deriva de la URL porque los adjuntos inbound de WhatsApp no traen filename amigable.
- Prueba local: `pnpm lint` (0 errores), `pnpm tsc --noEmit` (limpio), `pnpm build` (OK).
- Commit:
