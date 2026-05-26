# P2-010 — Generated Install Notes And Dependency Caveats

**Type:** Docs  
**Priority:** P2  
**Blocked by:** P2-005, P2-006, P2-007

## Description

Generate clear setup notes for framework-specific dependency behavior so users understand what to run after downloading a scaffold.

## Implementation Steps

1. Define where generated setup notes should live in the scaffold, likely the generated `README.md`.
2. Add Playwright notes for browser installation.
3. Add WDIO notes for TypeScript runtime behavior and package family alignment.
4. Add Cypress notes for reporter support-file imports and plugin caveats.
5. Keep notes conditional so users only see guidance for enabled options.
6. Add tests for generated note content when the project tree includes a README.

## Acceptance Criteria

- [ ] Playwright scaffolds mention `npx playwright install`.
- [ ] WDIO TypeScript scaffolds mention the TypeScript runtime approach.
- [ ] Cypress reporter scaffolds explain required support-file/config wiring.
- [ ] Generated notes do not mention disabled integrations.
- [ ] Generated notes do not mention BDD or Cucumber in Phase 2.

## Notes

- Keep generated notes short. They should help users install and run, not become full framework documentation.
