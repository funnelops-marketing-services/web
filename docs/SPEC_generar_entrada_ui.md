# Spec — /generarEntrada UI (web)

> **Estado:** ✅ **implementada** (web PR #6, 2026-06-09) — ver desglose §3 / DoD §5.
> Owner: Natalia (web). Depende de: endpoint `POST /api/v1/crm/cards/{card_id}/generate-entry` ✅ en main (server PR #28).
>
> Piezas: `lib/api/crm.ts` (`generateEntry` + `qrEntrySchema`), `hooks/use-card-mutations.ts` (`useGenerateEntry`), `components/crm/conversation-panel.tsx` (botón condicional en panel de detalle).

## 1. Intent

Agregar un botón en la card de "Pago validado" para que el staff dispare la generación del QR de acceso. El servidor genera el QR, lo envía al lead por WhatsApp y mueve la card a "Entrada enviada" automáticamente.

## 2. Contrato del endpoint (ya en main)

```
POST /api/v1/crm/cards/{card_id}/generate-entry
Auth: Bearer JWT
Body: (vacío)
200: { card_id, token, qr_ref }
400: la card no está en "Pago validado"
404: card no encontrada
```

- **Idempotente:** si ya existe una entry para esa card, devuelve la existente (no falla ni duplica).
- Después del 200, la card se mueve automáticamente a "Entrada enviada" (lo hace el servidor).

## 3. Desglose

### Dónde aparece el botón
En `components/crm/board-card.tsx` o `components/crm/conversation-panel.tsx` — el botón es relevante para el staff cuando revisa la card en el panel de detalle. Se recomienda **en el panel de detalle** (`conversation-panel.tsx`), visible solo cuando:
- `card.stage.name === "Pago validado"` (pipeline human)
- `!card.is_ai_active` (está en takeover humano)

### Comportamiento
1. Staff hace clic en "Generar entrada".
2. Botón se deshabilita + muestra estado de carga.
3. `POST /api/v1/crm/cards/{card_id}/generate-entry`.
4. **200:** invalidar query de la card (React Query) para reflejar el nuevo stage "Entrada enviada". El botón desaparece (la card ya no está en "Pago validado"). Opcional: toast de éxito.
5. **400 (ya existe entry):** silencio o toast informativo "La entrada ya fue generada". No es error crítico.
6. **Otro error:** toast de error, botón vuelve a activo.

### Mutation
Agregar en `hooks/use-card-mutations.ts`:
```ts
useGenerateEntry(cardId): { mutate, isPending }
```
Llama a `POST /api/v1/crm/cards/{cardId}/generate-entry` (sin body). Al éxito, `queryClient.invalidateQueries(['card', cardId])`.

### Contrato en `lib/api/crm.ts`
Agregar función `generateEntry(cardId: string): Promise<QrEntryOut>` con schema Zod `qrEntrySchema = z.object({ card_id: z.string(), token: z.string(), qr_ref: z.string() })`.

## 4. Alcance

**In:** botón en panel de detalle, mutation, schema Zod, invalidación de query.
**Out:** mostrar el QR generado en el front (el servidor lo envía por WhatsApp directamente).

## 5. Criterios de aceptación (DoD)

- Card en "Pago validado": botón visible. Card en cualquier otro stage: botón ausente.
- Click → POST → 200 → card se refresca mostrando "Entrada enviada". Botón desaparece.
- Click doble / entry ya existente → no explota (idempotencia del server).
- `pnpm build && pnpm lint && tsc --noEmit` verdes. Componente <200 líneas. UI en español.

## 6. Dependencias

- `GET /api/v1/crm/cards/{id}` ya expone `stage.name` (verificar en `CardDetailOut`; si no, ajustar a `stage_id` + lookup local de pipelines).
- No depende de SSE ni de M-Config.
