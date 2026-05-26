# QA Boilerplate Generator

Browser-based wizard to scaffold test automation projects for WebdriverIO, Playwright, and Cypress with a live file preview and downloadable ZIP output.

Phase 1 is implemented. Phase 2 now focuses on dependency mapping and compatibility hardening, Phase 3 focuses on presets and JSON import, and the VS Code extension is deferred to Phase 4.

## Prerequisites

- Node.js 20+ (recommended)

## Install

```bash
npm install
```

## Scripts

| Command                | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build`        | Production build                                                       |
| `npm run start`        | Run the production server                                              |
| `npm run lint`         | ESLint                                                                 |
| `npm run typecheck`    | TypeScript (`tsc --noEmit`)                                            |
| `npm run format`       | Format with Prettier                                                   |
| `npm run format:check` | Check formatting                                                       |
| `npm test`             | Unit tests (Vitest)                                                    |

## Deploy (Vercel)

1. Push this repository to GitHub (or GitLab / Bitbucket).
2. Import the repo in [Vercel](https://vercel.com/new) and use the default Next.js settings.
3. No environment variables are required for Phase 1.

Preview deployments are created automatically for pull requests when the Git integration is enabled.

## Project layout

Application code lives under `src/`:

- `src/app` — Next.js App Router
- `src/components` — UI (sidebar, preview, shared primitives)
- `src/generator` — Pure generation logic (no React)
- `src/context` — Config state
- `src/types` — Shared TypeScript types
- `src/lib` — Utilities such as ZIP building, syntax highlighting, and shared helpers

## Roadmap docs

- Phase 1 reference and archive: [`docs/phase1/README.md`](docs/phase1/README.md)
- Phase 2 dependency-hardening plan: [`docs/qa-boilerplate-generator-phase2.md`](docs/qa-boilerplate-generator-phase2.md)
- Phase 2 ticket breakdown: [`docs/phase2/README.md`](docs/phase2/README.md)
- Framework dependency mapping: [`docs/dependency-mapping.md`](docs/dependency-mapping.md)
- Phase 3 presets and JSON import: [`docs/qa-boilerplate-generator-phase3.md`](docs/qa-boilerplate-generator-phase3.md)
- Phase 4 VS Code extension plan: [`docs/qa-boilerplate-generator-phase4.md`](docs/qa-boilerplate-generator-phase4.md)

UI/design spec (colors, type, components): [`docs/design/qa-boilerplate-generator-design-spec.md`](docs/design/qa-boilerplate-generator-design-spec.md).
