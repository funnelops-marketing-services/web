### 2026-07-02 · innova67 · Detalle de oportunidad (identidad del lead)
- Qué cambió: el título del detalle cae al nombre del contacto vinculado (`card.contact.full_name`) cuando la card no tiene nombre propio, antes que al teléfono; el avatar usa esa inicial. Repro: card cerrada de `59169005037` linkeada a "Diego Gandarillas Ferrufino" pero titulada con el número.
- Por qué: contraparte visual del fix de identidad card↔contacto del server (server#222 / PR server#223, que resuelve `title` como `conversation.full_name → contact.full_name → phone` en la API). Este fallback cubre el detalle mientras esa versión llega a prod y ante respuestas cacheadas.
- Spec/decisión que respeta: FRONTEND_SPEC §Pantallas (identidad del lead unificada, #140); sin cambios de contrato (usa `card.contact` que ya viene en `CardDetailOut`).
- Prueba local: `pnpm tsc --noEmit` limpio · `pnpm lint` 0 errores (5 warnings preexistentes) · `pnpm build` ✓ exit 0.
- Commit: 5965088 · PR: https://github.com/funnelops-marketing-services/web/pull/144
