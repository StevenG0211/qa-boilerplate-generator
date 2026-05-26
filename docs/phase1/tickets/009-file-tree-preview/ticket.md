# TICKET-009 — File Tree Preview Panel

| Field | Value |
|--------|--------|
| **Type** | Feature |
| **Priority** | P1 |
| **Blocked by** | TICKET-004, TICKET-008 |

## Description

Right panel: read config → `generateProject(config)` → render `FileNode` tree + code viewer.

## Tasks

- [ ] Recursive render of `GeneratedProject.tree`
- [ ] Collapsible folders (default expanded)
- [ ] File click opens content in code viewer (below or beside tree)
- [ ] Syntax highlight using `language` on file nodes (`highlight.js` or `shiki`)
- [ ] Re-render on any config change
- [ ] Distinct file vs folder icons
- [ ] Root shows `package.json`
- [ ] Empty tree empty state (guard)

## Paths

- `src/components/preview/`
