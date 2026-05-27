# Phase 4 — VS Code Extension

Phase 4 adds a VS Code extension that reuses `@qa-boilerplate/generator` — the same core as the web wizard — to scaffold test projects directly into an open workspace folder.

## Planning docs

- [Phase 4 scope](../qa-boilerplate-generator-phase4.md)
- [Shared package assessment](./shared-package-assessment.md)
- [Marketplace publishing](./marketplace-publishing.md)
- [Extension smoke test checklist](./extension-smoke-test.md)

## Ticket status

| ID | Name | Status |
| --- | --- | --- |
| P4-001 | Shared generator package assessment | Done |
| P4-002 | VS Code extension scaffold | Done |
| P4-003 | Extension wizard | Done |
| P4-004 | Workspace file writer | Done |
| P4-005 | Packaging and publishing | Done except marketplace publish (documented, not executed) |

## Monorepo layout

```text
packages/generator/     @qa-boilerplate/generator — generateProject, presets, types
apps/web/               Next.js wizard (ZIP download)
apps/vscode-extension/  qa-boilerplate-generator — Command Palette entry
scripts/                validate-presets.ts
docs/                   Roadmap and phase docs
```

## Local development

From the repository root:

```bash
npm install
npm run dev                    # web app @ http://localhost:3000
npm run compile:extension      # bundle VS Code extension (esbuild)
```

**Extension Development Host:** open `apps/vscode-extension` in VS Code and press **F5**.

**Package `.vsix` locally:**

```bash
cd apps/vscode-extension
npm run package
```

Install via **Extensions → … → Install from VSIX**.

## Deploy (web app on Vercel)

The hosted wizard lives in `apps/web`. No `vercel.json` is required when Vercel is configured as follows:

1. Connect the GitHub repository in [Vercel](https://vercel.com/new).
2. Set **Root Directory** to `apps/web`.
3. **Install Command:** `npm ci` (Vercel runs this from the repo root when npm workspaces are detected; leave default if auto-detected).
4. **Build Command:** `npm run build` (from repo root via workspace script) or `cd ../.. && npm run build` if the build cwd is `apps/web`.
5. **Output:** Next.js default (`.next`).

No environment variables are required for the hosted wizard. Preview deployments are created for pull requests when Git integration is enabled.

## Quality gates

Run before handoff or release:

```bash
npm run typecheck
npm run lint
npm run validate:presets
npm test
npm run build
npm run compile:extension
```

CI runs the same steps plus `compile:extension` (see `.github/workflows/ci.yml`).

## Known build warnings

When running `npm run build` locally in an npm workspaces monorepo, Next.js may log harmless warnings such as:

- **ENOWORKSPACES** — npm workspace resolution noise during Next.js dependency patching; build still succeeds.
- **pnpm registry references** — upstream Next.js lockfile metadata; this repo uses npm, not pnpm.
- **SWC binary patch** — Next.js may attempt to patch optional platform packages; CI uses Linux and passes without extra config.

If `npm run build` fails in CI, check `apps/web/next.config.ts` (`transpilePackages: ["@qa-boilerplate/generator"]`) and ensure install runs at the repo root.

## Deferred items

| Item | Reason |
| --- | --- |
| Marketplace publish (`vsce publish`) | Optional; documented in [marketplace-publishing.md](./marketplace-publishing.md) |
| `@vscode/test-electron` automated tests | Manual smoke checklist covers acceptance; add when setup cost is justified |
| Side Bar view / commands | Out of scope for Phase 4 |
| First-run Walkthrough | Out of scope unless trivial |
| P2-003 monolithic framework decomposition | Separate architecture ticket |
| Community preset gallery in extension | Future enhancement |
| Full ConfigSidebar browser E2E | Web app scope |
| Phase 5 / other editors | Future roadmap |

## Phase 4 product completion

Phase 4 is **product-complete** when:

- The extension runs locally (F5) and produces a `.vsix` via `npm run package`.
- CI validates extension typecheck and esbuild compile.
- Manual wizard, official presets, and JSON import match web generator behavior.
- Marketplace publish remains optional and documented, not executed.
