# P2-006 — WDIO v9 Dependency Baseline And API Templates

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P2-004

## Description

Update WDIO generation for the v9 ecosystem and turn API generation into a usable example flow rather than only a client stub.

## Implementation Steps

1. Review the current WDIO package output in `src/generator/packageJson.ts`.
2. Replace stale `ts-node` TypeScript runtime assumptions with `tsx`.
3. Keep `@wdio/*` packages aligned as a compatibility group.
4. Keep Mocha as the generated framework default.
5. Keep `supertest` and `axios` as explicit API transport choices.
6. Add a generated endpoint helper under `src/api/`.
7. Add a generated API example spec under `test/specs/api/`.
8. Add or update generator tests for dependency output, `supertest`, `axios`, TS, and JS outputs.

## Acceptance Criteria

- [ ] WDIO API generation produces reusable helpers under `src/api/`.
- [ ] WDIO API generation produces at least one example API spec under the WDIO test tree.
- [ ] WDIO TypeScript output uses `tsx`, not `ts-node`.
- [ ] WDIO package output keeps `@wdio/*` packages aligned.
- [ ] `supertest` and `axios` remain supported as explicit choices.
- [ ] Generated output does not include Cucumber or BDD dependencies.
- [ ] Unit tests cover the new API template structure.

## Verification

- Generate WDIO projects for both API tools and confirm the file tree contains helpers plus an executable example spec.
- Generate WDIO TypeScript package output and confirm it includes `tsx` and excludes `ts-node` and Cucumber packages.
