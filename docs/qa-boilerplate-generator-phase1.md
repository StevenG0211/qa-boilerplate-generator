# QA Boilerplate Generator — Phase 1 Reference

## Project Summary

A browser-based wizard for QA engineers to scaffold test automation projects block by block.
The user configures a project via a side panel and sees a live file tree re-render in real time.
The final output is a downloadable `.zip` with a ready-to-run project structure.

**Stack:** Next.js · React Context + useReducer · JSZip · Vercel  
**Phase scope:** WebdriverIO, Playwright, Cypress — no BDD layer yet

## Status

Phase 1 is implemented. This document now serves as a reference snapshot of the shipped Phase 1 scope, business rules, and original ticket structure. The ticket checklists below are preserved as implementation history, but a few lines have been updated so the doc matches the current codebase.

---

## Config Type Reference

```ts
type Config = {
  projectName: string
  framework: "wdio" | "playwright" | "cypress"
  language: "ts" | "js"
  pattern: "pom" | "screenplay" | "none"
  reporting: { allure: boolean; html: boolean; dot: boolean }
  ci: { provider: "github" | "gitlab" | "none" }
  linting: { eslint: boolean; prettier: boolean }
  env: { dotenv: boolean }
  validation: { zod: boolean }
  apiTesting: { tool: "supertest" | "axios" | "playwright-built-in" | "none" }
}
```

**Default config:**

```ts
{
  projectName: "my-test-project",
  framework: "playwright",
  language: "ts",
  pattern: "pom",
  reporting: { allure: true, html: false, dot: false },
  ci: { provider: "none" },
  linting: { eslint: true, prettier: true },
  env: { dotenv: true },
  validation: { zod: false },
  apiTesting: { tool: "none" }
}
```

---

## File Tree Data Model Reference

```ts
type FileNode =
  | { kind: "file"; name: string; content: string; language: string }
  | { kind: "folder"; name: string; children: FileNode[] }

type GeneratedProject = {
  projectName: string
  tree: FileNode[]
}
```

---

## Business Rules (Generator Layer — Not UI)

| Rule | Detail |
|---|---|
| `dot` reporter | Only generated for WDIO |
| `html` reporter | WDIO → `wdio-html-nice-reporter` (`html-nice`) · Playwright → built-in HTML reporter · Cypress → `cypress-mochawesome-reporter` |
| `playwright-built-in` API tool | Only valid when `framework === "playwright"` |
| `supertest` | Default suggestion for WDIO and Cypress |
| ESLint + Prettier together | Generator adds prettier plugin to `.eslintrc` to prevent rule conflicts |
| Screenplay pattern | Generates `actors/` `tasks/` `questions/` folders only — no stub files in Phase 1 |
| Zod | Always generates a fixture schema example AND an API response schema example |

---

## Folder Structure

```
/src
  /app                  → Next.js app router
  /components
    /sidebar            → Config panel UI
    /preview            → File tree + code viewer
    /ui                 → Shared primitives (buttons, toggles, etc.)
  /generator            → Pure generation logic — zero React
    /frameworks         → `wdio.ts`, `playwright.ts`, `cypress.ts`
    /blocks             → Per-feature generators (reporting, ci, linting, api, zod)
    index.ts            → Entry point: generateProject(config) → GeneratedProject
  /context              → Config state, useReducer, action types
  /types                → Shared TS types (Config, FileNode, GeneratedProject)
  /lib                  → ZIP builder, syntax highlighting, and shared utilities
```

---

## Tickets

---

### TICKET-001 — Project Scaffold & Repository Setup

**Type:** Setup  
**Priority:** P0 — must be done first  
**Blocked by:** Nothing

**Description:**  
Initialize the Next.js project with all agreed tooling configured and ready for feature development.

**Acceptance Criteria:**
- [ ] Next.js app created with App Router enabled
- [ ] TypeScript configured (`strict: true`)
- [ ] ESLint + Prettier configured and passing on empty project
- [ ] Tailwind CSS installed and configured
- [ ] Folder structure matches the spec above (`/generator`, `/components`, `/context`, `/types`, `/lib`)
- [ ] `README.md` includes local dev instructions (`npm install` + `npm run dev`)
- [ ] Project runs locally on `localhost:3000` with no errors
- [ ] Deployed to Vercel and accessible via preview URL

