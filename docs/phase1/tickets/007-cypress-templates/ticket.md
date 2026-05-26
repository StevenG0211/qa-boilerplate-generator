# TICKET-007 — Cypress Template Generator

| Field | Value |
|--------|--------|
| **Type** | Feature |
| **Priority** | P1 |
| **Blocked by** | TICKET-004 |

## Description

Cypress file generation; HTML → Mochawesome; Allure via `@shelex/cypress-allure-plugin`.

## Tasks

- [ ] `cypress.config.ts` / `cypress.config.js`
- [ ] `tsconfig.json` when `language === "ts"`
- [ ] POM: `cypress/pages/LoginPage.ts`
- [ ] Screenplay: folder structure only
- [ ] Allure plugin wiring when enabled
- [ ] Mochawesome when HTML reporter enabled
- [ ] Supertest / Axios stubs when selected
- [ ] `.env.example`, Zod schemas when enabled
- [ ] CI configs
- [ ] ESLint + Prettier when enabled
- [ ] Unit tests: Cypress flag matrix
