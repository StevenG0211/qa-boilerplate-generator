# QA Boilerplate Generator — Phase 3 Planning

## Phase Summary

Phase 3 focuses on presets.

Presets let users apply a known-good configuration quickly, import a JSON file, and generate a scaffold from validated intent instead of manually toggling every option.

**Prerequisite:** Phase 2 dependency mapping is complete and stable.

## Product Goals

- provide curated official presets for common QA starter projects
- allow users to upload a JSON preset file
- validate imported presets before applying them
- keep presets semantic, not raw dependency lists
- make presets consume Phase 2 dependency groups
- prepare for community presets without requiring accounts

## Explicit Non-goals

- BDD presets
- raw package-list upload
- VS Code extension implementation
- accounts, cloud storage, or saved user profiles
- OpenAPI or test-code import
- marketplace publishing

The VS Code extension is now Phase 4. See [`docs/qa-boilerplate-generator-phase4.md`](./qa-boilerplate-generator-phase4.md).

## Preset Data Model

Presets should be versioned so the schema can evolve without breaking older files.

```ts
type PresetSchemaVersion = 1

type PresetSource = "official" | "community" | "uploaded"

type Preset = {
  schemaVersion: PresetSchemaVersion
  id: string
  name: string
  description: string
  source: PresetSource
  tags: string[]
  config: Config
  metadata?: {
    author?: string
    homepage?: string
    minGeneratorVersion?: string
  }
}
```

Rules:

- `config` is validated against the same business rules used by the UI.
- Presets cannot declare dependencies directly.
- Presets cannot enable BDD or Cucumber packages.
- Imported JSON must pass schema validation before it can update UI state.
- Unknown future fields are rejected until a migration path exists.

## JSON Import Flow

The upload flow should be designed for clarity and recovery:

1. User chooses a `.json` preset file.
2. App parses JSON in the browser.
3. App validates `schemaVersion`, required metadata, and `config`.
4. App checks framework option compatibility against the Phase 2 dependency manifest.
5. App shows a preview summary before applying.
6. User confirms and the preset replaces the current config.
7. Any manual change after applying marks the preset as customized.

Validation errors should be specific:

- invalid JSON
- unsupported schema version
- missing required fields
- unsupported framework option
- disallowed BDD/Cucumber option
- incompatible option combination

## Official Presets

Initial official presets should be conservative:

- `playwright-ts-pom`: Playwright, TypeScript, POM, built-in HTML, ESLint, Prettier
- `playwright-api-zod`: Playwright, TypeScript, no UI pattern, Playwright built-in API, Zod
- `wdio-ts-pom-allure`: WDIO, TypeScript, POM, Allure, Dot, ESLint, Prettier
- `wdio-api-axios`: WDIO, TypeScript, no UI pattern, Axios API helper
- `cypress-ts-pom-html`: Cypress, TypeScript, POM, HTML reporting
- `cypress-js-minimal`: Cypress, JavaScript, no optional integrations

No official preset should include BDD.

## Folder Structure

```text
presets/
  preset.schema.json
  official/
    playwright-ts-pom.json
    playwright-api-zod.json
    wdio-ts-pom-allure.json
    wdio-api-axios.json
    cypress-ts-pom-html.json
    cypress-js-minimal.json
  community/
    .gitkeep
```

Suggested source modules:

```text
src/presets/
  schema.ts
  validatePreset.ts
  officialPresets.ts
  applyPreset.ts
```

## UI Requirements

- Preset selector appears before the detailed sidebar controls.
- Official presets are visually distinct from imported presets.
- Imported presets show file name, preset name, source, framework, and tags before apply.
- A clear validation error panel appears when upload fails.
- Applying a preset replaces the full config.
- Manual edits after applying a preset mark it as customized.
- Users can clear the preset association without reverting current config.

## Tickets

### P3-001 — Preset Schema And Validation

**Type:** Feature  
**Priority:** P0

Acceptance criteria:

- [ ] `Preset` type is defined.
- [ ] JSON schema exists at `presets/preset.schema.json`.
- [ ] Validator rejects unknown schema versions.
- [ ] Validator rejects BDD/Cucumber options.
- [ ] Unit tests cover valid and invalid preset files.

### P3-002 — Official Preset Files

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P3-001

Acceptance criteria:

- [ ] Six conservative official presets are created.
- [ ] Every official preset validates against the schema.
- [ ] Presets use semantic config only, not direct dependencies.
- [ ] No preset includes BDD.

### P3-003 — Preset Application State

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P3-001

Acceptance criteria:

- [ ] `APPLY_PRESET` replaces the full config.
- [ ] Active preset metadata is tracked separately from config.
- [ ] Manual config edits mark the active preset as customized.
- [ ] Clearing preset metadata does not revert config values.

### P3-004 — JSON Upload And Validation UI

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P3-001, P3-003

Acceptance criteria:

- [ ] User can upload a `.json` preset file.
- [ ] Invalid JSON shows a clear error.
- [ ] Invalid preset schema shows field-level feedback where practical.
- [ ] Valid presets show a summary before apply.
- [ ] Upload works entirely client-side.

### P3-005 — Preset Selector UI

**Type:** Feature  
**Priority:** P1  
**Blocked by:** P3-002, P3-003

Acceptance criteria:

- [ ] Official preset cards render in the app.
- [ ] Imported preset card renders after successful upload.
- [ ] Framework, language, tags, and short description are visible.
- [ ] Selection updates the sidebar and preview immediately.
- [ ] UI remains accessible by keyboard and screen reader.

### P3-006 — Preset CI Validation

**Type:** DevOps  
**Priority:** P2  
**Blocked by:** P3-001, P3-002

Acceptance criteria:

- [ ] CI validates all preset JSON files.
- [ ] CI fails with clear error output for invalid presets.
- [ ] `CONTRIBUTING.md` documents community preset submission.

### P3-007 — Phase 3 Regression

**Type:** QA  
**Priority:** P2  
**Blocked by:** P3-004, P3-005

Acceptance criteria:

- [ ] All official presets generate expected project trees.
- [ ] Imported valid preset generates expected output.
- [ ] Invalid preset cases are covered.
- [ ] Existing manual configuration flow still works.

## Dependency Map

```text
P3-001 (schema + validation)
  ├── P3-002 (official presets)
  ├── P3-003 (application state)
  │   ├── P3-004 (JSON upload UI)
  │   └── P3-005 (preset selector UI)
  └── P3-006 (preset CI validation)

P3-004 + P3-005 -> P3-007 (regression)
```

## Success Criteria

Phase 3 is complete when users can pick an official preset or upload a valid JSON preset, apply it safely, customize it, and generate a project whose dependencies still resolve through the Phase 2 mapping.
