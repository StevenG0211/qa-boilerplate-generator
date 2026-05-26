# TICKET-004 — Generator Core & Entry Point

| Field | Value |
|--------|--------|
| **Type** | Feature |
| **Priority** | P0 |
| **Blocked by** | TICKET-002 |

## Description

`generateProject(config)` returns `GeneratedProject`. Entry + shared helpers; framework-specific templates come in 005–007.

## Tasks

- [ ] Export `generateProject(config: Config): GeneratedProject` from `src/generator/index.ts`
- [ ] Return non-empty `tree` + correct `projectName`
- [ ] Root always includes `package.json` file node
- [ ] `generatePackageJson(config)` — deps and scripts per framework (stub/minimal until 005–007 fill in)
- [ ] Helpers: `file(name, content, language)`, `folder(name, children)`
- [ ] **Pure module**: no React, context, or UI imports
- [ ] Unit tests: `package.json` deps/scripts per framework

## Notes

Framework branches can delegate to `generator/frameworks/*` in later tickets.
