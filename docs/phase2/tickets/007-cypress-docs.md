# P2-007 — Cypress Reporter Dependency Cleanup

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P2-004

## Description

Make Cypress reporter output safer by treating package selection, config wiring, support-file imports, and plugin event hooks as one dependency group.

## Implementation Steps

1. Review the current Cypress package output in `src/generator/packageJson.ts`.
2. Replace old Allure plugin assumptions with the preferred `allure-cypress` path.
3. Keep `cypress-mochawesome-reporter` as the HTML reporter path.
4. Ensure generated config and support files include required imports and setup calls.
5. Add `cypress-on-fix` only if generated combinations require multiple event handlers.
6. Align docs so Cypress remains supported without implying BDD support.
7. Add generator tests for Cypress reporting combinations.

## Acceptance Criteria

- [ ] Cypress Allure output uses the documented `allure-cypress` dependency path.
- [ ] Cypress HTML output uses `cypress-mochawesome-reporter`.
- [ ] Support-file wiring expectations are implemented and documented.
- [ ] Event-hook conflict handling is explicit when multiple plugins are selected.
- [ ] Cypress output includes no BDD preprocessors.

## Notes

- Cypress plugin combinations should be validated by generated package and config tests before new reporter options are added.