**Notes:**  
Historical note: this ticket was originally structure only. The current repository includes JSZip and generation dependencies because later Phase 1 tickets have been completed.

---

### TICKET-002 — Config Types & Default State

**Type:** Foundation  
**Priority:** P0  
**Blocked by:** TICKET-001

**Description:**  
Define all shared TypeScript types and the default config constant. This is the contract every other ticket depends on.

**Acceptance Criteria:**
- [ ] `/src/types/config.ts` exports all types: `Framework`, `Language`, `Pattern`, `CIProvider`, `APITool`, `ReportingConfig`, `CIConfig`, `LintingConfig`, `EnvConfig`, `ValidationConfig`, `APITestingConfig`, `Config`
- [ ] `/src/types/fileTree.ts` exports `FileNode` and `GeneratedProject`
- [ ] `/src/types/index.ts` re-exports everything from one entry point
- [ ] `defaultConfig` constant exported from `/src/context/defaultConfig.ts`
- [ ] No logic in this ticket — types and constants only
- [ ] All types pass TypeScript strict mode with zero errors

**Notes:**  
Every other ticket imports from `/src/types`. Do not duplicate type definitions elsewhere.

---

### TICKET-003 — Config State (Context + useReducer)

**Type:** Foundation  
**Priority:** P0  
**Blocked by:** TICKET-002

**Description:**  
Implement the global config state that flows from the sidebar into the generator and preview.

**Acceptance Criteria:**
- [ ] `ConfigContext` created in `/src/context/ConfigContext.tsx`
- [ ] `useReducer` manages state with typed actions for every config field
- [ ] Action types defined for: `SET_PROJECT_NAME`, `SET_FRAMEWORK`, `SET_LANGUAGE`, `SET_PATTERN`, `SET_REPORTING`, `SET_CI`, `SET_LINTING`, `SET_ENV`, `SET_VALIDATION`, `SET_API_TESTING`
- [ ] `useConfig()` custom hook exported — throws if used outside provider
- [ ] Provider wraps the app in `/src/app/layout.tsx`
- [ ] Default state matches `defaultConfig`
- [ ] Resetting to defaults works via a `RESET` action

**Notes:**  
No UI in this ticket. State management only. Can be verified via React DevTools or a temporary debug display.

---

### TICKET-004 — Generator Core & Entry Point

**Type:** Feature  
**Priority:** P0  
**Blocked by:** TICKET-002

**Description:**  
Build the main generator entry point. `generateProject(config)` must return a valid `GeneratedProject` tree. This ticket covers the entry point and shared helpers — not individual framework templates.

**Acceptance Criteria:**
- [ ] `generateProject(config: Config): GeneratedProject` exported from `/src/generator/index.ts`
- [ ] Returns a valid `GeneratedProject` with `projectName` and a non-empty `tree`
- [ ] `package.json` file node always present in the tree root
- [ ] `generatePackageJson(config)` helper returns correct dependencies and scripts per framework
- [ ] File node helper `file(name, content, language)` utility created for clean DRY usage
- [ ] Folder node helper `folder(name, children)` utility created
- [ ] Unit tests cover: correct `package.json` deps per framework, correct scripts per framework

**Notes:**  
Generator must be pure — no imports from React, context, or components. Input in, output out.

---

### TICKET-005 — WebdriverIO Template Generator

**Type:** Feature  
**Priority:** P1  
**Blocked by:** TICKET-004

**Description:**  
Implement all file generation logic for WebdriverIO projects.

**Acceptance Criteria:**
- [ ] `wdio.conf.ts` / `wdio.conf.js` generated correctly
- [ ] `tsconfig.json` generated when `language === "ts"`
- [ ] POM pattern generates `src/pages/LoginPage.ts` (or `.js`) with correct WDIO selectors
- [ ] Screenplay pattern generates `src/actors/`, `src/tasks/`, `src/questions/` folders (no stub files)
- [ ] Allure reporter config injected into `wdio.conf` when enabled
- [ ] Dot reporter config injected when enabled
- [ ] HTML reporter config injected when enabled (uses `wdio-html-nice-reporter`)
- [ ] Supertest added to `package.json` and a stub `src/api/apiClient.ts` generated when API testing is enabled
- [ ] Axios added to `package.json` and stub generated when selected
- [ ] `.env.example` generated when `env.dotenv === true`
- [ ] Zod added to `package.json` and `src/schemas/` folder with fixture + response schema examples when enabled
- [ ] GitHub Actions `.github/workflows/test.yml` generated when `ci.provider === "github"`
- [ ] GitLab `.gitlab-ci.yml` generated when `ci.provider === "gitlab"`
- [ ] ESLint config generated when enabled (includes prettier plugin if both are enabled)
- [ ] Prettier config generated when enabled
- [ ] Unit tests cover all flag combinations for WDIO

