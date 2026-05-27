# @qa-boilerplate/generator

Pure TypeScript package that generates test automation project scaffolds for Playwright, WebdriverIO, and Cypress. No React or VS Code dependencies — safe to run in Node, Vitest, Next.js (via `transpilePackages`), and the VS Code extension host.

## Install (monorepo)

This package is private and consumed via npm workspaces:

```json
{
  "dependencies": {
    "@qa-boilerplate/generator": "*"
  }
}
```

Run `npm install` from the repository root.

## Public API

### Generation

```typescript
import { generateProject } from "@qa-boilerplate/generator"

const project = generateProject(config)
// project.projectName: string
// project.tree: FileNode[] — virtual file tree (folders + files with content)
```

Also exported: `file`, `folder`, `generatePackageJson`, `resolveDependencyManifest`.

### Presets

```typescript
import {
  officialPresets,
  parsePresetJson,
  validatePreset,
  configSchema,
  presetSchema,
  PRESET_SCHEMA_VERSION,
} from "@qa-boilerplate/generator"
```

- **`officialPresets`** — nine curated presets (Playwright, WDIO, Cypress).
- **`parsePresetJson(json)`** — parse and validate a preset file; returns `{ success, preset }` or `{ success: false, errors }`.
- **`validatePreset(preset)`** — validate a preset object in memory.

Official preset JSON files: `packages/generator/presets/official/`.  
JSON Schema: `packages/generator/presets/preset.schema.json`.

### Types

```typescript
import type {
  Config,
  FileNode,
  GeneratedProject,
  Framework,
  Language,
  Pattern,
  CIConfig,
  CIProvider,
  LintingConfig,
  EnvConfig,
  ValidationConfig,
  ReportingConfig,
  APITestingConfig,
  APITool,
  IntegrationsConfig,
  Preset,
  PresetConfig,
  PresetSource,
  PresetValidationError,
  PresetValidationResult,
  ResolvedDependencyManifest,
} from "@qa-boilerplate/generator"
```

`Config` is the single input to `generateProject`. It drives framework choice, reporting, CI, linting, dotenv, Zod validation, API templates, and Testlio/Mailinator integrations.

## Consumers

| Consumer | Path | How it imports |
| --- | --- | --- |
| Web wizard | `apps/web` | Workspace dependency + `transpilePackages` in `next.config.ts` |
| VS Code extension | `apps/vscode-extension` | Workspace dependency; bundled by esbuild |

Both call the same `generateProject` and preset validation code — no duplicate generator logic.

## Scripts (package)

```bash
npm run typecheck -w @qa-boilerplate/generator
npm run test -w @qa-boilerplate/generator
```

From repo root: `npm test` runs generator and web tests.

## Package exports

Defined in `package.json`:

- `"."` → `./src/index.ts` (main entry)
- `"./presets"` → `./src/presets/index.ts`

## Rules

- Testlio integration requires Allure reporting (`reporting.allure: true`).
- Generated `package.json` dependencies come from `dependencyManifest.ts` compatibility groups, not ad-hoc strings.
- Presets are semantic config only — not raw dependency lists.
