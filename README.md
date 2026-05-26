# QA Boilerplate Generator

Browser-based wizard to scaffold test automation projects for WebdriverIO, Playwright, and Cypress with a live file preview and downloadable ZIP output.

Phases 1–3 are implemented: the wizard, dependency manifest, API templates, official presets, JSON import, and Testlio/Mailinator integrations. A VS Code extension is planned for Phase 4 and is not implemented in this repository.

## Features

- **Configuration wizard** — Choose framework (Playwright, WebdriverIO v9, or Cypress), language (TypeScript or JavaScript), Page Object Model, reporting (Allure, HTML, dot), CI provider, ESLint/Prettier, dotenv, and optional Zod validation.
- **Dependency manifest** — Generated `package.json` scripts and devDependencies are resolved from compatibility groups in [`src/generator/dependencyManifest.ts`](src/generator/dependencyManifest.ts), not hand-picked per file.
- **API templates** — Optional API testing scaffolds (transport → domain helper → example spec) under [`src/generator/blocks/api/`](src/generator/blocks/api/) for Playwright built-in request, Axios, or Supertest.
- **Official presets** — Nine curated starting points in [`presets/official/`](presets/official/), loaded in the UI and validated against [`presets/preset.schema.json`](presets/preset.schema.json).
- **JSON import** — Upload a preset file, validate fields, then apply or customize before generating.
- **Integrations** — Testlio (requires Allure reporting) and Mailinator helpers in [`src/generator/blocks/integrations/`](src/generator/blocks/integrations/). Community preset submissions are described in [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Official presets

| ID | Description |
| --- | --- |
| `playwright-ts-pom` | Native Playwright UI tests with TypeScript, page objects, and built-in HTML reporting. |
| `playwright-api-zod` | Playwright TypeScript API testing using the built-in request fixture and Zod validation helpers. |
| `playwright-testlio-ts-pom` | Testlio-ready Playwright scaffold with POM, Allure reporting, Mailinator helper, and lib fixtures. |
| `wdio-ts-pom-allure` | WebdriverIO v9 TypeScript UI tests with page objects, Allure, and dot reporting. |
| `wdio-api-axios` | WebdriverIO v9 TypeScript starter focused on Axios API helper scaffolding. |
| `wdio-testlio-ts-pom` | Testlio-ready WebdriverIO scaffold with POM, Allure reporting, and Mailinator helper. |
| `cypress-ts-pom-html` | Cypress TypeScript UI tests with page objects and Mochawesome HTML reporting. |
| `cypress-js-minimal` | Minimal Cypress JavaScript scaffold with no optional integrations enabled. |
| `cypress-testlio-ts-pom` | Testlio-ready Cypress scaffold with POM, Allure and HTML reporting, and Mailinator helper. |

> **Testlio note:** Enabling Testlio in the wizard requires Allure reporting. Generated Testlio projects include `testlio-cli/project-config.json` and Allure result directories for platform upload.

## Prerequisites

- Node.js 20+ (recommended; CI uses Node 22)

## Install

```bash
npm install
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm test` | Unit tests (Vitest) |
| `npm run validate:presets` | Validate all preset JSON under `presets/official/` and `presets/community/` |

## Deploy (Vercel)

1. Push this repository to GitHub (or GitLab / Bitbucket).
2. Import the repo in [Vercel](https://vercel.com/new) and use the default Next.js settings.
3. No environment variables are required for the hosted wizard.

Preview deployments are created automatically for pull requests when the Git integration is enabled.

## Project layout

- `presets/official/` — Shipped preset JSON files
- `presets/community/` — Community submissions (see CONTRIBUTING)
- `presets/preset.schema.json` — JSON Schema for preset files
- `scripts/` — Maintenance scripts (e.g. preset validation)
- `src/app` — Next.js App Router
- `src/components` — UI (sidebar, preview, shared primitives)
- `src/context` — Config state and reducer
- `src/generator` — Pure generation logic (no React)
- `src/generator/blocks/api/` — API template generators
- `src/generator/blocks/integrations/` — Testlio, Mailinator, Allure helpers
- `src/presets/` — Preset schema, validation, and official preset loader
- `src/types` — Shared TypeScript types
- `src/lib` — ZIP building, syntax highlighting, and shared helpers

## Roadmap docs

- Phase 1 reference and archive: [`docs/phase1/README.md`](docs/phase1/README.md)
- Phase 2 dependency-hardening plan: [`docs/qa-boilerplate-generator-phase2.md`](docs/qa-boilerplate-generator-phase2.md)
- Phase 2 ticket breakdown: [`docs/phase2/README.md`](docs/phase2/README.md)
- Framework dependency mapping: [`docs/dependency-mapping.md`](docs/dependency-mapping.md)
- Phase 3 presets and JSON import: [`docs/qa-boilerplate-generator-phase3.md`](docs/qa-boilerplate-generator-phase3.md)
- Phase 4 VS Code extension plan (not implemented): [`docs/qa-boilerplate-generator-phase4.md`](docs/qa-boilerplate-generator-phase4.md)

UI/design spec (colors, type, components): [`docs/design/qa-boilerplate-generator-design-spec.md`](docs/design/qa-boilerplate-generator-design-spec.md).
