# CLAUDE.md — Frontend Conventions

This file provides guidance to Claude Code (claude.ai/code) when working with the frontend code.

## Commands

Package manager is **pnpm** (`npx pnpm`).

- `npx pnpm dev` — start Next.js dev server
- `npx pnpm build` — production build (strict type checking enabled)
- `npx pnpm lint` — ESLint validation
- `npx pnpm tsc --noEmit` — strict type checking

## Architecture & Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** Tailwind CSS v4 + shadcn/ui + Lucide icons
- **State Management:** Zustand (global UI state), React Query (server state / API)
- **Data Fetching:** Axios + React Query
- **Validation:** Zod

## Clean Code Rules

- **TypeScript Strict:** No `any`, no implicit `any`. Do not use `as` casting unless absolutely necessary.
- **Component size:** Keep components under 200 lines. Extract custom hooks for complex logic.
- **Styling:** Use `cn()` utility (`lib/utils.ts`) for class merging. Design is dark mode by default (`dark bg-black`).
- **Language:** Code in English (variables, functions, components). UI copy and comments explaining business logic in Spanish.

## Project Structure

- `app/` — routes (Next.js App Router).
- `components/` — UI components. Primitives go in `components/ui/`.
- `hooks/` — custom React hooks.
- `lib/` — utility functions, Axios instance, generic helpers.
- `store/` — Zustand stores.

## UI / UX

- The application is the staff-facing CRM/Inbox (`app.mirkocalzadilla.com`) and the public landing page (`mirkocalzadilla.com`).
- Preserve the existing dark mode aesthetic with violet/fuchsia accents.
