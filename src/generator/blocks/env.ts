import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file } from "../nodes"

export function generateEnvNodes(config: Config): FileNode[] {
  if (!config.env.dotenv) {
    return []
  }
  return [
    file(
      ".env.example",
      `# Copy to .env and adjust for your environment
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000
`,
      "plaintext",
    ),
  ]
}
