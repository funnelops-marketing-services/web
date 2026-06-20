# SPEC — Visibilidad del lead derivado (handoff) en el CRM

**Estado:** acordado (alcance mínimo) · **Repo:** web · **Branch:** `fix/crm-handed-off-visibility`

## 1. Problema

Tras un handoff, el lead "desaparece" para el staff: la card se mueve del pipeline
**IA** (donde se la veía, p. ej. en "Enganchando") al pipeline **Gestión Humana**, y la
conversación queda `handed_off` + `is_ai_active=false`. El staff no lo atiende.

Diagnóstico (dato seguido DB → API → React Query/SSE → render): **no es un fallo de API
ni de datos.** `GET /crm/boards` devuelve ambos pipelines con la card anidada en su stage,
y el board renderiza ambos como tabs. Son **dos defectos de front que se potencian**:

| # | Defecto | Causa |
|---|---------|-------|
| A | El switch "Agente IA" muestra **on** aunque `is_ai_active=false` post-handoff | `conversation-panel.tsx` siembra `useState(true)` e **ignora `card.is_ai_active`** (que el detalle ya expone). El comentario que decía "el contrato aún no expone is_ai_active" está stale. |
| B | El lead derivado vive en el **segundo tab** ("Gestión Humana"), que no es el default y **no tiene ninguna señal** de que llegó un lead | `crm-board.tsx` activa `pipelines[0]` (= IA) y no muestra contador/badge por tab |

A + B juntos: el staff ve el lead irse del board IA y el switch dice "IA on" → cree que la
IA sigue atendiendo → no cambia de tab → lead sin atender.

## 2. Alcance (mínimo, web-only)

1. **Switch honesto (A):** el toggle "Agente IA" refleja `card.is_ai_active` del server
   (carga inicial + cambios externos vía polling/SSE). Se mantiene el update optimista al
   togglear.
2. **Badge por tab (B):** cada tab de pipeline muestra un contador de cards cuando tiene
   leads. El tab **Gestión Humana** se resalta (acento fucsia) cuando tiene leads, para que
   el staff vea de inmediato que llegó un derivado.

**Fuera de alcance:** notificación/toast en vivo de handoff; inbox/lista de conversaciones
(siguen WIP); cualquier cambio de server (el API ya devuelve lo correcto).

## 3. Cambios

- `components/crm/conversation-panel.tsx` — el Switch lee directo de `card.is_ai_active`
  (server truth); se elimina el estado local que sembraba `true` y el comentario stale.
- `hooks/use-card-mutations.ts` — `useSetAiActive(cardId)` hace update optimista del cache
  del detalle (mismo patrón que `useMoveCard`) + rollback + invalidación. El toggle se siente
  instantáneo y siempre muestra el valor confirmado por el server. Sin cambio de contrato.
- `components/crm/crm-board.tsx` — contador de cards por pipeline + badge en `TabsTrigger`
  (acento para `kind === 'human'` con leads).

## 4. Criterios de aceptación (DoD)

- Abrir una card `handed_off` → el switch "Agente IA" se muestra **OFF** (no "on").
- Togglear el switch → persiste (`PUT ai-active`) y el estado mostrado coincide con el server.
- Con un lead derivado, el tab **"Gestión Humana"** muestra el contador resaltado.
- Sin leads en un pipeline, su tab no muestra badge.
- `npx pnpm lint` / `tsc --noEmit` / `build` verdes; componentes <200 líneas; UI en español.

## 5. No-funcionales

Stack y reglas del repo (TS estricto, sin `any`, `cn()`, dark + acentos violet/fuchsia,
código en inglés / UI en español). Sin cambios de contrato ni de paradigma: extiende la
señal `badge 🔥 cuando handed_off` ya prevista en el paradigma del front.
