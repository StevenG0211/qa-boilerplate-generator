# P2-003 — Generator Template Composition Plan

**Type:** Architecture  
**Priority:** P1  
**Blocked by:** P2-002

## Description

Define how the current generator should be split into reusable template layers before more Phase 2 features are added.

## Implementation Steps

1. Audit `src/generator/frameworks/wdio.ts`, `src/generator/frameworks/playwright.ts`, and `src/generator/frameworks/cypress.ts`.
2. Identify which responsibilities belong to base scaffold, pattern, API, reporting, shared blocks, and dependency mapping.
3. Write the proposed layer boundaries in `docs/phase2/template-architecture.md`.
4. Propose a target module shape under `src/generator/templates/` or an equivalent structure.
5. Document file ownership rules so template layers do not overwrite each other.

## Acceptance Criteria

- [ ] The architecture note defines clear template layers.
- [ ] The proposed structure preserves one orchestration entry per framework.
- [ ] The design explains how dependency, API, and reporting logic can be extracted first.
- [ ] The design keeps BDD/Cucumber generation out of Phase 2.

## Notes

- This is intentionally a design ticket, not a refactor ticket.
