# Bitácora de cambios — web

> Registro de cambios **antes de cada commit** del frontend. Objetivo: que todo cambio esté alineado con [docs/FRONTEND_SPEC.md](docs/FRONTEND_SPEC.md) + [CLAUDE.md](CLAUDE.md) y el diseño canónico del agente (`server/docs/`) — para que ningún dev cambie el paradigma sin que quede explícito y acordado.

## Reglas

1. Antes de commitear, agregá una entrada acá (la más nueva arriba) — o usá `/close`.
2. Todo cambio debe **respetar un spec/decisión existente**. Si toca el paradigma (flujo, RBAC, contratos con el backend): **primero se discute y se actualiza el doc de diseño**, recién después se commitea.
3. Hasta integrar con el backend, las pruebas son **locales** (stubs/mocks) con la estructura correcta.

## Formato de entrada

```
### YYYY-MM-DD · <autor> · <pieza>
- Qué cambió:
- Por qué:
- Spec/decisión que respeta:   (FRONTEND_SPEC / server/docs / CLAUDE.md)
- Prueba local:
- Commit:
```

## Entradas

### 2026-06-28 · Nova · crm/config — form de Agentes: dropdown modelo + slider temp + switch emojis + nombre, sin nodos manuales (#60/#61/#62)
- Qué cambió: rewrite de `agent-config-form.tsx` (misma sección, un PR): **Modelo** = `Select` poblado por `GET /agents/models` (#60, dropdown no editable; si el modelo guardado no está en el catálogo se inyecta como opción para no quedar vacío); **Temperatura** = `Slider` 0–1 step 0.01 con valor en el label (#60); **Emojis** = `Switch` on/off → `config.emojis` bool (#61); **Nombre del agente** = `Input` → `display_name` (server lo acepta ahora); se **quitaron** las textareas de Servicios/FAQ (#62) — vienen del Catálogo y `services` es server-owned. El `config` se reconstruye con spread del `config` cargado (preserva `services` y demás keys) y se quitan del payload `ofertas`/`faq`/`resumen`. `lib/api/agent-config.ts`: `modelReadSchema` + `listModels()` + `AgentUpdate.display_name`. `hooks/use-agent-config.ts`: `useAgentModels()` (staleTime ∞). **Ajustes posteriores (mismo PR, pedido del owner):** (1) se quitó el campo "Resumen del cambio" (`change_summary`) del form — el versionado sigue (cada guardado crea versión, con `change_summary` null); (2) label del modelo GPT-5.4 sin "(producción actual)" (server #144); (3) la versión actual se muestra como **badge** violeta junto al título (antes era subtítulo gris); (4) toast de guardado pasa a la convención **"Cambios guardados."** (antes "Versión N guardada" — el número ya vive en el badge).
- Por qué: el form mostraba modelo como texto libre, temperatura como input numérico, sin switch de emojis, y editaba a mano Servicios/FAQ (que ahora son del Catálogo). El agente además necesitaba un nombre editable.
- Spec/decisión que respeta: issues #60/#61/#62 + decisión del owner (nombre editable; FAQ quirúrgico — no se borra el flujo, solo el nodo manual). Contratos server: `GET /agents/models`, `config.emojis` bool, `AgentUpdate.display_name`.
- Prueba local: `pnpm tsc --noEmit` ✓ · `pnpm lint` ✓ (0 errores; 7 warnings preexistentes) · `pnpm build` ✓. Probado e2e contra backend local (login operador → dropdown poblado, slider, switch, nombre persisten). **Depende de los PRs server** #144 (`/agents/models`), #143 (emojis bool), #145 (descarte nodos + preservar services) y display_name editable: mergear/desplegar antes o el form falla al faltar el endpoint/aceptar display_name.
- Commit: b419ea6

### 2026-06-28 · Nova · crm/catálogo — validación de campos del form de servicios (#64)
- Qué cambió: el form de alta/edición de servicios ([service-editor.tsx](components/crm/catalog/service-editor.tsx)) ahora valida en cliente con react-hook-form (`mode: 'onChange'`): límites por campo (**nombre 30, slug 20, resumen 200, detalle 300** vía `maxLength` nativo + reglas), `precio` solo números con ≤2 decimales y tope `100000`, mensajes inline por campo (`FieldError`) y **botón de guardar deshabilitado mientras `!isValid`**. Refactor de tamaño: se extrajo la config de validación (`LIMITS`/`RULES`), `serviceDefaults` y los helpers presentacionales (`Field`/`FieldError`/`SelectField`) a [service-form.tsx](components/crm/catalog/service-form.tsx) → el componente baja de 288 a 180 líneas (cumple el invariante <200).
- Por qué: #64 — impedir datos inválidos antes de guardar. Mismos límites que la validación server-side (#107) para que el front no choque con el 422 del backend.
- Spec/decisión que respeta: FRONTEND_SPEC (catálogo, ABM de servicios) + SPEC_admin_catalogo_kb §5. Límites espejados con BE #107. Sin tocar contrato de API ni realtime; dark/violeta y copy en español intactos.
- Prueba local: `pnpm lint` ✓ (0 errores; 7 warnings preexistentes ajenos) · `pnpm tsc --noEmit` ✓ · `pnpm build` ✓.
- Commit: ada2da9

### 2026-06-28 · Nova · crm/catálogo — cosméticos: precio+moneda, columnas, responsive, slug, reordenar (#43 #45 #47 #48 #49)
- Qué cambió: 5 ajustes de UI del catálogo (sobre `main`, ya con #86 mergeado). **#49** `service-editor.tsx`: precio y moneda en la misma fila (antes en filas separadas); `catalog-table.tsx` y `service-preview.tsx` muestran `precio · moneda` concatenado. **#45** `service-editor.tsx`: las grillas de 2 columnas apilan en mobile (`grid-cols-1 sm:grid-cols-2`). **#43** `service-editor.tsx`: hint de formato del slug (minúsculas/números/guiones) bajo el input (el placeholder ya era válido, `curso-edicion`). **#47** `catalog-table.tsx`: se quitó el badge "Arrastrá ⠿ para reordenar…" (el grip sigue siendo la affordance). **#48** `catalog-table.tsx`: `table-fixed` + anchos fijos por columna → las columnas alinean entre las tablas de cada categoría.
- Por qué: pulido de UX del catálogo (legibilidad, mobile, consistencia visual) pedido por el cliente.
- Spec/decisión que respeta: issues #43/#45/#47/#48/#49. CLAUDE.md: copy en español, dark violeta, TS estricto, componentes < 200 líneas. Cambios puramente de presentación: no tocan contratos ni lógica.
- Prueba local: `pnpm tsc --noEmit` (0) · `pnpm lint` (0 errores, 7 warnings preexistentes) · `pnpm build` (0).
- Commit: f81cae7

### 2026-06-28 · Nova · landing — rediseño del landing público (portafolio cinematográfico) (#87)
- Qué cambió: reemplazo completo del landing público (`/`) por el port del diseño `Mirko Calzadilla.dc.html` (claude.ai/design) a Next.js + Tailwind v4 + componentes TS. `app/layout.tsx` — fuentes Sora / Instrument Serif / Space Mono vía `next/font`; `app/globals.css` — tokens `--font-display/serif/mono`, keyframes (floatA/B/C, grain, marquee, sweep, pulseRing, revealUp, cineShine, btnSheen) y utilidades (`shine-btn`, `text-gradient`, `reveal-up`). `landing-page.tsx` reescrito como orquestador cliente (root ref + barra de progreso). Nuevos en `components/landing/`: `background-fx`, `site-nav` (+menú móvil), `hero` + `cine-word` (reflejo que sigue al cursor), `showreel` (video con HUD + play real + timecode del video), `marquee` (loop infinito sin huecos), `about`, `process`, `gear`, `work` + `work-gallery` + `media-modal` (galería con popup que cierra al click-afuera/scroll/Esc), `services-section` + `service-cards` + `reserve-link`, `course-section`, `premium-section`, `contact-section`, `site-footer`, `atoms` (Eyebrow/ImageSlot), hook `use-landing-fx` (timecode 24fps, cursor glow, tilt, scroll progress, nav bg, contadores). `data.ts` reescrito con el contenido del diseño (paquetes, planes, curso, equipo, premium, contacto, work items). Assets en `public/landing/` (`mirko.png`, `herramientas.png`, `post1.mp4`, `post3.mp4`, `post2/p1-4.jpg`). Borrados los componentes obsoletos del landing anterior (`hero-section`, `site-header`, `whatsapp-cta`, `package-card`, `video-player`, `icons`).
- Por qué: #87 — elevar la presencia pública a nivel premium/cinematográfico según el diseño canónico importado; el landing anterior era una versión simple del mismo sitio.
- Spec/decisión que respeta: issue #87; diseño `Mirko Calzadilla.dc.html` (claude.ai/design, fuente de verdad de contenido y estética). CLAUDE.md: landing público (no CRM), TS estricto (sin `any`), copy en español, dark violeta/fucsia, componentes < 200 líneas.
- Prueba local: `pnpm lint` (0 errores, 7 warnings preexistentes en `crm/`+`ui/`, ninguno en landing) · `pnpm tsc --noEmit` (limpio) · `pnpm build` ✓ (11 rutas, `/` estática). Verificado visualmente sección por sección durante la iteración.
- Mejora de flujo: la sección "Selección de piezas" usa media propia (videos `post1/post3` + galería `post2`) con popup central en vez de embeds de Instagram (estética coherente con el dark cinematográfico); precedente de versionar video ya existe en `public/portfolio/`.
- Commit: 2917434 — PR #88

### 2026-06-28 · Nova · crm — ABM de categorías del catálogo + dropdown dinámico (#63)
- Qué cambió: contraparte FE de #106. `lib/api/catalogo.ts` — categoría dinámica: nuevo `serviceCategoryReadSchema` + tipos `ServiceCategory{Read,Create,Update}` y llamadas CRUD a `/service-categories`; `serviceReadSchema` cambia `categoria`(string) → `category_id` + `category` anidada; `ServiceCreate/Update` usan `category_id`. Se quitó el enum hardcodeado (`serviceCategories`/`categorySchema`/`CATEGORY_LABELS`/`CATEGORY_ORDER`). `hooks/use-catalogo.ts` — `useServiceCategories` + `useCreate/Update/DeleteServiceCategory` (invalidan categorías y, en rename/delete, también los servicios). Nuevos: `category-manager.tsx` (Dialog ABM: listar / crear / renombrar inline / eliminar con AlertDialog que avisa "los servicios quedan sin categoría") y `category-select.tsx` (dropdown dinámico; centinela `none` = sin categoría). `service-editor.tsx` — el form usa `category_id` (CategorySelect dinámico) en vez del enum; fix copy "Servicio actualizado". `catalog-table.tsx` — agrupa por categoría dinámica (orden de la categoría; "Sin categoría" al final). `catalog-screen.tsx` — botón "Categorías" en la barra.
- Por qué: #63 — el operador administra las categorías (flexibilidad: las 4 actuales pueden cambiar) y asigna `category_id` a cada servicio desde el form. Reemplaza el enum hardcodeado por la tabla administrable del BE.
- Spec/decisión que respeta: issue #63 (depende de server #142, In review — backend-first). Decisión con el cliente (2026-06-28): categorías per-org editables, sin PDF (el material es del servicio), borrar → servicios sin categoría. CLAUDE.md: CRM en `/crm` (config solo `platform_operator` vía la página), TS estricto (sin `any`), copy en español, dark violeta, componentes < 200 líneas.
- Prueba local: `pnpm tsc --noEmit` (0) · `pnpm lint` (0 errores, 7 warnings preexistentes en `use-mobile.ts`) · `pnpm build` (0, `/crm/catalogo` generada). Verificado end-to-end contra el backend de #142 (rama local + `alembic upgrade head` a `0017`).
- Commit: 9daf9b0

### 2026-06-28 · Natalia · crm — convertir el número de la oportunidad en contacto desde el detalle (#84)
- Qué cambió: `lib/api/crm.ts` — `cardDetailSchema` suma `contact` (`{ id, full_name } | null`), espejo del nuevo campo de `CardDetailOut` (server #139); nuevo `cardContactSchema` + tipo `CardContact`. `opportunity-details.tsx` — junto a `card.phone` muestra acción **"Convertir en contacto"** (cualquier stage) que abre el `ContactCreateSheet` reusado con el teléfono precargado; si `card.contact != null` muestra el estado **"Ya es contacto"** (con el nombre) en vez de la acción; tras crear invalida `cardKeys.detail` para refrescar el vínculo. `contact-create.tsx` — `ContactCreateSheet` suma props opcionales `defaultPhone` (precarga al abrir, patrón ajuste-en-render) y `onCreated` (callback post-alta).
- Por qué: el operador veía el número en el detalle pero tenía que ir a Contactos para promoverlo; ahora lo convierte en el lugar, sin duplicar (alta idempotente por phone en el BE).
- Spec/decisión que respeta: issue #84 (depende de server #139, mergeado PR #141); reutiliza `ContactCreateSheet` (no se crea popup nuevo); vínculo leído del campo `contact` del detalle. CLAUDE.md (CRM en `/crm`, TS estricto, copy en español).
- Prueba local: `pnpm lint` (0 errores, 7 warnings preexistentes), `pnpm tsc --noEmit` (0), `pnpm build` (0). Sin backend dev levantado: contrato verificado contra el schema de `CardDetailOut` de server `origin/main`.
- Commit: 9089e77 (PR #85)

### 2026-06-28 · Nova · crm — calificación del lead (badge hot/medium/cold) + resumen IA en el detalle (#53)
- Qué cambió: `lib/api/crm.ts` — `cardSchema` suma `rating` (lo hereda el board y el detalle); `cardDetailSchema` suma `ai_summary`. Nuevo `rating-badge.tsx` (badge reusable: 🔥 Caliente / 🌡 Tibio / 🧊 Frío, `showLabel` opcional, default a frío ante valores desconocidos). `board-card.tsx` muestra el **badge de calificación** (solo ícono) en la cara de la card. `opportunity-details.tsx` (detalle lateral) muestra el badge con label en la fila de badges + nueva sección **"Resumen IA"** (texto de `card.ai_summary` o estado vacío "Sin resumen todavía…").
- Por qué: #53 — el operador ve de un vistazo la temperatura del lead en el tablero (badge) y el resumen del caso por IA al abrir el detalle, sin tener que leer todo el hilo.
- Spec/decisión que respeta: FRONTEND_SPEC §tablero CRM / detalle; CLAUDE.md (CRM en `/crm`, TS estricto, <200 líneas, UI español, dark violeta/fucsia). **Decisión acordada con el cliente** (2026-06-28): badge de rating en la cara de la card; resumen IA en el detalle lateral. Contrato: consume `CardOut.rating` (board) y `CardDetailOut.rating` + `ai_summary` del backend #96 (server PR#130).
- Prueba local: `pnpm tsc --noEmit` ✓ · `pnpm lint` ✓ (0 errores; 7 warnings preexistentes) · `pnpm build` ✓. **Depende del backend #96** (server PR#130, mig `0014`): mergear/desplegar antes que este, o `cardSchema`/`cardDetailSchema` fallarán al faltar `rating`/`ai_summary`.
- Commit: d00b147

### 2026-06-28 · Nova · crm — ABM de oportunidad: alta manual, edición (nombre+notas) y baja (#54)
- Qué cambió: `lib/api/crm.ts` — `cardDetailSchema` suma `full_name`/`notes`; nuevas funciones `createCard`/`updateCard`/`deleteCard` + tipos `CardCreateInput`/`CardUpdateInput`. `hooks/use-card-mutations.ts` — `useCreateCard`/`useUpdateCard`/`useDeleteCard` (toast + invalidación de board/detalle). `crm-board.tsx` — botón **"Nueva oportunidad"** en el header que abre `OpportunityCreateSheet`. Nuevos componentes: `opportunity-create.tsx` (Sheet de alta: teléfono + nombre + notas), `opportunity-edit-form.tsx` (edición inline de nombre + notas), `opportunity-delete-dialog.tsx` (baja con **doble confirmación**: AlertDialog + checkbox "entiendo que es permanente" obligatorio para habilitar el botón). `opportunity-details.tsx` (columna izquierda del popup) ahora muestra **Notas**, botón editar (lápiz) y, al pie, eliminar; `card-detail-dialog.tsx` pasa `onDeleted` (cierra el popup tras borrar).
- Por qué: #54 — el operador necesita crear oportunidades a mano (lead de llamada/referido), corregir el nombre (el de WhatsApp no es confiable, ej. "jesus es mi pastor") y dejar notas ("cliente enojado", "cambió la fecha de la boda"), y eliminar oportunidades de test/duplicadas.
- Spec/decisión que respeta: FRONTEND_SPEC §tablero CRM / detalle; CLAUDE.md (CRM en `/crm` para los 3 roles, TS estricto sin `any`, <200 líneas, UI español, dark violeta/fucsia). **Decisión de paradigma acordada con el cliente** (2026-06-28): crear = alta manual en primer stage con chat vacío; editar = nombre + notas; eliminar = borrado duro con doble confirmación. Contrato: consume `POST/PATCH/DELETE /crm/cards` y `full_name`/`notes` en el detalle (backend #97, server PR#128).
- Prueba local: `pnpm tsc --noEmit` ✓ · `pnpm lint` ✓ (0 errores; 7 warnings preexistentes en use-mobile/shadcn/card-detail-dialog) · `pnpm build` ✓. **Depende del backend #97** (server PR#128, mig `0013_card_notes`): mergear/desplegar antes que este, o `cardDetailSchema` fallará al faltar `full_name`/`notes`.
- Commit: bc9ecf9

### 2026-06-28 · Natalia · crm — sección de Contactos (listar + ficha + ABM) (#58)
- Qué cambió: nueva sección `/crm/contacts` (antes stub WIP). `lib/api/contacts.ts` (schema Zod `ContactRead` espejo de `ContactOut` del server + `listContacts`/`getContact`/`createContact`/`updateContact`/`deleteContact`). `hooks/use-contacts.ts` (React Query: `useContacts` + `useCreateContact`/`useUpdateContact`/`useDeleteContact` con toast e invalidación). Componentes: `contacts-screen.tsx` (lista + búsqueda por nombre/teléfono + estados loading/empty/error + botón "Nuevo contacto"), `contacts-table.tsx` (tabla nombre/teléfono/alta, fila seleccionable), `contact-detail.tsx` (ficha lateral: editar nombre / eliminar), `contact-create.tsx` (Sheet de alta manual: teléfono + nombre). `app/crm/contacts/page.tsx` renderiza `<ContactsScreen/>`. El ítem "Contactos" del sidebar ya existía.
- Por qué: #58 — el operador necesita ver/consultar/administrar los contactos. El alta principal es automática al ganar una oportunidad (hook "won", server #101/#127); esta sección los lista y permite ABM manual (alta idempotente por teléfono, edición de nombre, baja).
- Spec/decisión que respeta: FRONTEND_SPEC §CRM; CLAUDE.md (CRM en `/crm` para los 3 roles, TS estricto sin `any`, <200 líneas, UI español, dark violeta/fucsia, patrón de fetch del catálogo). Contrato: consume `GET/POST/PATCH/DELETE /crm/contacts` y `GET /crm/contacts/{id}` del backend #101 (en main vía #127). Fuera de alcance: historial global de servicios contratados (#99/#56).
- Prueba local: `pnpm lint` ✓ (0 errores; 7 warnings pre-existentes en `use-mobile`) · `pnpm tsc --noEmit` ✓ · `pnpm build` ✓. Smoke e2e contra backend local (#127): alta/listar/editar/baja OK y hook "won" crea el contacto al mover una card a "Cerrado".
- Commit: 709a47c

### 2026-06-27 · Nova · crm — detalle de oportunidad como popup 50/50 con historial de movimientos (#75 Parte B / #55)
- Qué cambió: `crm-board.tsx` reemplaza el panel lateral fijo del 30% (que mostraba solo el chat) por `CardDetailDialog`. Nuevos componentes: `card-detail-dialog.tsx` (popup 50/50 con `Dialog`; en desktop grid 2 columnas, en mobile tabs Detalles/Chat vía `useIsMobile`; cierra con X/overlay/Esc; conserva el último `cardId` durante el cierre para no parpadear), `opportunity-details.tsx` (columna izquierda: nombre, teléfono, badges pipeline/stage + historial), `opportunity-history.tsx` (timeline de `card_move`: de → a, quién, cuándo, con color de stage; estado vacío). `lib/api/crm.ts`: nuevo `cardMoveSchema` + tipo `CardMove`, y `cardDetailSchema` parsea `moves[]`. El board pasa a ancho completo. La derecha reusa `ConversationPanel` sin cambios.
- Por qué: #75 — replicar el detalle de oportunidad de Firefly adaptado a popup 50/50, mostrando datos del lead + historial de movimientos (traceability, #55) junto al chat existente.
- Spec/decisión que respeta: FRONTEND_SPEC §tablero CRM / detalle; CLAUDE.md (CRM en `/crm`, takeover `is_ai_active` intacto, TS estricto, <200 líneas, UI español, dark violeta/fucsia). Contrato: nuevo `CardDetailOut.moves[]` (server, Parte A de #75) — el front ahora **requiere** `moves` en `GET /crm/cards/{id}`.
- Prueba local: `pnpm lint` ✓ (0 errores; 6 warnings preexistentes en `use-mobile`) · `pnpm tsc --noEmit` ✓ · `pnpm build` ✓. Depende de la Parte A backend (expone `moves[]`): mergear/desplegar el PR de `server` antes que este, o el parse de `cardDetailSchema` fallará.
- Commit: c34569b
- Mejora de flujo: el popup es la superficie de detalle donde luego viven editar/eliminar oportunidad (#54) y la calificación/resumen IA (#53), evitando rehacer el panel lateral.

### 2026-06-27 · Nova · crm — buscador por número de teléfono en el tablero de pipelines (#57)
- Qué cambió: `crm-board.tsx` suma un input de búsqueda en el header de "Oportunidades activas" que filtra las cards de los pipelines por **nombre (title) o teléfono (dígitos, coincidencia parcial)** — helpers `cardMatches`/`filterPipeline`/`cardCount` + estado "Sin resultados para tu búsqueda.". `board-card.tsx`: muestra el teléfono en la tarjeta (sin duplicar cuando `title == phone`). `lib/api/crm.ts`: `cardSchema` suma `phone` (lo hereda `cardDetailSchema`), espejo del nuevo `CardOut.phone` del backend.
- Por qué: #57 — el operador necesita encontrar oportunidades por número. El teléfono no llegaba al cliente (`CardOut` no exponía `external_id`); la contraparte server lo agrega como `phone`. La búsqueda es client-side sobre el board ya cargado (no se usa el endpoint server-side que planteaba #100 BE).
- Spec/decisión que respeta: FRONTEND_SPEC §pipeline "Gestión Humana"/tablero CRM (operación de `client_admin` + `staff`); CLAUDE.md (CRM en `/crm`, TS estricto, <200 líneas, UI español, dark violeta/fucsia). Contrato: nuevo `CardOut.phone` (server, re-scope de #100).
- Prueba local: `pnpm lint` ✓ (0 errores; 5 warnings preexistentes en `use-mobile.ts`) · `pnpm tsc --noEmit` ✓ · `pnpm build` ✓.
- Commit: f91d9c3
- Mejora de flujo: el `phone` queda como dato propio (independiente del `title`), de modo que cuando se capture el nombre real del contacto (#119 BE) la búsqueda por número sigue funcionando y la card mostrará nombre + teléfono.

### 2026-06-27 · Natalia · topbar + login — quitar badge de tenant/punto verde (#50) y bordes redondeados en login (#51)
- Qué cambió: `Topbar.tsx` — se elimina el badge de tenant (texto "Mirko" + punto verde animado `bg-emerald-400`) que iba a la izquierda del menú de usuario; se borra también la variable huérfana `tenantName`. `login-page.tsx` — los inputs de email y contraseña pasan del estilo subrayado (`border-0 border-b … rounded-none px-0`) a borde completo redondeado (`border border-zinc-800 rounded-lg px-3`), manteniendo alto, foco violeta y demás estilos.
- Por qué: #50 pide quitar el badge "Mirko" + punto verde de la barra superior derecha; #51 pide inputs con borde redondeado en el login.
- Spec/decisión que respeta: CLAUDE.md — solo cambio visual del CRM bajo `/crm` y del login; no toca paradigma, RBAC, contratos con el backend ni realtime.
- Prueba local: `pnpm tsc --noEmit` ✓ · `pnpm lint` ✓ (0 errores; 5 warnings preexistentes en `use-mobile.ts`) · `pnpm build` ✓.
- Commit: (pendiente)

### 2026-06-27 · Natalia · crm — reestructura del sidebar + quitar breadcrumbs (#38, #39, #40, #41)
- Qué cambió: `Sidebar.tsx` — se quitan los ítems **"Inbox"** (#39) y **"Conversaciones"** (#38) y se agrega **"Embudo de ventas" → `/crm`** como primer ítem del menú, ícono `Funnel` (#41); `isActive` ahora marca `/crm` solo en coincidencia exacta (no en cada `/crm/*`). Se borran las rutas huérfanas `app/crm/conversations/page.tsx` (redirect) y `app/crm/inbox/page.tsx`, más el componente `components/crm/inbox-view.tsx` (sin uso). `Topbar.tsx` — se elimina la barra de breadcrumbs y todo su código muerto (`buildBreadcrumb`, `segmentLabels`, `Crumb`, `usePathname`/`useMemo`/`Link`/`ChevronRight`); queda el badge de tenant + menú de usuario.
- Por qué: simplificar la navegación del CRM. El tablero (kanban de pipelines / "Gestión Humana") pasa a ser el ítem principal "Embudo de ventas". El hilo de conversación + toggle IA (takeover) ya vivían en `conversation-panel.tsx` dentro del tablero, así que quitar las vistas standalone de Inbox/Conversaciones no pierde funcionalidad.
- Spec/decisión que respeta: CLAUDE.md — CRM bajo `/crm` (sin subdominio), "Inbox + takeover" (toggle `is_ai_active` intacto en `conversation-panel.tsx`), pipeline "Gestión Humana" sin cambios, realtime sin cambios. No toca contratos con el backend (el endpoint `/crm/conversations/{id}/ai-active` en `lib/api/crm.ts` se mantiene).
- Prueba local: `pnpm lint` ✓ (0 errores; 5 warnings preexistentes en `use-mobile.ts`) · `pnpm build` ✓ (rutas: `/crm`, `/crm/agents`, `/crm/catalogo`, `/crm/contacts`, `/crm/settings`; ya no aparecen `/crm/inbox` ni `/crm/conversations`) · tsc corre dentro del build ✓.
- Commit: 0e97814 (PR #72)

### 2026-06-27 · Nova · crm — colapsar la columna del panel al cerrar la conversación (#31, mejora)
- Qué cambió: `crm-board.tsx` ahora **renderiza la columna del panel solo cuando hay `selectedCardId`** (envuelto en `{selectedCardId && (…)}`, `key={selectedCardId}`); al cerrar, la columna del 30% desaparece y el tablero recupera el ancho completo. Antes quedaba una columna vacía muerta con EmptyState. `conversation-panel.tsx`: pulido del botón de cierre (`type="button"`, `rounded-lg`). `onClose` sigue opcional (no rompe el reuso en `inbox-view`).
- Por qué: la implementación previa del cierre (PR #21, *quick wins UAT Lote 3*, autora Natalia) dejaba el panel siempre montado: al cerrar, la card se deseleccionaba pero la columna vacía seguía ocupando espacio del kanban. Esta versión colapsa la columna (era el cambio del PR #67, cerrado por basarse en un main viejo; se rehace sobre main actual). Decisión: prevalece esta versión por mejor UX.
- Spec/decisión que respeta: CLAUDE.md — "Inbox + takeover". Supersede el detalle de layout de #31/PR #21 sin cambiar contrato ni paradigma; no toca `is_ai_active`, routing `/crm`, pipeline ni realtime. `inbox-view` intacto (ya colapsaba su propio panel).
- Prueba local: `pnpm lint` ✓ (0 errores; 5 warnings preexistentes) · `pnpm tsc --noEmit` ✓ · `pnpm build` ✓.
- Commit: 13d6c76

### 2026-06-27 · Natalia · lib/validation — helper de validación de inputs (#46)
- Qué cambió: nuevo módulo `lib/validation/` (base que reusan todos los forms). (1) `messages.ts`: mensajes de error en español, fuente única. (2) `fields.ts`: validadores zod reusables — `email`, `phoneBO` (8 dígitos locales `[67]…`), `requiredText(max)`/`optionalText(max)`, `slug` (regex + `SLUG_MAX=20`), `currency` (enum BOB/USD), `priceText` (legacy display) y `priceInput` (numérico > 0), `enumField` factory; sanitizadores que **bloquean el ingreso** del dato no permitido (`digitsOnly`, `sanitizePhoneInput` tope 8, `sanitizeSlugInput`); helpers de display `formatPrice`/`currencySymbol` (concatena precio+moneda) y `normalizePhoneBO` (forma canónica `591…` para `external_id`). (3) `index.ts`: API pública.
- Por qué: centralizar reglas y mensajes hoy duplicados en `lib/api/{auth,catalogo,crm}.ts`. Es la pieza **base** de la Ola 1 (#46): la consumen #54 (ABM), #51 (login), #57 (buscador), #64/#33 y catálogo (Ola 2). El resaltado visual + el mensaje ya los da shadcn (`form.tsx`/`input.tsx`); este helper aporta las reglas zod + sanitizadores.
- Spec/decisión que respeta: **Issue #46** (flujo por issues, sin spec en `docs/`). Convención de consumo (en el comentario del issue + JSDoc del módulo): `useForm({ resolver: zodResolver(schema), mode: 'onChange' })` + shadcn `Form`/`FormField`/`FormMessage`, botón `disabled={!isValid}`, `maxLength` nativo + `sanitize*` en `onChange`. CLAUDE.md: TS estricto sin `any`, archivos <200 líneas, código en inglés / mensajes UI en español. Caveat: precio numérico + moneda separada concatenados al mostrar modela el target de #42; `offer.precio` sigue string en server hasta esa migración (decisión server/negocio, fuera del #46).
- Prueba local: `eslint .` ✓ (0 errores; 5 warnings preexistentes del repo, ninguno en `lib/validation`) · `tsc --noEmit` ✓ · `next build` ✓. Además pruebas de comportamiento headless (compilando el módulo y corriendo casos): email, teléfono 8 dígitos / cap a 8 / 591 rechazado, normalize, requiredText min/max, slug max 20 + sanitize, currency, priceInput >0, formatPrice BOB/USD — todas PASS. El helper aún no se consume en pantalla (es base); su cableado es de los issues que dependen de #46.
- Commit: 70485a2 (PR #69)

### 2026-06-27 · Natalia · config — aprobar build scripts en pnpm-workspace.yaml (allowBuilds)
- Qué cambió: se completó el bloque `allowBuilds` en `pnpm-workspace.yaml` con valores reales `true` para `@sentry/cli`, `sharp` y `unrs-resolver` (antes tenía el placeholder inválido de pnpm v11 `set this to true or false`, solo para `@sentry/cli`). pnpm v10+ bloquea por seguridad los scripts de build/postinstall de dependencias hasta aprobarlos explícitamente; estos tres compilan binarios nativos (`sharp` es la lib de imágenes que usa Next).
- Por qué: con el placeholder, todo comando `pnpm` fallaba con `ERR_PNPM_IGNORED_BUILDS` y obligaba al workaround `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false`. Al aprobar los builds, `pnpm lint/tsc/build/dev` corren sin el workaround. Visto bueno de Natalia.
- Spec/decisión que respeta: CLAUDE.md (pnpm como package manager; pnpm v11 lee config desde pnpm-workspace.yaml). Cambio de config/housekeeping; no toca CRM/takeover/pipeline/config del agente/realtime ni contratos del backend.
- Prueba local: `pnpm lint` ✓ (0 errores, sin el env var de workaround; el `ERR_PNPM_IGNORED_BUILDS` ya no aparece; 4 warnings preexistentes en hooks/use-mobile.ts).
- Commit: d4552cf

### 2026-06-26 · Natalia · crm — pantalla Catálogo (Fase 1, operador)
- Qué cambió: nueva pantalla **Catálogo** en el CRM (`/crm/catalogo`), solo `platform_operator`. (1) `lib/api/catalogo.ts`: schemas Zod + llamadas tipadas (list/create/update/delete offers, upload PDF multipart, publish) espejo del contrato server Fase 1. (2) `lib/api/errors.ts`: `apiErrorMessage` extraído para reuso. (3) `hooks/use-catalogo.ts`: hooks React Query (useOffers, useCreate/Update/DeleteOffer, useUploadAsset, usePublishCatalog) con toasts. (4) `components/crm/catalog/`: `catalog-screen` (header + publicar + nueva oferta), `catalog-table` (lista agrupada por categoría, drag para reordenar dentro de la categoría, toggle activa, editar/desactivar), `offer-editor` (Sheet lateral con form rhf + subir/reemplazar PDF + vista previa en vivo), `offer-preview` (cómo lo ve el lead), `labels`. (5) `app/crm/catalogo/page.tsx`: gate por `canManageConfig` + carga del agente. (6) `Sidebar.tsx`: ítem "Catálogo" (requiresConfig).
- Por qué: la data del catálogo del bot la maneja negocio desde una UI (no JSON ni deploy), con versionado al publicar. Es el front de la Fase 1 (SPEC_admin_catalogo_kb §6); el backend (offer/asset + CRUD + upload + publish) se mergeó en server PR #63.
- Spec/decisión que respeta: `server/docs/SPEC_admin_catalogo_kb.md` §6 (UI operador: lista por categoría, editor, orden, toggle, subir PDF, preview, publicar) + §8 (RBAC platform_operator). Convenciones front (CLAUDE.md): TS estricto sin `any`, componentes <200 líneas, `cn()`, dark violeta, UI en español, reusa axios+Zod+React Query+shadcn como el editor del agente. Caveat: `Publicar` queda funcional pero el bot consume el snapshot en Fase 2 (banner de aviso en la pantalla). Historial/revertir difiere a endpoints server no incluidos en Fase 1 (follow-up).
- Prueba local: `pnpm lint` ✓ (0 errores; warnings preexistentes del repo + 1 benigno de React Compiler por `watch()` de rhf) · `pnpm tsc --noEmit` ✓ · `pnpm build` ✓ (ruta `/crm/catalogo` generada). Repro en vivo (contra backend + browser) = UAT humana pendiente; build-verificado.
- Commit: de07ea3

### 2026-06-25 · Natalia · crm — Inbox/Conversaciones mínimo (UAT Lote 4)
- Qué cambió: (1) `components/crm/inbox-view.tsx` (nuevo): vista de **lista de conversaciones** buscable (por nombre/número) construida aplanando los pipelines de `useBoard()`; cada fila muestra avatar+título+stage y un **badge "Derivado" 🔥** si la card está en el pipeline humano (mismo criterio que el tablero); al hacer click abre el `ConversationPanel` reutilizado (hilo + toggle IA + input humano) en panel lateral, con su botón cerrar. (2) `app/crm/inbox/page.tsx`: renderiza `InboxView` (era stub "WIP"). (3) `app/crm/conversations/page.tsx`: `redirect('/crm/inbox')` (era stub "WIP") — ambos items de nav convergen en la vista que funciona.
- Por qué: en la UAT, Inbox y Conversaciones eran stubs de 8 líneas → el tester no encontró su conversación (C1) ni pudo leer el hilo / probar IA on-off (C2-C4, E1-E3), aunque el hilo+toggle ya vivían en el panel del tablero. Esta vista da un "hogar" explícito a las conversaciones.
- Spec/decisión que respeta: `server/docs/SPEC_UAT_remediation.md` Lote 4 — **versión mínima** (lista que abre el panel), la recomendada para desbloquear; la "completa" (Inbox dedicado con búsqueda server-side + realtime + filtros) queda diferida. Reusa data (`useBoard`) y componentes existentes; sin cambio de contrato ni de paradigma. La lista no trae `is_ai_active`/`thread` (sólo el detalle del board), por eso el estado "derivado" se deduce del pipeline humano.
- Prueba local: `tsc --noEmit` ✓ (binario directo) · `eslint` ✓ (sin salida) sobre los 3 archivos · pre-commit hook (lint+tsc+build). Repro en vivo no corrido (sin backend dev). Polling de `useBoard` como fuente; el realtime del Inbox dedicado queda para la versión completa.
- Commit:

### 2026-06-25 · Natalia · crm — quick wins UAT Lote 3 (Mi cuenta, cerrar panel, refresh toggle)
- Qué cambió: (1) `components/layout/Topbar.tsx`: el item "Mi cuenta" del menú de usuario era un `DropdownMenuItem` **sin `onSelect`** (muerto) → ahora `router.push('/crm/settings')` (F1-F5). (2) `components/crm/conversation-panel.tsx`: nuevo prop opcional `onClose` + botón **X** en el header del panel; `crm-board.tsx` lo mapea a `setSelectedCardId(null)` para liberar el dashboard (New#2). (3) `hooks/use-realtime-events.ts`: el evento `handoff` ahora también invalida `cardKeys.detail` de la card abierta (vía `findCardIdByConversation`, igual que `ai_active_changed`) → el toggle "Agente IA" refleja `is_ai_active=false` tras un handoff sin reload (New#1a).
- Por qué: gaps de la UAT 2026-06-20 — F1-F5 ("no puedo entrar a mi cuenta": el item no navegaba; la pantalla ya existía en `/crm/settings`), New#2 (el panel de chat no se cerraba y tapaba el tablero), New#1a (tras handoff el check IA seguía mostrándose "on" hasta recargar).
- Spec/decisión que respeta: `server/docs/SPEC_UAT_remediation.md` Lote 3 (3.1/3.2/3.3). Sin cambio de contrato ni de paradigma; extiende el patrón de invalidación ya usado en `ai_active_changed`.
- Prueba local: `tsc --noEmit` ✓ (binario directo), `eslint` ✓ (sin salida) sobre los 4 archivos. Build completo = gate del CI del PR. Repro en vivo (handoff/realtime) no corrido: sin backend dev levantado. (`npx pnpm <tool>` sigue fallando por el bug pnpm v11; se usan binarios directos.)
- Commit:

### 2026-06-20 · Natalia · crm — visibilidad del lead derivado (handoff)
- Qué cambió: (1) el Switch "Agente IA" del panel de conversación ahora lee directo de `card.is_ai_active` (verdad del server) en vez de un estado local sembrado en `true`; `useSetAiActive(cardId)` hace update optimista del cache del detalle (mismo patrón que `useMoveCard`) + rollback + invalidación. (2) `crm-board.tsx`: cada tab de pipeline muestra un contador de cards; el tab "Gestión Humana" se resalta (acento fucsia) cuando tiene leads. Nuevo `docs/SPEC_handoff_visibility.md`.
- Por qué: tras un handoff el lead "desaparecía" para el staff — la card se mueve al pipeline "Gestión Humana" (2º tab, sin señal) y el switch mostraba "on" pese a `is_ai_active=false`, así que el staff creía que la IA seguía atendiendo y no cambiaba de tab. No era bug de API/datos (el board devuelve todo correcto): eran dos defectos de front que se potenciaban.
- Spec/decisión que respeta: docs/SPEC_handoff_visibility.md (alcance mínimo acordado); extiende la señal "badge 🔥 cuando handed_off" ya prevista en CLAUDE.md; toggle `is_ai_active` honesto (sin workaround). Sin cambio de contrato ni de paradigma.
- Prueba local: `tsc --noEmit` ✓, `eslint .` ✓ (0 errores, 0 warnings nuevos — mis archivos limpios), `next build` ✓. No se corrió repro de handoff en vivo: sin credenciales de prod y backend dev no levantado. (El `npx pnpm <tool>` falla por el bug conocido de pnpm v11 `verify-deps-before-run`; se corrieron los binarios directos / env var `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false` en el hook.)
- Commit: 7dcd3c0 · PR #20

### 2026-06-20 · Natalia · observabilidad — Sentry Fase 1 (error tracking front)
- Qué cambió: integración de **Sentry** (`@sentry/nextjs` ^10) para error tracking del front. Archivos nuevos: `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation-client.ts` (init por runtime; `enabled` solo si hay DSN; `tracesSampleRate: 0`; `sendDefaultPii: false`; `onRouterTransitionStart`), `instrumentation.ts` (`register()` + `onRequestError = captureRequestError` para Server Components/route handlers/middleware), `app/global-error.tsx` (captura errores de render del App Router, UI dark). `next.config.mjs` envuelto con `withSentryConfig` (sin source maps en Fase 1: sin authToken). DSN por `NEXT_PUBLIC_SENTRY_DSN` (se setea en Vercel).
- Por qué: centralizar errores del front junto con el back en Sentry (Fase 1 = solo errores, SaaS free) — pedido de Natalia. Spec: `server/docs/SPEC_observability_phase1.md` (PR-B).
- Spec/decisión que respeta: `server/docs/SPEC_observability_phase1.md`; CLAUDE.md (TS estricto sin `any`, dark, UI copy ES). Cambio aditivo de observabilidad; no toca CRM/takeover/pipeline/config del agente/realtime ni contratos del backend.
- Prueba local: `pnpm lint` (0 errores; 4 warnings preexistentes), `pnpm tsc --noEmit` (OK), `pnpm build` (OK con Turbopack + withSentryConfig, sin warnings). Sin DSN el SDK es no-op (`enabled:false`). Test real de envío = tras setear `NEXT_PUBLIC_SENTRY_DSN` en Vercel.
- Commit: a57a9c46887f5955290dac0afae1ee0beefd1e39

### 2026-06-20 · Natalia · auth — toggle mostrar/ocultar contraseña (login/register/cambiar clave)
- Qué cambió: nuevo primitivo `components/ui/password-input.tsx` (`PasswordInput`) = campo de contraseña con botón ojito (Eye/EyeOff de lucide) para mostrar/ocultar el texto y poder validarlo antes de enviar. Aplicado en `components/login-page.tsx` (campo de login), `app/(auth)/register/page.tsx` (FormField usa PasswordInput cuando `type==='password'`) y `components/crm/account/change-password-form.tsx` (los 3 campos). Accesible: `aria-label`/`aria-pressed`, focuseable.
- Por qué: pedido directo — poder ver la contraseña tecleada previo a login (y por consistencia, en registro y cambio de clave).
- Spec/decisión que respeta: CLAUDE.md (primitivo en `components/ui/`, `cn()` para merge de clases, TS estricto sin `any`, componente <200 líneas (33), dark violeta, UI copy en ES). Cambio de UI puro; no toca CRM/takeover/pipeline/config del agente/realtime ni contratos del backend.
- Prueba local: `pnpm lint` (0 errores; 4 warnings preexistentes en otros archivos), `pnpm tsc --noEmit` (OK), `pnpm build` (OK, `/login` y `/register` prerenderizadas).
- Commit: 12dc000261c63b9dc8de7688073aed1edb8bda2c

### 2026-06-20 · Natalia · landing — página pública de Política de Privacidad
- Qué cambió: nueva ruta `app/privacidad/page.tsx` (URL pública `/privacidad`) con la Política de Privacidad en español, válida para Meta/WhatsApp. Contenido dirigido por datos en `app/privacidad/content.ts` (responsable + contacto `mirko@mirkocalzadilla.com`, datos recogidos, finalidad, terceros Meta/OpenAI/hosting, conservación, derechos, canal WhatsApp/Meta, última actualización). Enlace discreto "Política de privacidad" → `/privacidad` en el footer compartido (`components/landing/site-footer.tsx`). Spec: `docs/SPEC_privacy_policy.md`.
- Por qué: Meta exige una "Privacy Policy URL" para poder pasar la app de WhatsApp a modo Activo. Esto deja la URL lista (pasar a Activo NO es obligatorio: el bot funciona en Desarrollo).
- Spec/decisión que respeta: `docs/SPEC_privacy_policy.md`; CLAUDE.md (TS estricto sin `any`, componentes <200 líneas, copy UI en ES, dark violeta/fucsia, contenido data-driven al estilo `landing/data.ts`). No toca CRM, takeover, pipeline, config del agente ni realtime.
- Prueba local: `pnpm lint` (0 errores; 4 warnings preexistentes en otros archivos), `pnpm tsc --noEmit` (OK), `pnpm build` (OK, `/privacidad` prerenderizada estática). HTML generado verificado: contiene responsable, datos, OpenAI, Meta/WhatsApp, derechos y fecha.
- Commit: d02c86e53822f87efb7b7b9c24ccde73aa60acf8

### 2026-06-20 · Natalia · settings — "Mi cuenta": cambiar contraseña propia
- Qué cambió: nueva sección "Mi cuenta" en `/crm/settings` para que **cualquier usuario logueado** cambie su propia contraseña. Archivos: `lib/api/auth.ts` (`changePasswordRequestSchema` + `changePassword()` → `POST /auth/change-password`), `hooks/use-change-password.ts` (mutation + clasificador 400/422), `components/crm/account/change-password-form.tsx` (form react-hook-form + Zod: actual / nueva min 8 / confirmar == nueva), `app/crm/settings/page.tsx` (deja de redirigir a no-operadores: "Mi cuenta" para todos, "Usuarios y roles" solo operador), `components/layout/Sidebar.tsx` (link "Ajustes" visible para todos). Spec: `docs/SPEC_change_password_ui.md`.
- Por qué: todo usuario debe poder rotar su propia clave sin pasar por un operador; es self-service de cuenta, no config de plataforma.
- Spec/decisión que respeta: `docs/SPEC_change_password_ui.md` (contrato §2, DoD §4); CLAUDE.md (TS estricto sin `any`, <200 líneas, `cn()`, copy ES); FRONTEND_SPEC §RBAC (la config de plataforma sigue operador-only).
- Mejora de flujo: `/crm/settings` pasa de operador-only a ruta compartida — la sección de config de plataforma (UsersTable) sigue gateada por `canManageConfig`; solo se agregó la sección de cuenta universal. Consistente con el diseño (cambiar la clave propia es para todos).
- Prueba local: construido contra el contrato (S2 aún sin mergear). `pnpm lint` (0 errores), `tsc --noEmit` (0 errores), `pnpm build` (OK, `/crm/settings` prerenderizada) — todos verdes con el workaround pnpm v11. Validación de form (min 8, mismatch confirmar) y render condicional verificados por tipos/build. Integración real e2e cuando S2 esté en prod.
- Commit: 87d32fed1e975fce4fa92e0f924b6da8655894dc

### 2026-06-20 · Natalia · deploy — CRM en Vercel apuntaba a localhost:8000
- Qué cambió: se agrega `web/.env.production` con `NEXT_PUBLIC_API_URL=https://api.mirkocalzadilla.com/api/v1`. Sin cambios de código.
- Por qué: el build de Vercel no tenía la variable, así que el CRM deployado (`www.mirkocalzadilla.com/crm`) llamaba al default del código (`http://localhost:8000/api/v1`) → el front intentaba pegar al localhost del visitante y no veía datos reales de prod. `.env.production` (commiteado, no ignorado por `.gitignore`) es durable y no depende de la cuenta Vercel de nadie. URL pública, no secreto. CORS de prod ya permite el origen `https://mirkocalzadilla.com`.
- Spec/decisión que respeta: CLAUDE.md (API base por `NEXT_PUBLIC_API_URL`; única var pública del front, no usada por la landing → no la rompe); docs en español.
- Prueba local: CRM en `localhost:3000` levantado con `.env.local`=misma URL → login operador HTTP 200 contra `api.mirkocalzadilla.com/api/v1` y datos reales visibles (mecanismo env→cliente→API→CORS probado). Verificación final del bundle live tras merge (Vercel auto-deploya main).
- Commit: <pendiente>

- Qué cambió: header de `docs/SPEC_B6_m-config-front.md` de "pendiente de implementar" a implementada (PR #12 + `GET /agents` server PR #46). Sin cambios de código.
- Por qué: la spec entró al repo dentro del PR #12 con el header pre-implementación; cierre documental pendiente anotado al cerrar B6 (patrón de PR #40/#42 en server).
- Spec/decisión que respeta: la propia spec (DoD §5 cumplido en el cierre de B6, smoke e2e contra Docker).
- Prueba local: n/a (docs).
- Commit: da94c0c69e3ae30e0f13bb92209300148d80dd40

### 2026-06-10 · Natalia · docs — spec B5 commiteada + DoD de runtime validado
- Qué cambió: se agrega `docs/SPEC_B5_sse-front.md` al repo (quedó local sin commitear al cerrar B5) con el header actualizado a implementada (PR #11). Sin cambios de código.
- Por qué: housekeeping — la spec es el registro durable de B5 y faltaba en main; además cierra el DoD de runtime que la entrada de B5 dejó pendiente.
- Spec/decisión que respeta: la propia `docs/SPEC_B5_sse-front.md`; CLAUDE.md (docs en español).
- Prueba local: DoD de runtime ejecutado contra backend Docker (headless Chrome + CDP): login real → EventSource abierto a `/crm/events?token=<jwt>`; move de card vía API externa → `card_moved` recibido en el browser y refetch del board en <1s (vs. 10s del polling); la card cruza de columna en el DOM sin reload (ida y vuelta, estado restaurado); probe sin auth (incógnito) → redirect a `/login`, 0 streams; cleanup verificado: redis `CLIENT LIST` con `sub=1` con el stream abierto → 0 subscribers al cerrar.
- Commit: ed1cd690b3ad39be464d1bb99629f07c9efef192

### 2026-06-10 · Natalia · crm — B6: M-Config front (`/crm/agents` + `/crm/settings`)
- Qué cambió: `lib/api/agent-config.ts` (schemas Zod + llamadas tipadas: `listAgents`/`getAgent`/`updateAgent`/`listUsers`/`changeUserRole`), `hooks/use-agent-config.ts` (`useAgentConfig` flujo single-call sobre `listAgents()[0]`; `useUpdateAgentConfig` con toast de versión + mensaje del 422 del backend), `hooks/use-users.ts` (`useUsers` + `useChangeUserRole` optimista con rollback), `components/crm/config/agent-config-form.tsx` (editor del agente con react-hook-form), `components/crm/config/users-table.tsx` (tabla + Select de rol; operador `is_superuser` read-only), páginas `agents`/`settings` (WIP → funcional, guard `canManageConfig` preservado). Incluye `docs/SPEC_B6_m-config-front.md`.
- Por qué: las dos pantallas de config de plataforma estaban en placeholder WIP; B6 las vuelve funcionales contra los endpoints M-Config del server.
- Spec/decisión que respeta: `docs/SPEC_B6_m-config-front.md` (DoD §5); RBAC 3 niveles (config solo `platform_operator`, CLAUDE.md); contratos M-Config server (PR #36) + `GET /agents` (lista) recién agregada.
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes ajenos); `pnpm tsc --noEmit` limpio; `pnpm build` ✓; smoke e2e contra server vivo (GET /agents y /users parsean, PUT versiona preservando ofertas/faq, 422 temperature legible, cambio de rol persiste + rollback).
- Mejora de flujo: el form reconstruye `config` como spread sobre el `config` cargado y solo pisa los campos editados (`dirtyFields`) — evita perder claves no expuestas (p.ej. `emojis`) en el replace completo del PUT.
- Commit: 211d05c5ef0ee07ab1d7d1f1284586e592dfacad

### 2026-06-10 · Natalia · crm — B5: SSE en el front (realtime sin polling)
- Qué cambió: nuevo `hooks/use-realtime-events.ts` (abre un `EventSource` a `/crm/events?token=<jwt>`, parsea cada evento con un `z.discriminatedUnion` y despacha invalidaciones puntuales de React Query) + nuevo `components/crm/realtime-sync.tsx` (componente invisible `return null` que monta el hook). `app/crm/layout.tsx` inyecta `<RealtimeSync />` dentro de `<AuthGuard>`. `lib/crm/realtime.ts`: comentario actualizado (el SSE aterrizó; el polling queda como fallback). Mapeo de eventos: `card_moved` → invalida `boardKeys.all` + `cardKeys.detail(card_id)`; `handoff` → `boardKeys.all`; `ai_active_changed` → `boardKeys.all` + (mapea `conversation_id`→`card.id` recorriendo el cache del board) `cardKeys.detail`. Sin token → no abre el stream; cleanup (`es.close()`) en unmount y al cambiar el token; heartbeat `: ping` y payloads no-JSON/desconocidos se ignoran sin romper.
- Por qué: reemplazar el lag del polling (10s board / 5s card) por push reactivo; el server ya expone el stream (PR #35 en main). El polling se mantiene como fallback conservador del MVP.
- Spec/decisión que respeta: `docs/SPEC_B5_sse-front.md` (contrato §2, mapeo §3.2, schema §3.3, fallback de polling §3.5); CLAUDE.md invariante Realtime = SSE/WebSocket propio (NO socket.io ni terceros — `EventSource` nativo del browser).
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes ajenas); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (11 rutas). DoD de runtime (mover card desde otro tab, fila `eventsource` en DevTools, hilo auto-actualizándose) **pendiente** — requiere `docker compose up -d` con el server.
- Commit: edb2ea7be81cd9b649db9f01af0674deaacf030e

### 2026-06-10 · Natalia · repo — .gitignore: untrack de `next-env.d.ts`
- Qué cambió: `next-env.d.ts` agregado a `.gitignore` (sección Build artifacts) y desrastreado del repo con `git rm --cached` (el archivo permanece en disco).
- Por qué: aparecía perpetuamente como `M next-env.d.ts` ensuciando working tree y diffs. Next.js lo regenera en cada build/dev (el import alterna entre `./.next/dev/types/routes.d.ts` y `./.next/types/routes.d.ts`) y el propio archivo declara *"should not be edited"*. Omisión del scaffolding inicial — Next.js no lo trackea por defecto.
- Spec/decisión que respeta: housekeeping de repo; no toca paradigma, RBAC, contratos ni código. CLAUDE.md (estructura de proyecto).
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes de shadcn/ui, ajenos) y `pnpm tsc --noEmit` limpio — ambos corridos por el hook `.hooks/pre-commit`. `build` no aplica (el hook no lo corre y el cambio no toca código; `next-env.d.ts` se regenera igual esté trackeado o no). Hecho en worktree aislado desde `main` (install con `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false --ignore-scripts`, ver workaround pnpm v11) para no interferir con la sesión paralela (B5 SSE-front) activa en el checkout compartido.
- Commit: 83007fd84d061981aa053384a4728616f01bc95b

### 2026-06-10 · Natalia · docs/crm — versionar spec /generarEntrada UI (B2)
- Qué cambió: se trackea `docs/SPEC_generar_entrada_ui.md` (estaba untracked). Documenta el botón "Generar entrada" ya implementado en PR #6 (`conversation-panel.tsx`, `useGenerateEntry`, `generateEntry` + `qrEntrySchema`); marcado como ✅ implementada.
- Por qué: cerrar el gap de tracking — el código shippeó en PR #6 pero el spec nunca se commiteó.
- Spec/decisión que respeta: documenta el contrato `POST /crm/cards/{id}/generate-entry` (server PR #28) y el gating ya vigente (`is_ai_active` + stage "Pago validado").
- Prueba local: N/A — cambio solo de documentación (markdown), sin tocar código; no se corre lint/tsc/build.
- Commit:

### 2026-06-09 · Natalia · crm — B4 (parte 2): espejo de media en el hilo
- Qué cambió: `lib/api/crm.ts` (`threadMessageSchema` + `type` con default `'text'` y `media_url` nullable/opcional — espejo del contrato server), `components/crm/conversation-message.tsx` (nuevo `MessageContent`: `type === 'image'` → `<img>` nativo con la URL, `type === 'document'` → `<a target="_blank" rel="noreferrer">`, default/tipo desconocido → texto plano como hoy; sin `media_url` → fallback de texto).
- Por qué: el server (PR #37) ya espeja `type`/`media_url` en el hilo de la card; el front mostraba solo el fallback textual `"[image: caption]"`. Cierra la parte web del CR media-espejo.
- Spec/decisión que respeta: `server/docs/SPEC_media_espejo.md` §4 (web) y §5 (DoD web): sin librerías nuevas (`<img>` nativo), fallback a texto para tipos desconocidos o sin URL.
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes shadcn/ui, ajenos); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (11 rutas). E2E con media real pendiente de backend corriendo con `MEDIA_BASE_URL` configurado.
- Commit: 49e5a8548ceb404ee9eb781d77018f9ae1c99d95

### 2026-06-09 · Natalia · crm — B3: input de respuesta humana en el panel
- Qué cambió: `lib/api/crm.ts` (`sendHumanReply(cardId, text)` → `POST /crm/cards/{id}/send`, parse con `threadMessageSchema`), `hooks/use-card-mutations.ts` (`useSendHumanReply(cardId)`: al éxito invalida `cardKeys.detail(cardId)`, error → toast), `components/crm/conversation-panel.tsx` (reemplazado el placeholder deshabilitado por input + botón "Enviar" reales; `<form>` con submit, deshabilitado durante el envío, limpia al éxito; visible solo con `!card.is_ai_active && canOperateCrm`).
- Por qué: el staff no podía responder a un lead desde el front en takeover manual; el endpoint server (PR #31) ya existe, faltaba el input que lo dispara y refresca el hilo.
- Spec/decisión que respeta: `server/docs/SPEC_human_reply.md §4` + handoff B3. `canOperateCrm` cubre "responder" (`use-permissions.ts`). Refresco del hilo por invalidación de query REST (el `useCard` ya poll-ea), sin SSE — coherente con la spec (§7) y con `showGenerateEntry`, que también lee `card.is_ai_active`.
- Prueba local: `pnpm lint` 0 errores (4 warnings preexistentes en shadcn/ui, ajenos); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (11 rutas). E2E real con backend integrado pendiente de prueba manual.
- Commit: c0fdaad73dd8346d3c6880ca8b7af287fd9f6160

### 2026-06-09 · Natalia · auth — alinear RBAC front con 3 niveles del backend
- Qué cambió: `lib/api/auth.ts` (enum `client_admin/staff` + `is_platform_operator`), `store/auth-store.ts` (campo `is_platform_operator` en `SessionData`/`AuthState`/`setSession`/`clear`), `hooks/use-auth.ts` (propagar `is_platform_operator` en reconstrucción de sesión), `hooks/use-permissions.ts` (borrar `CONFIG_ROLES`; `canManageConfig = is_platform_operator`), `app/(auth)/register/page.tsx` (copy "OWNER" → "administrador"), `components/layout/Sidebar.tsx` (ocultar Agentes/Ajustes si `!canManageConfig`), `app/crm/agents/page.tsx` + `app/crm/settings/page.tsx` (redirect a `/crm` si `!canManageConfig`).
- Por qué: el backend mergeó RBAC 3 niveles (#22/#23); el front quedó con enum viejo `owner/admin/member` → parse de `/auth/me` fallaba → sesión no hidrataba → nadie podía entrar. Este CR alinea el contrato y completa el invariante de gating.
- Spec/decisión que respeta: `docs/SPEC_RBAC_FRONT.md` (aprobada 2026-06-09); `CLAUDE.md` invariante "config solo `platform_operator`"; `server/docs/SPECS_MVP.md` §RBAC.
- Prueba local: `pnpm lint` 0 errores, 4 warnings preexistentes (shadcn/ui — ajenos al cambio); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (11 rutas). E2E real pendiente hasta backend corriendo localmente.
- Commit:

### 2026-06-09 · Natalia · docs — spec RBAC front alineada con RBAC 3 niveles
- Qué cambió: agregar `docs/SPEC_RBAC_FRONT.md` — spec para alinear el contrato de auth del front con el RBAC de 3 niveles del backend (PR #22/#23). Cubre: enum `client_admin/staff`, dimensión global `is_platform_operator`, gating de nav/rutas config, corrección de copy en register.
- Por qué: la spec estaba untracked local; se cierra como PR de docs antes de implementar. Decisiones abiertas resueltas el 2026-06-09: §4.5 entra en el CR (confirma invariante CLAUDE.md); badge de rol fuera.
- Spec/decisión que respeta: `docs/FRONTEND_SPEC.md`; `CLAUDE.md` invariante config; `server/docs/SPECS_MVP.md` §RBAC.
- Prueba local: solo docs — sin lint/tsc/build necesarios.
- Commit: 157b80b

### 2026-06-06 · Natalia · CRM front — tablero real (reemplaza el mock)
- Qué cambió: reemplazo del mock `components/crm-pipeline.tsx` (~300 líneas hardcoded) por el tablero real contra la API M-CRM-api slice 2. Nuevo: `lib/api/crm.ts` (schemas Zod + `getBoards`/`getCard`/`moveCard`/`setAiActive`), `lib/crm/realtime.ts` (constantes de polling-puente), hooks `use-board`/`use-card`/`use-card-mutations`/`use-permissions`, y árbol `components/crm/` (crm-board con tabs por pipeline, pipeline-board, board-column, board-card, conversation-panel con hilo espejo, conversation-message). `app/crm/page.tsx` apunta al nuevo board; mock borrado.
- Por qué: implementar `SPEC_CRM_FRONT.md` — operador logueado ve los 2 pipelines reales, abre la card con el hilo espejo de WhatsApp, mueve cards (persistido) y togglea el takeover IA.
- Spec/decisión que respeta: `docs/SPEC_CRM_FRONT.md` (intent, contrato §3, alcance §5, DoD §6); roles reales `owner/admin/member` (§8, 3-tier diferido — no inventar roles); decisiones abiertas §9 resueltas: tabs por pipeline, polling adaptativo 10s/5s, nuevo árbol + borrar mock.
- Mejora de flujo: realtime por `refetchInterval` (board 10s / card abierta 5s) como **puente** hasta el SSE de slice 2b; al aterrizar el SSE se reemplaza por `EventSource` + `invalidateQueries` (documentado en `lib/crm/realtime.ts`). Sin librerías de realtime de terceros.
- Diferidos (bloqueados, según spec §5/§8): input de respuesta humana visible pero deshabilitado (envío WhatsApp bloqueado por M-Meta-inv); `generar-entrada` UI y SSE real → slice 2b. Gap de contrato registrado: `GET /cards/{id}` no expone `is_ai_active`, así que el toggle persiste vía PUT pero su estado mostrado se siembra "activo" y se actualiza con la respuesta del PUT (reflexión al recargar requiere que el backend exponga el campo).
- Prueba local: `pnpm lint` 0 errores, 4 warnings (todos preexistentes: `ui/carousel`, `ui/sidebar`, `ui/use-mobile`, `hooks/use-mobile`; ninguno en archivos del cambio); `pnpm tsc --noEmit` limpio; `pnpm build` ✓ (TypeScript estricto ✓, 11 rutas). Happy-path E2E contra datos reales NO ejecutado: el backend slice 2 no está corriendo/accesible localmente; schemas espejados 1:1 del contrato §3.
- Commit: b131a8b

### 2026-06-06 · Natalia · docs — RBAC 3 niveles (alinear con server)
- Qué cambió: `docs/FRONTEND_SPEC.md` (pantalla 4 ABM + sección RBAC) y `CLAUDE.md` (invariante config) reescritos a **RBAC de 3 niveles**: `platform_operator` (Natalia+equipo, p. ej. Chris) ve config/users/roles/agente; `client_admin` (Mirko) y `staff` solo operan (inbox + CRM). Anula "admin = Mirko".
- Por qué: alinear el front con el cambio ya mergeado/en PR del server (PR #9: SPECS_MVP §RBAC + FLUJO §4); el cliente no es admin de plataforma.
- Spec/decisión que respeta: `server/docs/SPECS_MVP.md` §RBAC (modelo canónico); decisión de negocio (Natalia, 2026-06-06).
- Prueba local: docs-only, ningún `.ts/.tsx` tocado. Pre-commit hook (pnpm lint + tsc) verde: 0 errores (4 warnings preexistentes en shadcn/ui, ajenos al cambio).
- Commit: 447fb80

### 2026-06-05 · Natalia · docs + workflow
- Qué cambió:
  - **Workflow:** `.claude/commands/close.md` — reescrito completo; ahora crea branch, commitea, pushea y abre PR a main con validación de paradigma (RBAC, realtime, takeover, contratos backend) antes de cada paso.
  - **Hooks:** `.hooks/pre-commit` — nuevo; pnpm lint + tsc como guardrail rápido en cada commit local.
  - **Docs (sesión anterior):** alta de `docs/FRONTEND_SPEC.md`, `BITACORA.md`, `CLAUDE.md` actualizado, skill `/close`. Handoff histórico archivado en `docs/archive/`.
- Por qué: versionar el conocimiento en el repo, dejar lista la división de trabajo y establecer el flujo de cierre con branch + PR.
- Spec/decisión que respeta: decisiones 2026-06-05 (CRM en `/crm`, takeover, WebSocket/SSE propio, RBAC admin/staff).
- Prueba local: n/a (docs + config).
- Commit: cabf00f — PR #1
