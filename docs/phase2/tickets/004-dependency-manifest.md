# P2-004 — Dependency Manifest And Compatibility Rules

**Type:** Architecture  
**Priority:** P0  
**Blocked by:** P2-002, P2-003

## Description

Create a central dependency manifest that maps framework choices to package groups, scripts, compatibility notes, and known conflicts.

## Implementation Steps

1. Define the dependency group shape for core, TypeScript, reporting, API, linting, and generated notes.
2. Move framework package knowledge out of ad hoc merge logic and into explicit manifest data.
3. Document package-family alignment rules for WDIO, Playwright, and Cypress.
4. Define conflict rules for reporter/plugin combinations, especially Cypress event hooks.
5. Exclude BDD/Cucumber packages from every Phase 2 dependency group.
6. Add unit tests that prove dependency groups resolve deterministically.

## Acceptance Criteria

- [ ] A framework dependency manifest type exists.
- [ ] Package generation can resolve dependencies from the manifest.
- [ ] The manifest captures core, TypeScript, reporting, API, and linting groups.
- [ ] BDD/Cucumber packages are absent from Phase 2 package output.
- [ ] Known reporter/plugin caveats are represented as notes or conflict metadata.

## Notes

- This ticket is the foundation for Phase 3 presets. Presets should compose stable option groups instead of hardcoding package lists.
