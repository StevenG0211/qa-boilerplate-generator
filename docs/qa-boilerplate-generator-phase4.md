# QA Boilerplate Generator — Phase 4 Planning

## Phase Summary

Phase 4 is the VS Code extension phase.

The extension should be planned after dependency mapping and presets are stable so it can reuse the same generator core, dependency manifest, and preset schema instead of creating a second implementation path.

## Prerequisites

- Phase 2 dependency manifest is implemented and tested.
- Phase 3 preset schema and JSON validation are implemented.
- Generator logic is stable enough to extract or share without changing behavior.

## Goals

- expose the generator inside VS Code
- allow users to apply official or imported presets
- write generated files directly into the open workspace
- reuse the same generator core used by the web app
- preserve dependency safety rules from Phase 2

## Non-goals

- defining new framework dependency behavior
- adding BDD or Cucumber generation
- inventing an extension-only preset format
- cloud accounts or preset sync
- supporting other editors

## Recommended Architecture

The extension should import a shared generator package. It should not call the deployed web app.

```text
packages/
  generator/
    src/
      generator/
      presets/
      dependency-manifest/

apps/
  web/
  vscode-extension/
    src/
      extension.ts
      wizard.ts
      fileWriter.ts
```

The exact monorepo tool can be decided when Phase 4 starts. A workspace split should happen only if the generator core is stable enough to justify the move.

## Extension Requirements

- command palette entry: `QA Gen: Generate Test Project`
- opens a wizard or quick-pick flow
- supports official presets from Phase 3
- supports imported JSON presets using the same validation code
- previews the generated file tree before writing
- writes files through the VS Code workspace API
- prompts before overwriting existing files
- shows clear success and failure messages

## Tickets

### P4-001 — Shared Generator Package Assessment

Confirm whether the generator should be extracted into a package before extension work starts.

Acceptance criteria:

- [ ] Current generator dependencies are audited.
- [ ] Extraction cost is documented.
- [ ] Web app build implications are documented.
- [ ] A go/no-go decision is made for package extraction.

### P4-002 — VS Code Extension Scaffold

Create the extension package and command entry point.

Acceptance criteria:

- [ ] Extension package is created.
- [ ] Command palette command is registered.
- [ ] Extension builds locally.
- [ ] Extension can import or call the shared generator code.

### P4-003 — Extension Wizard

Implement the configuration and preset flow inside VS Code.

Acceptance criteria:

- [ ] User can choose a framework manually.
- [ ] User can apply an official preset.
- [ ] User can import and validate a JSON preset.
- [ ] Preview updates before generation.

### P4-004 — Workspace File Writer

Write the generated project tree to the user's open workspace.

Acceptance criteria:

- [ ] Files are written with VS Code workspace APIs.
- [ ] Missing workspace folder is handled clearly.
- [ ] Existing files trigger an overwrite confirmation.
- [ ] Success and failure states are shown to the user.

### P4-005 — Packaging And Publishing

Package and publish the extension.

Acceptance criteria:

- [ ] Extension README is created.
- [ ] Extension icon and metadata are added.
- [ ] `.vsix` package can be produced locally.
- [ ] Marketplace publishing path is documented.

## Success Criteria

Phase 4 is complete when the VS Code extension can generate the same dependency-safe scaffolds as the web app, including official and imported presets, without duplicating generator logic.
