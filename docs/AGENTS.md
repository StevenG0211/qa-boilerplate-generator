<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## QA Boilerplate Generator

- **Stack:** npm workspaces monorepo; Next.js 16 App Router (`apps/web`), shared `@qa-boilerplate/generator` package, VS Code extension (`apps/vscode-extension`); React 19, TypeScript strict, Tailwind v4, ESLint + Prettier.
- **Phase 1 docs:** Spec in `docs/qa-boilerplate-generator-phase1.md`; ticket index in `docs/phase1/README.md`.
- **Roadmap:** Phase 4 VS Code extension (`docs/qa-boilerplate-generator-phase4.md`); shared package assessment in `docs/phase4/shared-package-assessment.md`.
- **BDD:** Do not add BDD/Cucumber generation in the active roadmap.
- **Architecture:** `packages/generator` is pure (no React). `apps/web/src/context` holds `ConfigContext` and reducer. Types and `generateProject` live in `@qa-boilerplate/generator`.
- **Scripts (root):** `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run format`, `npm test`, `npm run validate:presets`.
- **Web import alias:** `@/*` maps to `apps/web/src/*`. Generator consumers use `@qa-boilerplate/generator`.

## Learned User Preferences

- Prefer validating changes with one-shot commands (`npm run lint`, `npm run typecheck`, `npm test`); avoid long-lived dev servers in automation unless the user needs them.

## Learned Workspace Facts

- Phase 1 Cursor rule: `.cursor/rules/qa-boilerplate-phase1.mdc`
- Pencil UI tokens: `docs/design/qa-boilerplate-generator-design-spec.md`
- Vercel **Root Directory:** `apps/web`
