# QA Boilerplate Generator

Browser-based wizard and VS Code extension to scaffold test automation projects for WebdriverIO, Playwright, and Cypress—with a live file preview (web) or workspace write (extension).

Phases 1–3 are implemented in the web app. Phase 4 adds a VS Code extension that reuses the shared `@qa-boilerplate/generator` package (no duplicate generator logic, no calls to the deployed web app).

## Features

- **Configuration wizard** — Choose framework (Playwright, WebdriverIO v9, or Cypress), language (TypeScript or JavaScript), Page Object Model, reporting (Allure, HTML, dot), CI provider, ESLint/Prettier, dotenv, and optional Zod validation.
- **Dependency manifest** — Generated `package.json` scripts and devDependencies are resolved from compatibility groups in [`packages/generator/src/generator/dependencyManifest.ts`](packages/generator/src/generator/dependencyManifest.ts), not hand-picked per file.
- **API templates** — Optional API testing scaffolds (transport → domain helper → example spec) under [`packages/generator/src/generator/blocks/api/`](packages/generator/src/generator/blocks/api/) for Playwright built-in request, Axios, or Supertest.
- **Official presets** — Nine curated starting points in [`packages/generator/presets/official/`](packages/generator/presets/official/), validated against [`packages/generator/presets/preset.schema.json`](packages/generator/presets/preset.schema.json).
- **JSON import** — Upload a preset file (web) or open a JSON file (extension), validate fields, then apply or customize before generating.
- **Integrations** — Testlio (requires Allure reporting) and Mailinator helpers in [`packages/generator/src/generator/blocks/integrations/`](packages/generator/src/generator/blocks/integrations/). Community preset submissions are described in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **VS Code extension** — Command Palette: **QA Gen: Generate Test Project** (requires an open workspace folder).

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

## Scripts (repo root)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the web dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build (`apps/web`) |
| `npm run start` | Run the production web server |
| `npm run lint` | ESLint (`apps/web`) |
| `npm run typecheck` | TypeScript across workspaces |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm test` | Unit tests (generator + web; 74 total) |
| `npm run validate:presets` | Validate preset JSON under `packages/generator/presets/` |

## Monorepo layout

```text
packages/generator/   @qa-boilerplate/generator — generateProject, presets, types
apps/web/             Next.js wizard UI
apps/vscode-extension/ VS Code extension
scripts/              validate-presets.ts
docs/                 Roadmap and phase docs
```

## Deploy (Vercel)

1. Push this repository to GitHub (or GitLab / Bitbucket).
2. Import the repo in [Vercel](https://vercel.com/new).
3. Set **Root Directory** to `apps/web`.
4. Build command: `npm run build` (from repo root) or `cd ../.. && npm run build` if building from `apps/web` only after `npm install` at root.
5. No environment variables are required for the hosted wizard.

Preview deployments are created automatically for pull requests when the Git integration is enabled.

## VS Code extension

See [`apps/vscode-extension/README.md`](apps/vscode-extension/README.md) for local development, `.vsix` packaging, and Marketplace publishing.

## Roadmap docs

- Phase 1 reference and archive: [`docs/phase1/README.md`](docs/phase1/README.md)
- Phase 2 dependency-hardening plan: [`docs/qa-boilerplate-generator-phase2.md`](docs/qa-boilerplate-generator-phase2.md)
- Phase 2 ticket breakdown: [`docs/phase2/README.md`](docs/phase2/README.md)
- Framework dependency mapping: [`docs/dependency-mapping.md`](docs/dependency-mapping.md)
- Phase 3 presets and JSON import: [`docs/qa-boilerplate-generator-phase3.md`](docs/qa-boilerplate-generator-phase3.md)
- Phase 4 VS Code extension: [`docs/qa-boilerplate-generator-phase4.md`](docs/qa-boilerplate-generator-phase4.md)

UI/design spec (colors, type, components): [`docs/design/qa-boilerplate-generator-design-spec.md`](docs/design/qa-boilerplate-generator-design-spec.md).
