# P2-005 — Playwright Dependency Baseline And API Templates

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P2-004

## Description

Make Playwright the strongest native API template path while keeping its generated dependency set minimal and native-first.

## Implementation Steps

1. Review the current Playwright package output in `src/generator/packageJson.ts`.
2. Keep `@playwright/test` as the only required core dependency.
3. Keep built-in HTML reporting as a config option, not an extra package.
4. Use `allure-playwright` only when Allure is selected.
5. Change the generated API output from a single stub to a small API module set.
6. Add a generated example API spec under `tests/api/`.
7. Document `npx playwright install` in generated notes.
8. Add or update generator tests to cover package output and API files.

## Acceptance Criteria

- [ ] Playwright API generation produces a transport helper and an endpoint-oriented helper.
- [ ] Playwright API generation produces at least one example API spec.
- [ ] `playwright-built-in` remains Playwright-only and remains the recommended native path.
- [ ] Playwright HTML reporting does not add unnecessary packages.
- [ ] Playwright Allure reporting adds only the documented Allure package group.
- [ ] Generated files work for both TypeScript and JavaScript output modes.
- [ ] Unit tests cover dependency output and the new API template structure.

## Verification

- Generate a Playwright project with API testing enabled and confirm the file tree contains the expected `tests/api/` structure.
- Generate Playwright package output with and without Allure and confirm dependencies match `docs/dependency-mapping.md`.