---

### TICKET-006 — Playwright Template Generator

**Type:** Feature  
**Priority:** P1  
**Blocked by:** TICKET-004

**Description:**  
Implement all file generation logic for Playwright projects.

**Acceptance Criteria:**
- [ ] `playwright.config.ts` / `playwright.config.js` generated correctly
- [ ] `tsconfig.json` generated when `language === "ts"`
- [ ] POM pattern generates `tests/pages/LoginPage.ts` with Playwright `Locator` types
- [ ] Screenplay pattern generates `src/actors/`, `src/tasks/`, `src/questions/` folders
- [ ] Allure reporter config injected into `playwright.config` when enabled
- [ ] HTML reporter config injected when enabled (Playwright built-in)
- [ ] `playwright-built-in` API tool generates a stub `tests/api/apiClient.ts` using `request` context
- [ ] Supertest and Axios behave same as WDIO ticket when selected
- [ ] `.env.example` generated when `env.dotenv === true`
- [ ] Zod schema examples generated when enabled
- [ ] GitHub Actions and GitLab CI configs generated correctly (Playwright-specific: includes `npx playwright install`)
- [ ] ESLint + Prettier configs generated when enabled
- [ ] Unit tests cover all flag combinations for Playwright

---

### TICKET-007 — Cypress Template Generator

**Type:** Feature  
**Priority:** P1  
**Blocked by:** TICKET-004

**Description:**  
Implement all file generation logic for Cypress projects.

**Acceptance Criteria:**
- [ ] `cypress.config.ts` / `cypress.config.js` generated correctly
- [ ] `tsconfig.json` generated when `language === "ts"`
- [ ] POM pattern generates `cypress/pages/LoginPage.ts`
- [ ] Screenplay pattern generates folder stubs
- [ ] Allure reporter config added via `@shelex/cypress-allure-plugin` when enabled
- [ ] Mochawesome added when HTML reporter is enabled
- [ ] Supertest stub generated for API testing when selected
- [ ] Axios stub generated when selected
- [ ] `.env.example` generated when enabled
- [ ] Zod schema examples generated when enabled
- [ ] CI configs generated correctly
- [ ] ESLint + Prettier configs generated when enabled
- [ ] Unit tests cover all flag combinations for Cypress

---

### TICKET-008 — Sidebar UI (Config Panel)

**Type:** Feature  
**Priority:** P1  
**Blocked by:** TICKET-003

**Description:**  
Build the left-panel configuration sidebar. This component only reads and dispatches to the config context — it contains zero generation logic.

**Acceptance Criteria:**
- [ ] Framework selector renders as segmented control (`WDIO` / `PW` / `Cy` labels in the current UI)
- [ ] Language toggle renders as segmented control (TypeScript / JavaScript)
- [ ] Pattern selector renders as segmented control (POM / Screenplay / None)
- [ ] Reporting section renders three independent toggles (Allure, HTML, Dot)
- [ ] Dot reporter toggle is disabled (grayed out with tooltip) when framework is not WDIO
- [ ] CI selector renders as dropdown or segmented control (GitHub Actions / GitLab CI / None)
- [ ] Linting section renders two independent toggles (ESLint / Prettier)
- [ ] Env config renders as single toggle (dotenv)
- [ ] Zod renders as single toggle
- [ ] API testing renders as dropdown (None / Supertest / Axios / Playwright built-in)
- [ ] `playwright-built-in` option disabled and hidden when framework is not Playwright
- [ ] Project name renders as a text input at the top of the sidebar
- [ ] All controls dispatch the correct action to `ConfigContext` on change
- [ ] Sidebar is scrollable if content overflows viewport height

