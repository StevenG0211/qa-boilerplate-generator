# Phase 2 — Ticket Index

Implementation-ready tickets for the dependency-first Phase 2 plan.

## Tickets

| File | ID | Name | Depends on |
| --- | --- | --- | --- |
| [001-phase1-truth-pass.md](./001-phase1-truth-pass.md) | P2-001 | Phase 1 truth pass and README refresh | — |
| [002-phase2-scope.md](./002-phase2-scope.md) | P2-002 | Phase 2 scope and framework positioning | P2-001 |
| [003-template-composition.md](./003-template-composition.md) | P2-003 | Generator template composition plan | P2-002 |
| [004-dependency-manifest.md](./004-dependency-manifest.md) | P2-004 | Dependency manifest and compatibility rules | P2-002, P2-003 |
| [005-playwright-api.md](./005-playwright-api.md) | P2-005 | Playwright dependency baseline and API templates | P2-004 |
| [006-wdio-api.md](./006-wdio-api.md) | P2-006 | WDIO v9 dependency baseline and API templates | P2-004 |
| [007-cypress-docs.md](./007-cypress-docs.md) | P2-007 | Cypress reporter dependency cleanup | P2-004 |
| [008-package-generation.md](./008-package-generation.md) | P2-008 | Shared package generation refactor | P2-004 |
| [009-dependency-validation.md](./009-dependency-validation.md) | P2-009 | Dependency validation coverage | P2-005, P2-006, P2-007, P2-008 |
| [010-install-notes.md](./010-install-notes.md) | P2-010 | Generated install notes and dependency caveats | P2-005, P2-006, P2-007 |

## Recommended order

1. P2-001
2. P2-002
3. P2-003 and P2-004
4. P2-005, P2-006, and P2-007 in parallel
5. P2-008
6. P2-009
7. P2-010

## Parallel tracks

- Docs track: P2-001, P2-002, P2-010
- Architecture track: P2-003, P2-004, P2-008
- Framework dependency track: P2-005, P2-006, P2-007
- Validation track: P2-009
