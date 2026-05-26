# TICKET-010 — Download as ZIP

| Field | Value |
|--------|--------|
| **Type** | Feature |
| **Priority** | P1 |
| **Blocked by** | TICKET-009 |

## Description

JSZip: `FileNode` tree → `{projectName}.zip` download.

## Tasks

- [ ] Add `jszip` dependency
- [ ] `src/lib/zipBuilder.ts`: `buildZip(project: GeneratedProject): Promise<Blob>`
- [ ] Recursively mirror folders/files in zip
- [ ] Download button: trigger blob save as `{projectName}.zip`
- [ ] Manual QA: extract each framework, `npm install` succeeds
- [ ] Loading state disables button during generation
- [ ] Button label: `Download {projectName}.zip`
