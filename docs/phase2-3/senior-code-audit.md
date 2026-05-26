# Phase 2/3 Senior Code Audit

Audit date: 2026-05-26  
Last updated: 2026-05-26  
Scope: Phase 2/3 closeout (API templates, Testlio integrations, presets, CI)

## Executive summary

Phase 2/3 closeout items are largely complete. Critical generator wiring gaps and preset tag styling have been addressed. Remaining work is mostly test-matrix expansion for JS variants and medium-priority deferrals (P2-003 composition, dedicated preset validation script).

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

### 3. Test coverage vs plan acceptance criteria — **PARTIALLY RESOLVED**

| Planned | Status |
|---------|--------|
| Playwright API × built-in, axios, supertest (TS) | Covered in `API template matrix` |
| Playwright API × JS | Not yet covered |
| WDIO API × axios, supertest (TS) | Covered |
| Cypress API axios | Covered |
| All 9 official presets tree assertions | Generic validate + generate; Testlio presets have dedicated paths test |
| Testlio presets per framework | Covered in `Testlio official presets` |

**Remaining:** Add JS language variants to API matrix if JS API output becomes common.

### 4. Duplicate tag sources (UI) — **RESOLVED**

- Three-section card layout: title → description → tags
- Semantic pill styling via `PresetTag` (neutral vs accent for `testlio`, `mailinator`, `allure`)
- No duplicate integration badges beyond JSON `tags[]`

### 5. `allure-js-commons` dependency timing — **RESOLVED**

Added to Playwright Allure reporting group in `dependencyManifest.ts` (not only Testlio bundle).

---

## Medium-priority gaps (open)

### 6. P2-003 template composition deferred

Framework files remain monolithic aside from `blocks/api` and `blocks/integrations`.

### 7. Cypress Testlio path incomplete

Cypress uses `allure-hooks` in support file but lacks Playwright-style `helpers-fixtures` layer. Intentionally lighter; document in generated README if users ask for parity.

### 8. No dedicated preset validation script

CI relies on `validatePreset.test.ts`. Optional `scripts/validate-presets.ts` not added.

### 9. P3-007 regression incomplete

No browser E2E or component tests for preset card keyboard selection.

### 10. `playwright.service.config.ts` is a stub

Generated but not referenced by npm scripts. Acceptable placeholder.

---

## Low-priority / acceptable debt

| Item | Notes |
|------|--------|
| Mailinator provider in JS projects | JS branch exists |
| `mergeFileNodes` collision risk | Low today |
| Community presets folder | `.gitkeep` only |
| Reference zip in repo root | Gitignored |

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
4. ~~Expand API + preset tree test matrix~~ (partial — JS variants optional)
5. P2-003 composition refactor when adding next framework features

---

## Related docs

- [P4-001 Shared package assessment](../phase4/shared-package-assessment.md)
- [API template strategy](../phase2/api-template-strategy.md)
- [Phase 3 plan](../qa-boilerplate-generator-phase3.md)
