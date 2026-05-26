<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## QA Boilerplate Generator

- **Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, ESLint + Prettier.
- **Phase 1 docs:** Spec in `docs/qa-boilerplate-generator-phase1.md`; ticket index and breakdown in `docs/phase1/README.md` (per-ticket folders under `docs/phase1/tickets/`).
- **Roadmap:** Phase 2 is dependency mapping and compatibility hardening (`docs/qa-boilerplate-generator-phase2.md`, `docs/dependency-mapping.md`); Phase 3 is presets and JSON import (`docs/qa-boilerplate-generator-phase3.md`); Phase 4 is the VS Code extension (`docs/qa-boilerplate-generator-phase4.md`).
- **BDD:** Do not add BDD/Cucumber generation in the active roadmap. If reconsidered later, treat it as separate WDIO-only research.
- **Architecture:** `src/generator` is pure (no React). `src/context` holds `ConfigContext`, `useReducer`, and `defaultConfig`. `src/types` defines `Config` and file-tree types.
- **Scripts:** `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run format`, `npm run test`. Tests use Vitest (`vitest.config.ts`, `src/**/*.test.ts`).
- **Import alias:** `@/*` maps to `src/*`.

## Learned User Preferences

- Prefer validating changes with one-shot commands (`npm run lint`, `npm run typecheck`, `npx vitest run`); avoid long-lived dev servers in automation unless the user needs them.

## Learned Workspace Facts

- Phase 1 Cursor rule for TS/TSX: `.cursor/rules/qa-boilerplate-phase1.mdc` (tickets location, strict TS, pure generator, responsive layout intent).
- Pencil UI tokens and layout reference: `docs/design/qa-boilerplate-generator-design-spec.md` (extracted from `design/qa-boilerplate-generator.pen`).
