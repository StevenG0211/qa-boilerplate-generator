import type { Config } from "@/types"
import { resolveDependencyManifest } from "./dependencyManifest"

function buildTestlioSection(config: Config): string {
  const lines = [
    "- Allure results are written to `allure-results/` for upload to the Testlio platform.",
    "- Update `testlio-cli/project-config.json` with your project identifiers before running Testlio CLI workflows.",
    "- Generate a local Allure report with `npm run allure:generate` and open it with `npm run allure:open`.",
  ]

  if (config.framework === "cypress") {
    lines.push(
      "- Cypress wires Allure through `cypress/support/allure-hooks.ts` (imported from `cypress/support/e2e.ts`), not Playwright-style `lib/helpers-fixtures.ts`.",
      "- Failure screenshots attach via hooks; there is no shared fixture layer like Playwright POM presets.",
    )
  }

  if (config.framework === "playwright") {
    lines.push(
      "- `playwright.service.config.ts` is an Azure Playwright Testing stub at the project root. Set `PLAYWRIGHT_SERVICE_*` in `.env` (see `.env.example`) before use.",
      "- Run service-mode tests manually: `npx playwright test -c playwright.service.config.ts`.",
    )
  }

  return `## Testlio Integration

${lines.join("\n")}
`
}

export function generateReadme(config: Config): string {
  const manifest = resolveDependencyManifest(config)
  const setupNotes = manifest.notes.map((note) => `- ${note}`).join("\n")
  const scriptNotes = Object.keys(manifest.scripts)
    .map((script) => `- \`npm run ${script}\``)
    .join("\n")

  const integrationSections: string[] = []

  if (config.integrations.testlio) {
    integrationSections.push(buildTestlioSection(config))
  }

  if (config.integrations.mailinator) {
    integrationSections.push(`## Mailinator Integration

- Configure \`MAILINATOR_API_TOKEN\` and \`MAILINATOR_DOMAIN\` in \`.env\`.
- Use \`lib/mailinator-provider\` to poll inboxes during email verification flows.
`)
  }

  if (config.apiTesting.tool !== "none") {
    integrationSections.push(`## API Testing

Generated API modules follow a transport → domain helper → example spec pattern.
Set \`API_BASE_URL\` in \`.env\` when testing against a local or staging API.
`)
  }

  return `# ${config.projectName}

Generated QA test project.

## Install

\`\`\`bash
npm install
\`\`\`

## Run

${scriptNotes}

## Setup Notes

${setupNotes || "- No additional setup notes for this configuration."}

${integrationSections.join("\n")}
`
}
