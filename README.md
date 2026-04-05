# QA Boilerplate Generator

Browser-based wizard to scaffold test automation projects (WebdriverIO, Playwright, Cypress). See [`docs/qa-boilerplate-generator-phase1.md`](docs/qa-boilerplate-generator-phase1.md) for the Phase 1 specification.

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
- `src/lib` — Utilities (e.g. ZIP builder in later phases)

Ticket breakdown: [`docs/phase1/README.md`](docs/phase1/README.md).

UI/design spec (colors, type, components): [`docs/design/qa-boilerplate-generator-design-spec.md`](docs/design/qa-boilerplate-generator-design-spec.md).
