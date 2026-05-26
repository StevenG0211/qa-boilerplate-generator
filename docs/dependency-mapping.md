# Framework Dependency Mapping

## Purpose

This document is the dependency source of truth for generated QA projects. Phase 2 should move package selection toward a central manifest so future features and presets compose known-safe dependency groups instead of hand-merging package strings.

## Global Rules

- Keep framework package families on the same major and, where practical, the same minor version family.
- Prefer framework-native features before adding third-party packages.
- Add packages only when generated code imports them or the framework requires them at runtime.
- Keep TypeScript execution tooling aligned with each framework's current recommendation.
- Treat reporters and Cypress plugins as compatibility groups because they often need config and support-file wiring, not only package installation.
- Test package output by full framework scenarios, not only isolated option toggles.
- Do not add BDD/Cucumber dependencies in Phase 2.

## Playwright

Core group:

- `@playwright/test`

TypeScript group:

- `typescript`
- `@types/node`

Reporting groups:

- HTML reporting should use Playwright's built-in `html` reporter.
- Allure reporting should add `allure-playwright`.
- Add an Allure CLI package only if generated scripts include local report generation commands.

API groups:

- Prefer `playwright-built-in` for Playwright API testing.
- `axios` and `supertest` may remain selectable, but they are secondary paths.

Notes:

- Generated docs should mention `npx playwright install`.
- Avoid Playwright BDD packages in generated output.

## WebdriverIO

Core group:

- `webdriverio`
- `@wdio/cli`
- `@wdio/local-runner`
- `@wdio/mocha-framework`
- `expect-webdriverio`

TypeScript group:

- `typescript`
- `tsx`
- `@types/node`
- `@types/mocha`

Reporting groups:

- Allure should use `@wdio/allure-reporter`.
- Dot should use `@wdio/dot-reporter`.
- HTML reporting should be validated before locking the package choice because third-party reporter compatibility can lag behind WDIO releases.

API groups:

- `axios` for lightweight HTTP client scaffolds.
- `supertest` and `@types/supertest` for Node server/API scaffolds.

Notes:

- WDIO v9 TypeScript support expects `tsx`, not the older `ts-node`-based runtime assumption.
- Keep `@wdio/*` packages aligned as a compatibility group.
- Cucumber belongs to a possible future WDIO-only research phase, not Phase 2.

## Cypress

Core group:

- `cypress`

TypeScript group:

- `typescript`
- `@types/node`

Reporting groups:

- HTML reporting should use `cypress-mochawesome-reporter`.
- Allure reporting should prefer `allure-cypress`.
- Add `cypress-on-fix` only when generated config combines plugins that need overlapping Cypress event hooks.

API groups:

- `axios` for lightweight HTTP client scaffolds.
- `supertest` and `@types/supertest` only when the generated example is Node-oriented and not browser-command-oriented.

Notes:

- Cypress reporter packages often require both `cypress.config.*` wiring and `cypress/support/e2e.*` imports.
- Avoid Cypress BDD preprocessors in generated output.
- When multiple plugins are enabled, validate event-hook composition before adding more dependencies.

## Validation Strategy

Package generation tests should cover these scenario groups:

- Playwright TypeScript with native API and Allure.
- Playwright JavaScript with no optional integrations.
- WDIO TypeScript with Allure, Dot, and API helper choices.
- WDIO JavaScript with minimal dependencies.
- Cypress TypeScript with HTML reporting.
- Cypress TypeScript with Allure reporting.
- Cypress with HTML plus Allure, including any required plugin-composition package.

Each test should assert:

- expected scripts
- expected direct dependencies
- absence of BDD/Cucumber packages
- absence of stale TypeScript runtime packages
- framework-specific overrides only where documented
