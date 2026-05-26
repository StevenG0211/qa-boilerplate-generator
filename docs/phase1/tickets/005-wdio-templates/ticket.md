# TICKET-005 — WebdriverIO Template Generator

| Field | Value |
|--------|--------|
| **Type** | Feature |
| **Priority** | P1 |
| **Blocked by** | TICKET-004 |

## Description

Full WDIO file generation per config; see the **Business Rules** table in [`qa-boilerplate-generator-phase1.md`](../../../qa-boilerplate-generator-phase1.md).

## Business rules (WDIO-specific)

- `dot` reporter: WDIO only (else toggle disabled in UI)
- `html`: `@wdio/html-reporter`
- Supertest default suggestion when API testing (vs Playwright built-in)

## Tasks

- [ ] `wdio.conf.ts` / `wdio.conf.js`
- [ ] `tsconfig.json` when `language === "ts"`
- [ ] POM: `src/pages/LoginPage.ts` (or `.js`) with WDIO selectors
- [ ] Screenplay: folders `src/actors/`, `tasks/`, `questions/` only (no stubs)
- [ ] Allure / dot / HTML reporters in conf when enabled
- [ ] API: Supertest → deps + `src/api/apiClient.ts` stub; Axios variant when selected
- [ ] `.env.example` when `env.dotenv`
- [ ] Zod: deps + `src/schemas/` with fixture + response schema examples
- [ ] CI: `.github/workflows/test.yml` or `.gitlab-ci.yml`
- [ ] ESLint (+ Prettier plugin if both); Prettier config when enabled
- [ ] Unit tests: flag combinations for WDIO
