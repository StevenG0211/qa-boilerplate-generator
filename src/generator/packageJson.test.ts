import { describe, expect, it } from "vitest"
import type { Config } from "@/types"
import { generatePackageJson } from "./packageJson"

type GeneratedPackageJson = {
  name: string
  scripts: Record<string, string>
  devDependencies: Record<string, string>
  overrides?: Record<string, Record<string, string>>
}

const forbiddenPhase2Packages = [
  "@wdio/cucumber-framework",
  "@badeball/cypress-cucumber-preprocessor",
  "@cucumber/cucumber",
  "cucumber",
]

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
    integrations: { testlio: false, mailinator: false },
    ...overrides,
  }
}

function parsePackage(config: Config): GeneratedPackageJson {
  return JSON.parse(generatePackageJson(config)) as GeneratedPackageJson
}

describe("generatePackageJson", () => {
  it("includes Playwright scripts and deps", () => {
    const pkg = parsePackage(baseConfig({ framework: "playwright" }))
    expect(pkg.scripts.test).toBe("playwright test")
    expect(pkg.scripts["test:ui"]).toBe("playwright test --ui")
    expect(pkg.devDependencies["@playwright/test"]).toBeDefined()
    expect(pkg.devDependencies.typescript).toBeDefined()
  })

  it("omits TypeScript for Playwright JavaScript projects", () => {
    const pkg = parsePackage(
      baseConfig({ framework: "playwright", language: "js" }),
    )
    expect(pkg.devDependencies["@playwright/test"]).toBeDefined()
    expect(pkg.devDependencies.typescript).toBeUndefined()
  })

  it("includes WDIO scripts and deps", () => {
    const pkg = parsePackage(baseConfig({ framework: "wdio" }))
    expect(pkg.scripts.wdio).toContain("wdio run")
    expect(pkg.scripts.wdio).toContain("wdio.conf.ts")
    expect(pkg.devDependencies["@wdio/cli"]).toBeDefined()
    expect(pkg.devDependencies.webdriverio).toBeDefined()
  })

  it("uses tsx instead of ts-node for WDIO TypeScript projects", () => {
    const pkg = parsePackage(baseConfig({ framework: "wdio", language: "ts" }))
    expect(pkg.devDependencies.tsx).toBeDefined()
    expect(pkg.devDependencies["ts-node"]).toBeUndefined()
  })

  it("uses wdio.conf.js for WDIO JavaScript projects", () => {
    const pkg = parsePackage(baseConfig({ framework: "wdio", language: "js" }))
    expect(pkg.scripts.wdio).toContain("wdio.conf.js")
  })

  it("adds wdio-html-nice-reporter when WDIO HTML reporting is enabled", () => {
    const pkg = parsePackage(
      baseConfig({
        framework: "wdio",
        reporting: { allure: false, html: true, dot: false },
      }),
    )
    expect(pkg.devDependencies["wdio-html-nice-reporter"]).toBeDefined()
  })

  it("includes Cypress scripts and deps", () => {
    const pkg = parsePackage(baseConfig({ framework: "cypress" }))
    expect(pkg.scripts.cypress).toBe("cypress open")
    expect(pkg.scripts["cypress:run"]).toBe("cypress run")
    expect(pkg.devDependencies.cypress).toBeDefined()
  })

  it("uses allure-cypress instead of the legacy Shelex plugin", () => {
    const pkg = parsePackage(
      baseConfig({
        framework: "cypress",
        reporting: { allure: true, html: false, dot: false },
      }),
    )
    expect(pkg.devDependencies["allure-cypress"]).toBeDefined()
    expect(pkg.devDependencies["@shelex/cypress-allure-plugin"]).toBeUndefined()
  })

  it("adds cypress-on-fix only for combined Cypress reporter hook composition", () => {
    const allureOnly = parsePackage(
      baseConfig({
        framework: "cypress",
        reporting: { allure: true, html: false, dot: false },
      }),
    )
    const combined = parsePackage(
      baseConfig({
        framework: "cypress",
        reporting: { allure: true, html: true, dot: false },
      }),
    )

    expect(allureOnly.devDependencies["cypress-on-fix"]).toBeUndefined()
    expect(combined.devDependencies["cypress-on-fix"]).toBeDefined()
  })

  it("uses project name from config", () => {
    const pkg = parsePackage(
      baseConfig({ projectName: "acme-tests", framework: "cypress" }),
    )
    expect(pkg.name).toBe("acme-tests")
  })

  it("includes serialize-javascript override for WDIO projects", () => {
    const pkg = parsePackage(baseConfig({ framework: "wdio" }))
    expect(pkg.overrides).toEqual({
      mocha: { "serialize-javascript": ">=7.0.5" },
    })
  })

  it("does not include overrides for Playwright projects", () => {
    const pkg = parsePackage(baseConfig({ framework: "playwright" }))
    expect(pkg.overrides).toBeUndefined()
  })

  it("adds cypress-mochawesome-reporter without standalone mochawesome when Cypress HTML reporting is enabled", () => {
    const pkg = parsePackage(
      baseConfig({
        framework: "cypress",
        reporting: { allure: false, html: true, dot: false },
      }),
    )
    expect(pkg.devDependencies["cypress-mochawesome-reporter"]).toBeDefined()
    expect(pkg.devDependencies.mochawesome).toBeUndefined()
  })

  it("does not include overrides for Cypress projects", () => {
    const pkg = parsePackage(baseConfig({ framework: "cypress" }))
    expect(pkg.overrides).toBeUndefined()
  })

  it("adds axios when API testing uses axios", () => {
    const pkg = parsePackage(baseConfig({ apiTesting: { tool: "axios" } }))
    expect(pkg.devDependencies.axios).toBeDefined()
  })

  it("adds supertest when API testing uses supertest", () => {
    const pkg = parsePackage(
      baseConfig({ apiTesting: { tool: "supertest" } }),
    )
    expect(pkg.devDependencies.supertest).toBeDefined()
    expect(pkg.devDependencies["@types/supertest"]).toBeDefined()
  })

  it("does not add extra API packages for Playwright built-in API testing", () => {
    const pkg = parsePackage(
      baseConfig({
        framework: "playwright",
        apiTesting: { tool: "playwright-built-in" },
      }),
    )
    expect(pkg.devDependencies.axios).toBeUndefined()
    expect(pkg.devDependencies.supertest).toBeUndefined()
  })

  it("adds integration packages when Testlio and Mailinator are enabled", () => {
    const pkg = parsePackage(
      baseConfig({
        integrations: { testlio: true, mailinator: true },
      }),
    )
    expect(pkg.devDependencies["@testlio/cli"]).toBeDefined()
    expect(pkg.devDependencies["mailinator-client"]).toBeDefined()
    expect(pkg.devDependencies["allure-commandline"]).toBeDefined()
    expect(pkg.devDependencies["allure-js-commons"]).toBeDefined()
    expect(pkg.scripts["allure:generate"]).toBeDefined()
  })

  it("does not include BDD or Cucumber packages in Phase 2 outputs", () => {
    const scenarios: Config[] = [
      baseConfig({ framework: "playwright" }),
      baseConfig({
        framework: "wdio",
        reporting: { allure: true, html: true, dot: true },
      }),
      baseConfig({
        framework: "cypress",
        reporting: { allure: true, html: true, dot: false },
      }),
    ]

    for (const config of scenarios) {
      const pkg = parsePackage(config)
      for (const name of forbiddenPhase2Packages) {
        expect(pkg.devDependencies[name]).toBeUndefined()
      }
    }
  })
})
