import type { Config } from "@/types"
import { resolveDependencyManifest } from "./dependencyManifest"

export function generateReadme(config: Config): string {
  const manifest = resolveDependencyManifest(config)
  const setupNotes = manifest.notes.map((note) => `- ${note}`).join("\n")
  const scriptNotes = Object.keys(manifest.scripts)
    .map((script) => `- \`npm run ${script}\``)
    .join("\n")

  const integrationSections: string[] = []

  if (config.integrations.testlio) {
    integrationSections.push(`## Testlio Integration

- Allure results are written to \`allure-results/\` for upload to the Testlio platform.
- Update \`testlio-cli/project-config.json\` with your project identifiers before running Testlio CLI workflows.
- Generate a local Allure report with \`npm run allure:generate\` and open it with \`npm run allure:open\`.
`)
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
