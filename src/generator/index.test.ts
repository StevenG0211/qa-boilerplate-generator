import { describe, expect, it } from "vitest"
import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { generateProject } from "./index"

const sampleConfig: Config = {
  projectName: "demo-app",
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

function collectPaths(nodes: FileNode[], prefix = ""): string[] {
  const out: string[] = []
  for (const n of nodes) {
    const p = prefix ? `${prefix}/${n.name}` : n.name
    if (n.kind === "file") {
      out.push(p)
    } else {
      out.push(p + "/")
      out.push(...collectPaths(n.children, p))
    }
  }
  return out
}

describe("generateProject", () => {
  it("returns project name and a root package.json file", () => {
    const project = generateProject(sampleConfig)
    expect(project.projectName).toBe("demo-app")
    expect(project.tree.length).toBeGreaterThan(0)
    const pkg = project.tree.find(
      (n) => n.kind === "file" && n.name === "package.json",
    )
    expect(pkg?.kind).toBe("file")
    if (pkg?.kind === "file") {
      expect(JSON.parse(pkg.content).name).toBe("demo-app")
    }
  })

  it("includes Playwright config, tests, and POM page", () => {
    const paths = collectPaths(generateProject(sampleConfig).tree)
    expect(paths).toContain("playwright.config.ts")
    expect(paths).toContain("tests/smoke.spec.ts")
    expect(paths).toContain("tests/pages/LoginPage.ts")
  })

  it("includes WebdriverIO config and smoke spec", () => {
    const cfg: Config = { ...sampleConfig, framework: "wdio" }
    const paths = collectPaths(generateProject(cfg).tree)
    expect(paths).toContain("wdio.conf.ts")
    expect(paths).toContain("test/specs/smoke.ts")
    expect(paths).toContain("src/pages/LoginPage.ts")
  })

  it("WDIO config maps specs to test/specs/**/*.ts and html-nice when HTML reporting is on", () => {
    const cfg: Config = {
      ...sampleConfig,
      framework: "wdio",
      reporting: { allure: false, html: true, dot: false },
    }
    const wdioFile = generateProject(cfg).tree.find(
      (n) => n.kind === "file" && n.name === "wdio.conf.ts",
    )
    expect(wdioFile?.kind).toBe("file")
    if (wdioFile?.kind !== "file") return
    expect(wdioFile.content).toContain("test/specs/**/*.ts")
    expect(wdioFile.content).toContain("html-nice")
    expect(wdioFile.content).toContain("./reports/html-reports")
  })

  it("includes Cypress config and e2e spec", () => {
    const cfg: Config = { ...sampleConfig, framework: "cypress" }
    const paths = collectPaths(generateProject(cfg).tree)
    expect(paths).toContain("cypress.config.ts")
    expect(paths).toContain("cypress/e2e/smoke.cy.ts")
    expect(paths).toContain("cypress/pages/LoginPage.ts")
  })

  it("merges src from Zod and Screenplay for Playwright", () => {
    const cfg: Config = {
      ...sampleConfig,
      pattern: "screenplay",
      validation: { zod: true },
    }
    const paths = collectPaths(generateProject(cfg).tree)
    expect(paths).toContain("src/schemas/loginFixture.ts")
    expect(paths).toContain("src/actors/")
  })
})
