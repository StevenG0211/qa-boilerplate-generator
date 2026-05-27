# Changelog

All notable changes to the QA Boilerplate Generator VS Code extension are documented here.

## [0.1.0] - 2026-05-26

### Added

- Command Palette entry **QA Gen: Generate Test Project** (requires open workspace folder).
- Official preset picker (nine Playwright, WebdriverIO, and Cypress starters).
- JSON preset import with schema validation via `@qa-boilerplate/generator`.
- Manual configuration wizard (framework, language, pattern, CI, linting, dotenv, Zod, reporting, API tool, integrations).
- File tree preview before writing to workspace.
- Overwrite confirmation for existing files.
- Workspace file writer using VS Code `workspace.fs` APIs.

### Notes

- Marketplace publish is optional; see [marketplace-publishing.md](../../docs/phase4/marketplace-publishing.md).
- Icon: `media/icon.png` (128×128 or 256×256 PNG recommended for Marketplace).
