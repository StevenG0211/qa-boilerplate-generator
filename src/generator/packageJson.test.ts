import { describe, expect, it } from "vitest"
import type { Config } from "@/types"
import { generatePackageJson } from "./packageJson"

function baseConfig(overrides: Partial<Config> = {}): Config {
  return {
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
    ...overrides,
  }
}

describe("generatePackageJson", () => {
  it("includes Playwright scripts and deps", () => {
    const raw = generatePackageJson(baseConfig({ framework: "playwright" }))
    const pkg = JSON.parse(raw) as {
      scripts: Record<string, string>
      devDependencies: Record<string, string>
    }
    expect(pkg.scripts.test).toBe("playwright test")
    expect(pkg.scripts["test:ui"]).toBe("playwright test --ui")
    expect(pkg.devDependencies["@playwright/test"]).toBeDefined()
    expect(pkg.devDependencies.typescript).toBeDefined()
  })

  it("omits TypeScript for Playwright JavaScript projects", () => {
    const raw = generatePackageJson(
      baseConfig({ framework: "playwright", language: "js" }),
    )
    const pkg = JSON.parse(raw) as { devDependencies: Record<string, string> }
    expect(pkg.devDependencies["@playwright/test"]).toBeDefined()
    expect(pkg.devDependencies.typescript).toBeUndefined()
  })

  it("includes WDIO scripts and deps", () => {
    const raw = generatePackageJson(baseConfig({ framework: "wdio" }))
    const pkg = JSON.parse(raw) as {
      scripts: Record<string, string>
      devDependencies: Record<string, string>
    }
    expect(pkg.scripts.wdio).toContain("wdio run")
    expect(pkg.scripts.wdio).toContain("wdio.conf.ts")
    expect(pkg.devDependencies["@wdio/cli"]).toBeDefined()
    expect(pkg.devDependencies.webdriverio).toBeDefined()
  })

  it("uses wdio.conf.js for WDIO JavaScript projects", () => {
    const raw = generatePackageJson(
      baseConfig({ framework: "wdio", language: "js" }),
    )
    const pkg = JSON.parse(raw) as { scripts: Record<string, string> }
    expect(pkg.scripts.wdio).toContain("wdio.conf.js")
  })

  it("adds wdio-html-nice-reporter when WDIO HTML reporting is enabled", () => {
    const raw = generatePackageJson(
      baseConfig({
        framework: "wdio",
        reporting: { allure: false, html: true, dot: false },
      }),
    )
    const pkg = JSON.parse(raw) as { devDependencies: Record<string, string> }
    expect(pkg.devDependencies["wdio-html-nice-reporter"]).toBeDefined()
  })

  it("includes Cypress scripts and deps", () => {
    const raw = generatePackageJson(baseConfig({ framework: "cypress" }))
    const pkg = JSON.parse(raw) as {
      scripts: Record<string, string>
      devDependencies: Record<string, string>
    }
    expect(pkg.scripts.cypress).toBe("cypress open")
    expect(pkg.scripts["cypress:run"]).toBe("cypress run")
    expect(pkg.devDependencies.cypress).toBeDefined()
  })

  it("uses project name from config", () => {
    const raw = generatePackageJson(
      baseConfig({ projectName: "acme-tests", framework: "cypress" }),
    )
    const pkg = JSON.parse(raw) as { name: string }
    expect(pkg.name).toBe("acme-tests")
  })

  it("includes serialize-javascript override for WDIO projects", () => {
    const raw = generatePackageJson(baseConfig({ framework: "wdio" }))
    const pkg = JSON.parse(raw) as {
      overrides?: Record<string, Record<string, string>>
    }
    expect(pkg.overrides).toEqual({
      mocha: { "serialize-javascript": ">=7.0.5" },
    })
  })

  it("does not include overrides for Playwright projects", () => {
    const raw = generatePackageJson(baseConfig({ framework: "playwright" }))
    const pkg = JSON.parse(raw) as {
      overrides?: Record<string, Record<string, string>>
    }
    expect(pkg.overrides).toBeUndefined()
  })

  it("adds cypress-mochawesome-reporter without standalone mochawesome when Cypress HTML reporting is enabled", () => {
    const raw = generatePackageJson(
      baseConfig({
        framework: "cypress",
        reporting: { allure: false, html: true, dot: false },
      }),
    )
    const pkg = JSON.parse(raw) as { devDependencies: Record<string, string> }
    expect(pkg.devDependencies["cypress-mochawesome-reporter"]).toBeDefined()
    expect(pkg.devDependencies.mochawesome).toBeUndefined()
  })

  it("does not include overrides for Cypress projects", () => {
    const raw = generatePackageJson(baseConfig({ framework: "cypress" }))
    const pkg = JSON.parse(raw) as {
      overrides?: Record<string, Record<string, string>>
    }
    expect(pkg.overrides).toBeUndefined()
  })
})
