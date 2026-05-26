# P2-002 — Phase 2 Scope And Framework Positioning

**Type:** Docs  
**Priority:** P0  
**Blocked by:** P2-001

## Description

Lock the Phase 2 product story before implementation begins. This ticket defines the authoritative scope for Phase 2 and removes BDD from the active roadmap.

## Implementation Steps

1. Review the current generator behavior for WDIO, Playwright, and Cypress.
2. Write the Phase 2 narrative in `docs/qa-boilerplate-generator-phase2.md`.
3. Explicitly state that BDD is out of scope for Phase 2.
4. Clarify the role of Playwright, WDIO, and Cypress in the dependency-hardening plan.
5. List the main parallel workstreams and success criteria.

## Acceptance Criteria

- [ ] The Phase 2 scope doc clearly states that BDD is not part of Phase 2.
- [ ] The doc explains why Playwright, WDIO, and Cypress still matter in the framework matrix.
- [ ] Dependency mapping is identified as the primary Phase 2 investment area.
- [ ] Obsolete BDD tickets and references are removed or retired.

## Notes

- This ticket is the source of truth for later implementation tickets.
- Do not introduce new code changes here beyond doc alignment.
