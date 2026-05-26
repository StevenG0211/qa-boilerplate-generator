# TICKET-008 — Sidebar UI (Config Panel)

| Field | Value |
|--------|--------|
| **Type** | Feature |
| **Priority** | P1 |
| **Blocked by** | TICKET-003 |

## Description

Left panel: dispatch only — **no** `generateProject` calls here.

## Tasks

- [ ] Project name text input (top)
- [ ] Framework: segmented WDIO / Playwright / Cypress
- [ ] Language: TS / JS
- [ ] Pattern: POM / Screenplay / None
- [ ] Reporting: three toggles — Allure, HTML, Dot
- [ ] Dot toggle **disabled** + tooltip when framework ≠ WDIO
- [ ] CI: GitHub Actions / GitLab / None
- [ ] Linting: ESLint, Prettier toggles
- [ ] Env: dotenv toggle
- [ ] Validation: Zod toggle
- [ ] API testing: dropdown — None, Supertest, Axios, Playwright built-in
- [ ] Hide + disable `playwright-built-in` when framework ≠ Playwright
- [ ] All controls dispatch correct actions
- [ ] Sidebar scrolls on overflow

## Paths

- `src/components/sidebar/`
