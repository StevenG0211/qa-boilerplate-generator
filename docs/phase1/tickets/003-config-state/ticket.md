# TICKET-003 — Config State (Context + useReducer)

| Field | Value |
|--------|--------|
| **Type** | Foundation |
| **Priority** | P0 |
| **Blocked by** | TICKET-002 |

## Description

Global config state: sidebar → generator/preview. No UI in this ticket.

## Tasks

- [ ] `ConfigContext` in `src/context/ConfigContext.tsx`
- [ ] `useReducer` with typed actions: `SET_PROJECT_NAME`, `SET_FRAMEWORK`, `SET_LANGUAGE`, `SET_PATTERN`, `SET_REPORTING`, `SET_CI`, `SET_LINTING`, `SET_ENV`, `SET_VALIDATION`, `SET_API_TESTING`, `RESET`
- [ ] `useConfig()` hook — throws outside provider
- [ ] Wrap app in provider in `src/app/layout.tsx`
- [ ] Initial state = `defaultConfig`
- [ ] `RESET` restores defaults
- [ ] Verify via DevTools or temporary debug readout

## Reference

- Actions should map 1:1 to `Config` fields and nested objects
