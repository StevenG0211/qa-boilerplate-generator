# P4-001 — Shared Generator Package Assessment

## Purpose

Evaluate extracting the generator core into a shared package before the VS Code extension (Phase 4) to avoid duplicating logic.

## Current layout

| Area | Path | React coupling |
|------|------|----------------|
| Generator | `src/generator/` | None |
| Presets | `src/presets/` | None |
| Types | `src/types/` | None |
| UI | `src/components/`, `src/context/` | Yes |
| App | `src/app/` | Yes |

The generator and preset validation modules are already isolated from React. The web app imports them via `@/*` path alias.

## Dependencies audit

Generator runtime dependencies (via generated output, not direct imports):

- Pure TypeScript — no Node-only APIs in generator code
- Zod — used by `src/presets/schema.ts`
- Vitest — test-only

The generator does **not** depend on Next.js, React, or browser APIs. It is safe to run in Node (tests) and could run in a VS Code extension host.

## Extraction options

### Option A — npm workspace monorepo (recommended after Phase 2/3 green)

```text
packages/
  generator/          # generateProject, dependencyManifest, presets
apps/
  web/                # Next.js UI
  vscode-extension/   # Phase 4
```

**Pros:** Single source of truth, shared tests, semver for extension.  
**Cons:** One-time migration cost; Next.js alias and import path updates.

**Files to move:**

- `src/generator/**`
- `src/presets/**`
- `src/types/config.ts`, `src/types/fileTree.ts`
- `presets/official/**`, `presets/preset.schema.json`
- Associated Vitest files

### Option B — Copy generator into extension repo

**Pros:** Fastest to ship extension.  
**Cons:** Two implementations drift; violates Phase 4 non-goals.

### Option C — Publish `@qa-boilerplate/generator` to npm

Same as Option A with public/private registry publish step.

## Web app impact (Option A)

- Replace `@/generator` imports with `@qa-boilerplate/generator` or workspace protocol
- Update `tsconfig.json` paths and Vitest config
- Bundle size: generator is small; tree-shaking should keep client bundle impact minimal if only used from client components that already import it
- Consider moving generation to a Route Handler or server action if extension parity needs identical server-side execution (optional)

## Test strategy after extraction

- Move `src/generator/*.test.ts` and `src/presets/*.test.ts` into the package
- Root CI runs `npm test` via workspace scripts
- Preset JSON validation remains in CI (already covered by `validatePreset.test.ts`)

## Recommendation

**Go** on package extraction at the start of Phase 4, not during Phase 2/3 closeout.

Rationale:

1. Phase 2/3 closeout adds integrations and API layers — stabilizing these in-repo first reduces migration churn.
2. Generator is already React-free; extraction is mechanical once APIs freeze.
3. VS Code extension should import a package, not duplicate strings from `playwright.ts` / `wdio.ts`.

## Extraction checklist (Phase 4 kickoff)

- [ ] Create `packages/generator` with `package.json` (`main`, `types`, `exports`)
- [ ] Move generator + presets + shared types
- [ ] Configure Turborepo or npm workspaces
- [ ] Update web app imports and Vitest paths
- [ ] Verify `npm test`, `npm run build` in both packages
- [ ] Document extension consumption in Phase 4 tickets

## Technical debt notes (Phase 2/3 closeout)

See [Senior code audit (Phase 2/3)](../phase2-3/senior-code-audit.md) for the full gap analysis.

| Item | Severity | Follow-up |
|------|----------|-----------|
| Framework generators still monolithic (`playwright.ts`, `wdio.ts`, `cypress.ts`) | Medium | P2-003 full template composition when adding CI/API blocks per framework |
| API + integration blocks merged via `mergeFileNodes` | Low | Acceptable; watch for folder name collisions |
| Mailinator provider TS-only content in JS projects | Low | Add JS template branch if JS + mailinator becomes common |
| Testlio lib helpers vary by framework (fixtures vs hooks) | Low | Document in generated README; unify in Phase 4 if extension needs parity |
| `playwright.service.config.ts` stub not wired to npm script | Low | Intentional placeholder; users enable manually |
