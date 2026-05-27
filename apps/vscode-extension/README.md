# QA Boilerplate Generator — VS Code Extension

Generate Playwright, WebdriverIO, and Cypress test projects directly into your open workspace using the same `@qa-boilerplate/generator` core as the web app.

## Requirements

- VS Code 1.85+
- An open workspace folder

## Usage

1. Open a folder in VS Code (**File → Open Folder**).
2. Run **QA Gen: Generate Test Project** from the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
3. Choose an official preset, import a JSON preset, or configure options manually.
4. Review the file tree preview and confirm.
5. Files are written under `<workspace>/<projectName>/`. Existing files trigger an overwrite confirmation.

### Manual configure options

When you choose **Configure manually** (or **Customize settings** after a preset), the wizard prompts for:

- Project folder name
- Framework (Playwright, WebdriverIO v9, Cypress)
- Language (TypeScript, JavaScript)
- Test pattern (POM, Screenplay, None)
- CI provider (None, GitHub Actions, GitLab CI)
- ESLint and Prettier
- dotenv setup
- Zod validation helpers
- Reporting (Allure; HTML for Playwright/Cypress; dot for WDIO)
- API testing tool (None, Axios, Supertest, Playwright built-in when applicable)
- Testlio (requires Allure) and Mailinator integrations

## Development

From the repository root:

```bash
npm install
cd apps/vscode-extension
npm run compile
```

Press **F5** in VS Code with the extension folder open (or use a multi-root launch config pointing at `apps/vscode-extension`) to run the Extension Development Host.

| Script | Description |
| --- | --- |
| `npm run compile` | Bundle extension to `dist/extension.js` |
| `npm run watch` | Rebuild on source changes |
| `npm run typecheck` | TypeScript check |
| `npm run package` | Produce `.vsix` via `@vscode/vsce` |

Icon for Marketplace: `media/icon.png` should be 128×128 or 256×256 PNG (see [marketplace-publishing.md](../../docs/phase4/marketplace-publishing.md)).

## Package (.vsix)

```bash
cd apps/vscode-extension
npm run package
```

Install locally: **Extensions → … → Install from VSIX**.

## Marketplace publishing

See [Marketplace publishing](https://github.com/StevenG0211/qa-boilerplate-generator/blob/main/docs/phase4/marketplace-publishing.md) in the repository docs.

## Preset JSON

Official presets ship inside `@qa-boilerplate/generator`. Community presets follow the schema in `packages/generator/presets/preset.schema.json` (see root `CONTRIBUTING.md`).
