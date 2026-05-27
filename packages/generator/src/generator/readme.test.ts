import { describe, expect, it } from "vitest"
import type { Config } from "@/types"
import { generateReadme } from "./readme"

const baseConfig: Config = {
  projectName: "demo",
  framework: "playwright",
  language: "ts",
  pattern: "pom",
  reporting: { allure: true, html: false, dot: false },
  ci: { provider: "none" },
  linting: { eslint: true, prettier: true },
  env: { dotenv: true },
  validation: { zod: false },
  apiTesting: { tool: "none" },
  integrations: { testlio: true, mailinator: false },
}

describe("generateReadme", () => {
  it("documents Cypress Testlio Allure hooks instead of Playwright fixtures", () => {
    const readme = generateReadme({
      ...baseConfig,
      framework: "cypress",
      reporting: { allure: true, html: true, dot: false },
    })

    expect(readme).toContain("cypress/support/allure-hooks.ts")
    expect(readme).toContain("not Playwright-style `lib/helpers-fixtures.ts`")
    expect(readme).not.toContain("playwright.service.config.ts")
  })

  it("documents Playwright service config manual enablement for Testlio", () => {
    const readme = generateReadme({
      ...baseConfig,
      framework: "playwright",
    })

    expect(readme).toContain("playwright.service.config.ts")
    expect(readme).toContain("PLAYWRIGHT_SERVICE_*")
    expect(readme).toContain(
      "npx playwright test -c playwright.service.config.ts",
    )
  })
})
