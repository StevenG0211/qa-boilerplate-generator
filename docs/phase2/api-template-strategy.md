# Phase 2 — API Template Strategy

## Goal

Make API testing a first-class generated capability without pretending every framework should expose the same implementation pattern.

## Principles

- prefer native framework strengths over fake parity
- generate a useful starter, not a full test framework
- keep the generated API layer small enough to understand quickly
- separate transport adapters from test examples where possible

## Framework Priorities

### Playwright

Playwright should be the most opinionated API template path in Phase 2 because it already has a native request client.

Recommended direction:

- keep `playwright-built-in` as the primary API option
- generate a small API helper based on `APIRequestContext`
- add one example API spec that consumes the helper
- document how the helper can be reused from browser-driven suites and API-only suites

Suggested generated shape:

```text
tests/
  api/
    client.ts
    usersApi.ts
    users.spec.ts
```

Example responsibilities:

- `client.ts`: shared request wrapper and JSON helpers
- `usersApi.ts`: endpoint-specific helper functions
- `users.spec.ts`: a single example test that shows assertions and response parsing

### WebdriverIO

WDIO should support API templates, but it should not mimic Playwright's native request model.

Recommended direction:

- keep `supertest` and `axios` as explicit transport choices
- generate a small API module plus one example spec that imports it
- keep browser specs and API specs separate in the generated tree

Suggested generated shape:

```text
src/
  api/
    client.ts
    usersApi.ts
test/
  specs/
    smoke.ts
    api/
      users.api.ts
```

Why this shape:

- `src/api` stays reusable across spec styles
- `test/specs/api` makes it obvious that API tests are executable examples, not only helpers
- the API layer stays independent from any future runner-style research

### Cypress

Cypress stays in scope, but it should not define the shared API architecture for Phase 2.

Recommended direction:

- keep `axios` and `supertest` support documented
- avoid inventing a special Cypress-first abstraction
- align naming and folder conventions where it is cheap, but do not block WDIO and Playwright improvements on Cypress parity

## Shared API Concepts

Across frameworks, Phase 2 should standardize a few concepts even if file paths differ:

- a transport entry point
- an endpoint-focused helper module
- at least one generated example test
- environment variable guidance for `API_BASE_URL`

This gives users a recognizable mental model:

```text
transport -> domain helper -> example spec
```

## Recommended Config Direction

The existing `apiTesting.tool` field can remain, but Phase 2 docs should clarify intended semantics:

- `"playwright-built-in"`: Playwright-only, native request client
- `"supertest"`: Node-oriented API client path
- `"axios"`: lightweight HTTP client path
- `"none"`: no API starter generated

Phase 2 should avoid adding multiple new API config fields until the base template structure is stable.

## What To Generate In Phase 2

Minimum useful output for any enabled API option:

- one API client/helper file
- one endpoint-oriented helper file
- one example test/spec file
- one note or inline comment showing where `API_BASE_URL` comes from

## Deferred Work

Keep these out of the first Phase 2 pass:

- schema-driven API codegen
- OpenAPI import workflows
- auth/session bootstrapping for multiple API roles
- advanced fixtures or test data factories
- cross-framework contract testing abstractions

## Success Criteria

The API strategy is successful if:

- Playwright users get a clearly stronger native API starter
- WDIO users get executable API examples instead of only a stub
- Cypress remains supported without distorting the design
- ticket writing can describe API work in concrete, generator-friendly terms
