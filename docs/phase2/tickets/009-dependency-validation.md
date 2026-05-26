# P2-009 — Dependency Validation Coverage

**Type:** Test  
**Priority:** P1  
**Blocked by:** P2-005, P2-006, P2-007, P2-008

## Description

Add regression coverage that proves generated dependency groups remain compatible and intentionally scoped.

## Implementation Steps

1. Add package output tests for minimal and fully optioned Playwright projects.
2. Add package output tests for WDIO TypeScript and JavaScript projects.
3. Add package output tests for Cypress reporter combinations.
4. Assert that BDD/Cucumber packages are absent in all Phase 2 combinations.
5. Assert that stale TypeScript runtime packages are absent where the framework has moved on.
6. Add generated config/support-file assertions for reporter combinations that require wiring.

## Acceptance Criteria

- [ ] Playwright package tests cover native API and Allure combinations.
- [ ] WDIO package tests cover TypeScript runtime dependencies and reporter combinations.
- [ ] Cypress package tests cover HTML, Allure, and combined reporting combinations.
- [ ] Tests fail if Cucumber or BDD packages are introduced accidentally.
- [ ] Tests fail if package output includes known stale dependencies.

## Verification

- Run `npm test`.
- Run `npm run typecheck` if dependency manifest types are introduced.
