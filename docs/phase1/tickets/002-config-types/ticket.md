# TICKET-002 — Config Types & Default State

| Field | Value |
|--------|--------|
| **Type** | Foundation |
| **Priority** | P0 |
| **Blocked by** | TICKET-001 |

## Description

Shared TypeScript types and `defaultConfig` — contract for the rest of Phase 1.

## Tasks

- [ ] `src/types/config.ts`: `Framework`, `Language`, `Pattern`, `CIProvider`, `APITool`, `ReportingConfig`, `CIConfig`, `LintingConfig`, `EnvConfig`, `ValidationConfig`, `APITestingConfig`, `Config`
- [ ] `src/types/fileTree.ts`: `FileNode`, `GeneratedProject`
- [ ] `src/types/index.ts` re-exports all types
- [ ] `src/context/defaultConfig.ts`: export `defaultConfig` matching spec defaults
- [ ] No business logic — types and constants only
- [ ] `tsc --noEmit` strict clean

## Spec defaults (verify)

- `projectName`: `"my-test-project"`
- `framework`: `playwright`
- `language`: `ts`
- `pattern`: `pom`
- `reporting`: allure true, html false, dot false
- `ci.provider`: `none`
- `linting`: eslint true, prettier true
- `env.dotenv`: true
- `validation.zod`: false
- `apiTesting.tool`: `none`
