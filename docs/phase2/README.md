# Phase 2 — Ticket Breakdown

This folder collects the Phase 2 planning artifacts for dependency hardening, API templates, and generator composition. BDD work is intentionally removed from the active Phase 2 scope.

## Planning docs

- [Phase 2 scope](../qa-boilerplate-generator-phase2.md)
- [Framework dependency mapping](../dependency-mapping.md)
- [API template strategy](./api-template-strategy.md)
- [Template composition architecture](./template-architecture.md)
- [Ticket index](./tickets/README.md)

## Ticket list

| ID | Type | Name | Depends on |
| --- | --- | --- | --- |
| P2-001 | Docs | Phase 1 truth pass and README refresh | — |
| P2-002 | Docs | Phase 2 scope and framework positioning | P2-001 |
| P2-003 | Architecture | Generator template composition plan | P2-002 |
| P2-004 | Architecture | Dependency manifest and compatibility rules | P2-002 |
| P2-005 | Feature | Playwright dependency baseline and API templates | P2-004 |
| P2-006 | Feature | WDIO v9 dependency baseline and API templates | P2-004 |
| P2-007 | Feature | Cypress reporter dependency cleanup | P2-004 |
| P2-008 | Feature | Shared package generation refactor | P2-004 |
| P2-009 | Test | Dependency validation coverage | P2-005, P2-006, P2-007, P2-008 |
| P2-010 | Docs | Generated install notes and dependency caveats | P2-005, P2-006, P2-007 |

## Implementation-ready tickets

- [P2-001](./tickets/001-phase1-truth-pass.md) — Phase 1 truth pass and README refresh
- [P2-002](./tickets/002-phase2-scope.md) — Phase 2 scope and framework positioning
- [P2-003](./tickets/003-template-composition.md) — Generator template composition plan
- [P2-004](./tickets/004-dependency-manifest.md) — Dependency manifest and compatibility rules
- [P2-005](./tickets/005-playwright-api.md) — Playwright dependency baseline and API templates
- [P2-006](./tickets/006-wdio-api.md) — WDIO v9 dependency baseline and API templates
- [P2-007](./tickets/007-cypress-docs.md) — Cypress reporter dependency cleanup
- [P2-008](./tickets/008-package-generation.md) — Shared package generation refactor
- [P2-009](./tickets/009-dependency-validation.md) — Dependency validation coverage
- [P2-010](./tickets/010-install-notes.md) — Generated install notes and dependency caveats

## Ticket notes

### P2-001 — Phase 1 truth pass and README refresh

Purpose:
Bring historical docs in line with the current repo so Phase 2 starts from accurate references.

Acceptance focus:

- README links Phase 1, Phase 2, Phase 3, and Phase 4 docs
- Phase 1 reference matches current generated output
- archive docs no longer imply ZIP support is future work

### P2-002 — Phase 2 scope and framework positioning

Purpose:
Lock the Phase 2 narrative before implementation tickets branch out.

Acceptance focus:

- docs remove BDD from active scope
- Playwright, WDIO, and Cypress remain represented in the framework story
- dependency mapping is named as the core Phase 2 investment

### P2-003 — Generator template composition plan

Purpose:
Define how to break the current monolithic per-framework generators into reusable template parts.

Acceptance focus:

- identify reusable layers such as scaffold, reporting, API, CI, and pattern
- document recommended file/module boundaries before code changes begin

### P2-004 — Dependency manifest and compatibility rules

Purpose:
Create a central model for framework package groups, scripts, conflicts, and generated notes.

Acceptance focus:

- framework package choices are represented as compatibility groups
- TypeScript, reporting, API, and linting dependencies are grouped explicitly
- BDD/Cucumber packages are excluded from Phase 2 groups

### P2-005 — Playwright dependency baseline and API templates

Purpose:
Make Playwright the strongest native API template path while keeping package output minimal.

Acceptance focus:

- keep `@playwright/test` as the only required core dependency
- improve `playwright-built-in` templates
- generate a concrete example API spec
- document `npx playwright install`

### P2-006 — WDIO v9 dependency baseline and API templates

Purpose:
Update WDIO generation for v9 dependency expectations and turn API generation into a usable example flow.

Acceptance focus:

- use `tsx` for TypeScript runtime support
- keep `@wdio/*` packages aligned
- keep `axios` and `supertest` as explicit API choices
- do not add Cucumber packages

### P2-007 — Cypress reporter dependency cleanup

Purpose:
Make Cypress reporter output safer by handling package, config, and support-file wiring together.

Acceptance focus:

- prefer `allure-cypress` for Allure
- keep `cypress-mochawesome-reporter` for HTML reports
- add `cypress-on-fix` only for real event-hook composition needs
- avoid BDD preprocessors

### P2-008 — Shared package generation refactor

Purpose:
Move package generation toward the dependency manifest so presets can safely compose options later.

Acceptance focus:

- `generatePackageJson` consumes dependency groups
- package output remains deterministic
- existing framework defaults continue to generate valid package files

### P2-009 — Dependency validation coverage

Purpose:
Lock the dependency mapping with tests before Phase 3 presets depend on it.

Acceptance focus:

- tests cover representative Playwright, WDIO, and Cypress combinations
- tests assert absence of BDD/Cucumber packages
- tests cover TypeScript runtime dependency choices

### P2-010 — Generated install notes and dependency caveats

Purpose:
Generate clear setup notes for dependencies that need post-install commands or config caveats.

Acceptance focus:

- Playwright generated notes mention browser install
- Cypress generated notes mention reporter support-file imports when applicable
- WDIO generated notes mention TypeScript and framework package alignment

## Suggested execution order

1. P2-001 and P2-002
2. P2-003 and P2-004
3. P2-005, P2-006, and P2-007 in parallel
4. P2-008
5. P2-009
6. P2-010

## Parallel tracks

- Docs track: P2-001, P2-002, P2-010
- Architecture track: P2-003, P2-004, P2-008
- Framework dependency track: P2-005, P2-006, P2-007
- Validation track: P2-009
