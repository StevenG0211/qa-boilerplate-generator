import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file } from "../nodes"

export function generateEnvNodes(config: Config): FileNode[] {
  if (!config.env.dotenv) {
    return []
  }

  const lines = [
    "# Copy to .env and adjust for your environment",
    "BASE_URL=http://localhost:3000",
    "BASEURL=http://localhost:3000",
    "API_BASE_URL=https://jsonplaceholder.typicode.com",
  ]

  if (config.integrations.mailinator) {
    lines.push(
      "",
      "MAILINATOR_API_TOKEN=your-mailinator-api-token",
      "MAILINATOR_DOMAIN=your-mailinator-domain",
    )
  }

  if (config.integrations.testlio && config.framework === "playwright") {
    lines.push(
      "",
      "PLAYWRIGHT_SERVICE_ACCESS_TOKEN=",
      "PLAYWRIGHT_SERVICE_URL=",
      "PLAYWRIGHT_SERVICE_RUN_ID=",
      "PLAYWRIGHT_SERVICE_OS=linux",
    )
  }

  return [
    file(".env.example", `${lines.join("\n")}\n`, "plaintext"),
  ]
}
