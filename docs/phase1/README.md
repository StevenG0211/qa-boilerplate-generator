# Phase 1 — Ticket Archive

This folder preserves the original Phase 1 ticket breakdown as a reference archive now that the Phase 1 implementation exists.

## Stack (Phase 1)

Next.js · React Context + useReducer · JSZip · Vercel · WebdriverIO, Playwright, Cypress (no BDD).

## Source layout reference

```
src/
  app/                 # Next.js App Router
  components/
    sidebar/           # Config panel
    preview/           # File tree + code viewer
    ui/                # Shared primitives
  generator/           # Pure logic — no React
    frameworks/        # wdio.ts, playwright.ts, cypress.ts
    blocks/
    index.ts             # generateProject(config)
  context/               # Config state
  types/
  lib/                   # ZIP builder and shared helpers
```

## Ticket folders

| Folder | ID | Name | Depends on |
|--------|-----|------|------------|
| [tickets/001-project-scaffold](./tickets/001-project-scaffold/) | TICKET-001 | Project scaffold & repo | — |
| [tickets/002-config-types](./tickets/002-config-types/) | TICKET-002 | Config types & default state | 001 |
| [tickets/003-config-state](./tickets/003-config-state/) | TICKET-003 | Config context + useReducer | 002 |
| [tickets/004-generator-core](./tickets/004-generator-core/) | TICKET-004 | Generator entry & helpers | 002 |
| [tickets/005-wdio-templates](./tickets/005-wdio-templates/) | TICKET-005 | WebdriverIO templates | 004 |
| [tickets/006-playwright-templates](./tickets/006-playwright-templates/) | TICKET-006 | Playwright templates | 004 |
| [tickets/007-cypress-templates](./tickets/007-cypress-templates/) | TICKET-007 | Cypress templates | 004 |
| [tickets/008-sidebar-ui](./tickets/008-sidebar-ui/) | TICKET-008 | Sidebar (config panel) | 003 |
| [tickets/009-file-tree-preview](./tickets/009-file-tree-preview/) | TICKET-009 | File tree + code viewer | 004, 008 |
| [tickets/010-download-zip](./tickets/010-download-zip/) | TICKET-010 | ZIP download | 009 |
| [tickets/011-layout-shell](./tickets/011-layout-shell/) | TICKET-011 | Layout & responsive shell | 008, 009 |
| [tickets/012-vercel-deploy](./tickets/012-vercel-deploy/) | TICKET-012 | Vercel production | 011 |

## Dependency graph

```
001 scaffold
  └── 002 types ──┬── 003 state ──────────► 008 sidebar
                  └── 004 generator ──┬── 005 wdio
                                        ├── 006 playwright
                                        ├── 007 cypress
                                        └── 009 preview ──┬── 010 zip
                                                          └── 011 layout ──► 012 deploy
```

## Original implementation order

1. **001 → 002 → 003** (foundation chain)  
2. **004** in parallel with **003** after **002** (generator only needs types)  
3. **005–007** after **004** (can parallelize across engineers)  
4. **008** after **003**  
5. **009** after **004** + **008**  
6. **010** after **009**  
7. **011** after **008** + **009**  
8. **012** after **011**

The canonical business rules and type references remain in the parent [Phase 1 reference doc](../qa-boilerplate-generator-phase1.md). Phase 2 planning now lives in [`../qa-boilerplate-generator-phase2.md`](../qa-boilerplate-generator-phase2.md).
