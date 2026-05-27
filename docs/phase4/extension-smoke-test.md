# Extension smoke test checklist

Manual QA for **QA Gen: Generate Test Project** before release or after generator changes. Run in the Extension Development Host (**F5** from `apps/vscode-extension`) or from an installed `.vsix`.

## Prerequisites

```bash
npm install
npm run compile:extension
```

Open an empty folder as the workspace root.

## Checklist

### Command availability

- [ ] With no folder open, **QA Gen: Generate Test Project** is disabled (`workspaceFolderCount > 0` enablement) or shows a clear error when invoked.
- [ ] With a folder open, the command appears in the Command Palette under category **QA Gen**.

### Official presets (9)

For each preset: run the command → **Official preset** → select preset → **Generate now** → confirm preview → write files. Verify sentinel paths exist under `<projectName>/`.

| Preset ID | Sentinel paths to verify |
| --- | --- |
| `playwright-ts-pom` | `playwright.config.ts`, `tests/pages/LoginPage.ts`, `tests/smoke.spec.ts` |
| `playwright-api-zod` | `src/schemas/loginFixture.ts`, `tests/api/users.spec.ts` |
| `playwright-testlio-ts-pom` | `playwright.config.ts`, `playwright.service.config.ts`, `testlio-cli/project-config.json`, `lib/helpers-fixtures.ts` |
| `wdio-ts-pom-allure` | `wdio.conf.ts`, `src/pages/LoginPage.ts` |
| `wdio-api-axios` | `src/api/client.ts`, `test/specs/api/users.api.ts` |
| `wdio-testlio-ts-pom` | `wdio.conf.ts`, `testlio-cli/project-config.json`, `lib/hooks.ts` |
| `cypress-ts-pom-html` | `cypress.config.ts`, `cypress/pages/LoginPage.ts` |
| `cypress-js-minimal` | `cypress.config.js`, `cypress/e2e/smoke.cy.js` |
| `cypress-testlio-ts-pom` | `cypress.config.ts`, `cypress/support/allure-hooks.ts`, `testlio-cli/project-config.json` |

Sentinel paths match the generator test map in `packages/generator/src/generator/index.test.ts`.

### JSON import

- [ ] **Import JSON preset** with invalid JSON → field-level errors shown (e.g. `path: message`).
- [ ] **Import JSON preset** with a valid official or community preset → preset loads and generates successfully.

### Overwrite confirmation

- [ ] Generate a project twice into the same workspace (same `projectName`) → overwrite confirmation appears before replacing existing files.

### Manual configure

- [ ] **Configure manually** prompts for: project name, framework, language, pattern, CI provider, ESLint, Prettier, dotenv, Zod, reporting, API tool, Testlio, Mailinator.
- [ ] Testlio with Allure off → warning and Testlio stays disabled (or user enables Allure first).

### Success and failure

- [ ] Successful write → information message with file count and project folder name.
- [ ] Simulate a write failure (e.g. read-only path if feasible) → error message and Output channel listing failures.

## Automated tests (deferred)

`@vscode/test-electron` is not set up in this repo. Use this checklist for acceptance; add automated extension tests when setup cost is justified.

See [Phase 4 README](./README.md) for deferred items.
