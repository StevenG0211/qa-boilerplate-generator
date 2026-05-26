# TICKET-006 — Playwright Template Generator

| Field | Value |
|--------|--------|
| **Type** | Feature |
| **Priority** | P1 |
| **Blocked by** | TICKET-004 |

## Description

Playwright file generation; HTML reporter = built-in; `playwright-built-in` API only valid here.

## Tasks

- [ ] `playwright.config.ts` / `playwright.config.js`
- [ ] `tsconfig.json` when `language === "ts"`
- [ ] POM: `tests/pages/LoginPage.ts` with `Locator` types
- [ ] Screenplay: `src/actors/`, `tasks/`, `questions/` folders only
- [ ] Allure / HTML in config when enabled
- [ ] `playwright-built-in`: stub `tests/api/apiClient.ts` using `request` context
- [ ] Supertest / Axios stubs when selected (same spirit as WDIO ticket)
- [ ] `.env.example` when dotenv
- [ ] Zod schema examples when enabled
- [ ] CI: include `npx playwright install` where appropriate
- [ ] ESLint + Prettier when enabled
- [ ] Unit tests: Playwright flag matrix