**Notes:**  
No generation calls from this component. The sidebar is purely a config dispatcher.

---

### TICKET-009 — File Tree Preview Panel

**Type:** Feature  
**Priority:** P1  
**Blocked by:** TICKET-004, TICKET-008

**Description:**  
Build the right-panel preview. It reads the current config from context, calls `generateProject(config)` on every render, and displays the resulting `FileNode` tree.

**Acceptance Criteria:**
- [ ] File tree renders recursively from `GeneratedProject.tree`
- [ ] Folders are collapsible/expandable (expanded by default)
- [ ] Clicking a file opens its content in a code viewer panel below or beside the tree
- [ ] Code viewer displays syntax-highlighted content using the `language` field on the file node
- [ ] A suitable syntax highlighting library is used (e.g. `highlight.js` or `shiki`)
- [ ] Tree re-renders immediately when any config option is changed in the sidebar
- [ ] File and folder icons are visually distinct
- [ ] `package.json` is always visible at the root level
- [ ] Empty state shown if `tree` is empty (should not occur in normal use)

---

### TICKET-010 — Download as ZIP

**Type:** Feature  
**Priority:** P1  
**Blocked by:** TICKET-009

**Description:**  
Implement the download button that packages the generated file tree into a `.zip` and triggers a browser download.

**Acceptance Criteria:**
- [ ] JSZip installed as a dependency
- [ ] `buildZip(project: GeneratedProject): Promise<Blob>` helper created in `/src/lib/zipBuilder.ts`
- [ ] Helper recursively walks the `FileNode` tree and replicates folder structure in the zip
- [ ] Download button triggers `buildZip` and downloads the result as `{projectName}.zip`
- [ ] Zip contents verified manually: `npm install` runs without errors on the extracted project for all three frameworks
- [ ] Button is disabled while zip is being generated (loading state)
- [ ] Button exposes the project filename via accessible label/title and shows a loading label while generating

---

### TICKET-011 — Layout & App Shell

**Type:** Feature  
**Priority:** P1  
**Blocked by:** TICKET-008, TICKET-009

**Description:**  
Wire together the sidebar, preview panel, and download button into the final split-panel layout.

**Acceptance Criteria:**
- [ ] Split-panel layout: sidebar fixed width on the left, preview panel fills remaining width
- [ ] Layout is responsive — sidebar collapses to a drawer on mobile viewports
- [ ] Download button visible in a top bar or sticky footer
- [ ] App title and minimal branding present in the header
- [ ] Page title and meta description set correctly in `layout.tsx`
- [ ] No layout shift when switching frameworks or toggling blocks
- [ ] Lighthouse accessibility score ≥ 85 on the main page

---

### TICKET-012 — Deployment to Vercel

**Type:** DevOps  
**Priority:** P2  
**Blocked by:** TICKET-011

**Description:**  
Configure and verify production deployment.

**Acceptance Criteria:**
- [ ] Project connected to Vercel via GitHub integration
- [ ] Production deployment succeeds on merge to `main`
- [ ] Preview deployments created automatically on pull requests
- [ ] Environment variables documented (none required in Phase 1, but pattern established)
- [ ] Custom domain configured if available (optional for Phase 1)
- [ ] Build passes with zero TypeScript errors and zero ESLint warnings

---

## Dependency Map

```
TICKET-001 (scaffold)
    └── TICKET-002 (types)
            └── TICKET-003 (state)        → TICKET-008 (sidebar UI)
            └── TICKET-004 (generator)    → TICKET-005 (wdio templates)
                                          → TICKET-006 (playwright templates)
                                          → TICKET-007 (cypress templates)
                                          → TICKET-009 (preview panel)
                                                  └── TICKET-010 (zip download)
                                                  └── TICKET-011 (layout)
                                                          └── TICKET-012 (deploy)
```

---

## Out of Scope — Phase 1

The following are explicitly deferred to later phases and should not be built here:

- BDD / Cucumber support (removed from the active roadmap)
- Dependency mapping and compatibility hardening (Phase 2)
- Preset configurations and JSON import (Phase 3)
- VS Code Extension wrapper (Phase 4)
- User accounts or saved configs
- Dark/light mode toggle
- Multiple simultaneous projects
