import type { Config } from "@/types"

export const defaultConfig: Config = {
  projectName: "my-test-project",
  framework: "playwright",
  language: "ts",
  pattern: "pom",
  reporting: { allure: true, html: false, dot: false },
  ci: { provider: "none" },
  linting: { eslint: true, prettier: true },
  env: { dotenv: true },
  validation: { zod: false },
  apiTesting: { tool: "none" },
}
