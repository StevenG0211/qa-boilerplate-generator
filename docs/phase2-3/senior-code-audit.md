# Phase 2/3 Senior Code Audit

Audit date: 2026-05-26  
Last updated: 2026-05-26  
Scope: Phase 2/3 closeout (API templates, Testlio integrations, presets, CI)

## Executive summary

Phase 2/3 closeout items are complete. Critical generator wiring, preset validation CLI, expanded test matrix (JS API paths, all nine official preset smokes), generated README notes for Cypress Testlio and Playwright service config, and component-level preset UI tests are in place. **Ready for Phase 4 kickoff (P4-001 extraction)** pending green CI. Remaining intentional debt: P2-003 framework composition refactor and optional full `ConfigSidebar` browser E2E for radiogroup keyboard navigation.

---

## Critical gaps

### 1. Generated integration helpers are orphaned — **RESOLVED**

| File | Resolution |
|------|------------|
| `lib/helpers-fixtures.ts` (Playwright) | Smoke spec imports `../lib/helpers-fixtures` when Allure/Testlio lib is generated (non-POM) |
| `lib/page-object-fixtures.ts` | POM smoke spec imports `../lib/page-object-fixtures` and uses `loginPage` fixture |
| `lib/hooks.ts` (WDIO) | Smoke spec calls `registerFailureHooks()` at load time |
| `cypress/support/allure-hooks.ts` | Imported from `cypress/support/e2e.ts` when Allure/Testlio lib is generated |

Verified in `src/generator/index.test.ts` under `integration helper wiring`.

### 2. UI state: framework switch does not sanitize integrations — **RESOLVED**

`SET_FRAMEWORK` now clears `integrations.testlio` when `reporting.allure` is false (mirrors `SET_REPORTING` behavior).

---

## High-priority gaps

### 3. Test coverage vs plan acceptance criteria — **RESOLVED**

| Planned | Status |
|---------|--------|
| Playwright API × built-in, axios, supertest (TS) | Covered in `API template matrix` |
| Playwright API × JS | Covered in `API template matrix (JavaScript)` |
| WDIO API × axios, supertest (TS + JS) | Covered |
| Cypress API axios (TS + JS) | Covered |
| All 9 official presets tree assertions | Covered in `Official preset smoke trees` |
| Testlio presets per framework | Covered via preset smoke map (Playwright, WDIO, Cypress Testlio presets) |

### 4. Duplicate tag sources (UI) — **RESOLVED**

- Three-section card layout: title → description → tags
- Semantic pill styling via `PresetTag` (neutral vs accent for `testlio`, `mailinator`, `allure`)
- No duplicate integration badges beyond JSON `tags[]`

### 5. `allure-js-commons` dependency timing — **RESOLVED**

Added to Playwright Allure reporting group in `dependencyManifest.ts` (not only Testlio bundle).

---

## Medium-priority gaps

### 6. P2-003 template composition deferred

Framework files remain monolithic aside from `blocks/api` and `blocks/integrations`.

### 7. Cypress Testlio path incomplete — **RESOLVED**

Cypress uses `allure-hooks` in support file but lacks Playwright-style `helpers-fixtures` layer. Generated README documents the parity gap when Testlio + Cypress is enabled (`src/generator/readme.ts`).

### 8. No dedicated preset validation script — **RESOLVED**

`scripts/validate-presets.ts` validates all JSON under `presets/official/` and `presets/community/`. CI runs `npm run validate:presets`.

### 9. P3-007 regression incomplete — **PARTIALLY RESOLVED**

Component tests cover `PresetCard` radio/keyboard activation, `PresetTag` accent styling, and `ConfigProvider` `APPLY_PRESET` + active preset metadata (`*.test.tsx` with Vitest jsdom). Full `ConfigSidebar` radiogroup Arrow/Home/End navigation and browser E2E remain optional follow-up.

### 10. `playwright.service.config.ts` is a stub — **RESOLVED**

Generated stub unchanged. Generated README documents manual enablement (`PLAYWRIGHT_SERVICE_*`, `npx playwright test -c playwright.service.config.ts`) when Playwright + Testlio is enabled.

---

## Low-priority / acceptable debt

| Item | Notes |
|------|--------|
| Mailinator provider in JS projects | JS branch exists |
| `mergeFileNodes` collision risk | Low today |
| Community presets folder | `.gitkeep` only |
| Reference zip in repo root | Gitignored |
| ConfigSidebar radiogroup E2E | Deferred; component tests satisfy minimum P3-007 |

---

## Security & constraints check

- No BDD/Cucumber packages in manifest — pass
- Presets semantic-only — pass
- `src/generator` React-free — pass
- Testlio requires Allure in schema — pass
- WDIO uses `tsx` not `ts-node` — pass

---

## Recommended follow-up order

1. ~~Wire integration helpers~~ (done)
2. ~~Fix `allure-js-commons` manifest~~ (done)
3. ~~Sanitize `integrations.testlio` on framework change~~ (done)
4. ~~Expand API + preset tree test matrix~~ (done — TS + JS API paths, all 9 preset smokes)
5. P2-003 composition refactor when adding next framework features
6. Optional: `ConfigSidebar` integration test for radiogroup arrow/home/end navigation

---

## Related docs

- [P4-001 Shared package assessment](../phase4/shared-package-assessment.md)
- [API template strategy](../phase2/api-template-strategy.md)
- [Phase 3 plan](../qa-boilerplate-generator-phase3.md)
