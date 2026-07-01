### 2026-07-01 · innova67 · crm (board-card / crm-board / lib-api)
- Qué cambió: web#130 — señal "sin responder" en la card del board del CRM. (1)
  `cardSchema` consume los campos nuevos del backend: `is_ai_active` y `awaiting_human`
  (defaults `true`/`false` → degrada sin romper si el backend aún no los expone). (2)
  `board-card.tsx`: chip "IA apagada" (icono BotOff) cuando `!is_ai_active`; cuando
  `awaiting_human`, anillo rosa en la card + badge pulsante "Sin responder · te esperan".
  (3) `crm-board.tsx`: contador rosa de "sin responder" por pestaña de pipeline
  (`awaitingCount`), aplica a cualquier pipeline porque se puede apagar la IA en cualquier
  oportunidad.
- Por qué: al apagar el toggle de IA (takeover) los mensajes del lead seguían llegando pero
  la card no señalizaba nada, así que el staff no se enteraba y el lead quedaba ignorado.
- Spec/decisión que respeta: CLAUDE.md "Inbox + takeover" (toggle `is_ai_active` por
  conversación; badge de estado en la lista). Solo lee `is_ai_active` para la señal, no toca
  el toggle ni agrega realtime nuevo — se actualiza dentro del poll de 10s del board.
  Contraparte backend: funnelops-marketing-services/server#209 (issue server#208).
- Prueba local: `pnpm lint` 0 errores (6 warnings preexistentes ajenos) · `pnpm tsc --noEmit`
  OK · `pnpm build` OK.
- Mejora de flujo: `awaitingCount`/`cardCount`/`filterPipeline` quedan como helpers a nivel de
  módulo (patrón ya existente en el archivo); la función-componente `CrmBoard` se mantiene
  chica. Coherente con el badge fucsia de "Gestión Humana" ya existente.
- Commit:
