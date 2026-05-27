# VS Code Marketplace publishing

This document describes how to publish **QA Boilerplate Generator** from `apps/vscode-extension`.

## Prerequisites

1. [Visual Studio Marketplace publisher](https://marketplace.visualstudio.com/manage) account.
2. [Personal Access Token](https://dev.azure.com/) with **Marketplace → Manage** scope (Azure DevOps).
3. `vsce` installed (`npm i -g @vscode/vsce` or use the workspace devDependency).

## One-time setup

```bash
vsce login <publisher-id>
```

The extension `package.json` uses `"publisher": "qa-boilerplate-gen"`. Change this to your registered publisher ID before publishing.

## Pre-publish checklist

- [ ] Version bumped in `apps/vscode-extension/package.json`
- [ ] `npm run compile` succeeds at repo root (`npm install` first)
- [ ] `npm test` and `npm run validate:presets` pass
- [ ] `README.md` and `CHANGELOG.md` are accurate
- [ ] `media/icon.png` is 128×128 or 256×256 PNG
- [x] Repository URL in `package.json` `repository` field

## Build VSIX locally

```bash
cd apps/vscode-extension
npm run package
```

Output: `qa-boilerplate-generator-0.1.0.vsix` (name varies with `name` + `version`).

## Publish

```bash
cd apps/vscode-extension
vsce publish
```

Or upload the `.vsix` manually in the Marketplace management portal.

## CI note

Automated publish is **not** configured in GitHub Actions. Add a workflow with `VSCE_PAT` secret only when you want release automation.
