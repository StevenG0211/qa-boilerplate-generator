# TICKET-001 — Project Scaffold & Repository Setup

| Field | Value |
|--------|--------|
| **Type** | Setup |
| **Priority** | P0 — first |
| **Blocked by** | Nothing |

## Description

Initialize the Next.js project with tooling and empty folder structure ready for feature work.

## Tasks

- [ ] Create Next.js app with App Router
- [ ] TypeScript: `strict: true`
- [ ] ESLint + Prettier configured; clean run on empty project
- [ ] Tailwind CSS installed and wired
- [ ] Create spec folders: `generator/` (with `frameworks/wdio`, `playwright`, `cypress`, `blocks/`), `components/sidebar`, `preview`, `ui`, `context`, `types`, `lib`
- [ ] `README.md`: `npm install`, `npm run dev`
- [ ] Verify `localhost:3000` with no errors
- [ ] Deploy to Vercel; capture preview URL
- [ ] **Do not** add JSZip or generation deps yet (structure only)

## Reference paths

- App Router: `src/app/`
- Placeholder files or `.gitkeep` as needed so empty dirs are tracked
