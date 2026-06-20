# SPEC — Página pública de Política de Privacidad

## Objetivo

Publicar una página de **Política de Privacidad** en la landing para usarla como
**"Privacy Policy URL"** en Meta (App → Configuración → Básica). Es requisito para
poder pasar la app de WhatsApp a modo **Activo**. (Pasar a Activo NO es obligatorio:
el bot funciona en modo Desarrollo. Esto deja la URL lista para cuando se decida.)

## Ruta y URL

| Ruta (App Router)        | URL pública                              |
| ------------------------ | ---------------------------------------- |
| `app/privacidad/page.tsx` | `https://mirkocalzadilla.com/privacidad` |

- Página estática (server component). Sin estado, sin llamadas a la API.
- `metadata` propio: `title` + `description` en español.
- Enlace discreto **"Política de privacidad" → `/privacidad`** en el footer compartido
  (`components/landing/site-footer.tsx`) para que sea alcanzable desde la landing.

## Contenido (español, válido para Meta/WhatsApp)

| Sección                       | Qué dice |
| ----------------------------- | -------- |
| Responsable                   | Mirko Calzadilla · contacto **mirko@mirkocalzadilla.com** |
| Qué datos recogemos           | Número de WhatsApp, nombre, contenido de los mensajes que envías |
| Para qué los usamos           | Responder consultas del curso, gestión de leads/ventas |
| Con quién los compartimos     | Meta/WhatsApp (canal), OpenAI (procesa los mensajes para generar respuestas), proveedor de hosting |
| Conservación                  | Se conservan mientras dure la relación / la consulta; luego se eliminan o anonimizan |
| Derechos del usuario          | Acceso, rectificación y eliminación; cómo ejercerlos (escribiendo al contacto) |
| Canal WhatsApp/Meta           | Mención explícita de que el contacto es vía WhatsApp y se rige también por las políticas de Meta |
| Cambios a esta política       | Puede actualizarse; rige la fecha de última actualización |
| Fecha de última actualización | 20 de junio de 2026 |

## Estilo

Consistente con la landing (dark mode, acentos violeta/fucsia, Montserrat heredada del
layout). Reutiliza los patrones existentes:

- Fondo negro con degradados sutiles (igual que `components/landing-page.tsx`).
- Eyebrow `text-violet-300 ... uppercase tracking`.
- Títulos `font-bold text-white tracking-tight`; cuerpo `text-zinc-400 leading-relaxed`.
- Footer compartido (`SiteFooter`). Header propio mínimo (wordmark → `/`), porque los
  anclas del header de la landing (`#curso`, etc.) no aplican fuera del home.
- Contenido dirigido por datos (array de secciones) para mantener el archivo < 200 líneas.

## DoD

- La página renderiza en `/privacidad`.
- `pnpm lint` / `tsc --noEmit` / `build` en verde.
- `/close` (el del repo) + PR.
- Tras merge → Vercel auto-deploya → URL live → Natalia la pega en Meta.

## No-objetivos

- No se traduce a otros idiomas (cliente boliviano → solo español).
- No se agregan cookies/analytics ni banners de consentimiento (la landing no los usa).
- No se toca el flujo del agente ni el CRM.
