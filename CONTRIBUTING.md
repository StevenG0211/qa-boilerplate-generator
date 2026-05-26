# Contributing

Thank you for contributing to the QA Boilerplate Generator.

## Preset submissions

Community presets live under `presets/community/`. Presets must be **semantic configuration only** — they describe generator intent, not raw dependency lists.

### Requirements

1. **Schema version** — Use `schemaVersion: 1` (see `presets/preset.schema.json`).
2. **Semantic config** — The `config` object must match the generator `Config` shape. Do not add `dependencies`, package lists, or BDD/Cucumber options.
3. **Validation** — Every preset must pass Zod validation in `src/presets/validatePreset.ts`.
4. **Testlio rule** — If `integrations.testlio` is `true`, `reporting.allure` must also be `true`.
5. **Framework rules** — Dot reporting is WDIO-only; Playwright built-in API is Playwright-only.

### Local validation

```bash
npm test -- src/presets/validatePreset.test.ts
npm run typecheck
```

To validate a single JSON file during development, import it in a Vitest case or run the full preset test suite above.

### Pull request checklist

- [ ] Preset JSON validates against `presets/preset.schema.json`
- [ ] `npm test`, `npm run typecheck`, and `npm run lint` pass
- [ ] Preset generates a sensible project tree (smoke-check in the web UI or via `generateProject`)
- [ ] Description and tags are accurate
- [ ] No BDD/Cucumber packages or options

## Generator changes

- Keep `src/generator` free of React imports.
- Add new packages through `src/generator/dependencyManifest.ts`, not inline in templates.
- Add Vitest coverage for new generator behavior in `src/generator/*.test.ts`.

## Code style

Follow existing ESLint and Prettier configuration:

```bash
npm run lint
npm run format:check
```
