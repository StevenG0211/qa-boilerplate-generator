# P2-008 — Shared Package Generation Refactor

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P2-004

## Description

Refactor package generation so `generatePackageJson` resolves dependencies from the framework dependency manifest instead of owning framework-specific package knowledge directly.

## Implementation Steps

1. Introduce a manifest module under `src/generator` for framework dependency groups.
2. Move framework core dependencies into the manifest.
3. Move TypeScript, reporting, API, env, validation, and linting dependency groups into the manifest or adjacent helpers.
4. Keep package output deterministic when multiple groups are enabled.
5. Preserve existing public `generatePackageJson(config)` behavior.
6. Add tests for representative dependency combinations.

## Acceptance Criteria

- [ ] Package generation consumes dependency groups from a central manifest.
- [ ] Existing framework defaults still generate valid package files.
- [ ] Option toggles merge dependency groups without duplicate or stale packages.
- [ ] BDD/Cucumber dependencies are not produced by any Phase 2 option.
- [ ] Tests cover Playwright, WDIO, and Cypress package output.

## Notes

- This ticket should avoid changing generated file trees unless a dependency group requires matching config or support-file wiring.
