import type { Config } from "@/types"
import { resolveDependencyManifest } from "./dependencyManifest"

export function generateReadme(config: Config): string {
  const manifest = resolveDependencyManifest(config)
  const setupNotes = manifest.notes.map((note) => `- ${note}`).join("\n")
  const scriptNotes = Object.keys(manifest.scripts)
    .map((script) => `- \`npm run ${script}\``)
    .join("\n")

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
`
}
