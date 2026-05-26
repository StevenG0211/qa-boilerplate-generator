import { describe, expect, it } from "vitest"
import type { APITool, Config } from "@/types"
import type { FileNode } from "@/types"
import { officialPresets } from "@/presets/officialPresets"
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
  integrations: { testlio: false, mailinator: false },
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

function findFile(
  nodes: FileNode[],
  path: string,
): Extract<FileNode, { kind: "file" }> | null {
  const [head, ...rest] = path.split("/")
  const node = nodes.find((n) => n.name === head)

  if (!node) return null
  if (rest.length === 0) return node.kind === "file" ? node : null
  if (node.kind === "folder") return findFile(node.children, rest.join("/"))
  return null
}

describe("generateProject", () => {
  it("returns project name and a root package.json file", () => {
    const project = generateProject(sampleConfig)
    expect(project.projectName).toBe("demo-app")
    expect(project.tree.length).toBeGreaterThan(0)
    const pkg = project.tree.find(
      (n) => n.kind === "file" && n.name === "package.json",
    )
    const readme = project.tree.find(
      (n) => n.kind === "file" && n.name === "README.md",
    )
    expect(pkg?.kind).toBe("file")
    expect(readme?.kind).toBe("file")
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
    expect(wdioFile.content).not.toContain("autoCompileOpts")
    expect(wdioFile.content).not.toContain("tsNodeOpts")
  })

  it("includes Cypress config and e2e spec", () => {
    const cfg: Config = { ...sampleConfig, framework: "cypress" }
    const paths = collectPaths(generateProject(cfg).tree)
    expect(paths).toContain("cypress.config.ts")
    expect(paths).toContain("cypress/e2e/smoke.cy.ts")
    expect(paths).toContain("cypress/pages/LoginPage.ts")
  })

  it("wires Cypress Allure and HTML reporters through config and support files", () => {
    const cfg: Config = {
      ...sampleConfig,
      framework: "cypress",
      reporting: { allure: true, html: true, dot: false },
    }
    const project = generateProject(cfg)
    const configFile = findFile(project.tree, "cypress.config.ts")
    const supportFile = findFile(project.tree, "cypress/support/e2e.ts")

    expect(configFile?.content).toContain("allure-cypress/reporter")
    expect(configFile?.content).toContain("allureCypress(on, config")
    expect(configFile?.content).toContain("cypressOnFix(on)")
    expect(configFile?.content).toContain("mochawesome(on)")
    expect(configFile?.content).not.toContain("@shelex/cypress-allure-plugin")
    expect(supportFile?.content).toContain("import 'allure-cypress'")
    expect(supportFile?.content).toContain(
      "import 'cypress-mochawesome-reporter/register'",
    )
    expect(supportFile?.content).toContain("import './allure-hooks'")
  })

  it("generates framework-specific setup notes", () => {
    const playwrightReadme = findFile(
      generateProject(sampleConfig).tree,
      "README.md",
    )
    const wdioReadme = findFile(
      generateProject({ ...sampleConfig, framework: "wdio" }).tree,
      "README.md",
    )

    expect(playwrightReadme?.content).toContain("npx playwright install")
    expect(wdioReadme?.content).toContain("WDIO v9 uses `tsx`")
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

  it("generates Playwright API module set for built-in API testing", () => {
    const cfg: Config = {
      ...sampleConfig,
      apiTesting: { tool: "playwright-built-in" },
    }
    const paths = collectPaths(generateProject(cfg).tree)
    expect(paths).toContain("tests/api/client.ts")
    expect(paths).toContain("tests/api/usersApi.ts")
    expect(paths).toContain("tests/api/users.spec.ts")
  })

  it("generates WDIO API helpers and example spec for axios", () => {
    const cfg: Config = {
      ...sampleConfig,
      framework: "wdio",
      apiTesting: { tool: "axios" },
    }
    const paths = collectPaths(generateProject(cfg).tree)
    expect(paths).toContain("src/api/client.ts")
    expect(paths).toContain("src/api/usersApi.ts")
    expect(paths).toContain("test/specs/api/users.api.ts")
  })

  it("generates Testlio integration files for official Testlio preset", () => {
    const cfg: Config = {
      ...sampleConfig,
      integrations: { testlio: true, mailinator: true },
      reporting: { allure: true, html: true, dot: false },
    }
    const paths = collectPaths(generateProject(cfg).tree)
    expect(paths).toContain("testlio-cli/project-config.json")
    expect(paths).toContain("lib/mailinator-provider.ts")
    expect(paths).toContain("lib/allure-helper.ts")
    expect(paths).toContain("playwright.service.config.ts")
  })

  describe("integration helper wiring", () => {
    it("Playwright POM smoke spec imports page-object-fixtures when Allure is enabled", () => {
      const smoke = findFile(
        generateProject(sampleConfig).tree,
        "tests/smoke.spec.ts",
      )
      expect(smoke?.content).toContain("lib/page-object-fixtures")
      expect(smoke?.content).toContain("loginPage")
    })

    it("Playwright non-POM smoke spec imports helpers-fixtures when Allure is enabled", () => {
      const cfg: Config = { ...sampleConfig, pattern: "none" }
      const smoke = findFile(generateProject(cfg).tree, "tests/smoke.spec.ts")
      expect(smoke?.content).toContain("lib/helpers-fixtures")
    })

    it("Playwright smoke spec uses @playwright/test when Allure is disabled", () => {
      const cfg: Config = {
        ...sampleConfig,
        reporting: { allure: false, html: true, dot: false },
      }
      const smoke = findFile(generateProject(cfg).tree, "tests/smoke.spec.ts")
      expect(smoke?.content).toContain("@playwright/test")
      expect(smoke?.content).not.toContain("lib/helpers-fixtures")
    })

    it("WDIO smoke spec registers failure hooks when Allure is enabled", () => {
      const cfg: Config = { ...sampleConfig, framework: "wdio" }
      const smoke = findFile(generateProject(cfg).tree, "test/specs/smoke.ts")
      expect(smoke?.content).toContain("registerFailureHooks")
      expect(smoke?.content).toContain("lib/hooks")
    })

    it("Cypress support imports allure-hooks when Allure is enabled", () => {
      const cfg: Config = { ...sampleConfig, framework: "cypress" }
      const support = findFile(
        generateProject(cfg).tree,
        "cypress/support/e2e.ts",
      )
      expect(support?.content).toContain("./allure-hooks")
    })
  })

  describe("API template matrix", () => {
    const playwrightTools: APITool[] = [
      "playwright-built-in",
      "axios",
      "supertest",
    ]

    it.each(playwrightTools)(
      "Playwright generates tests/api module set for %s",
      (tool) => {
        const paths = collectPaths(
          generateProject({ ...sampleConfig, apiTesting: { tool } }).tree,
        )
        expect(paths).toContain("tests/api/client.ts")
        expect(paths).toContain("tests/api/usersApi.ts")
        expect(paths).toContain("tests/api/users.spec.ts")
      },
    )

    it.each(["axios", "supertest"] as const)(
      "WDIO generates src/api and example spec for %s",
      (tool) => {
        const cfg: Config = {
          ...sampleConfig,
          framework: "wdio",
          apiTesting: { tool },
        }
        const paths = collectPaths(generateProject(cfg).tree)
        expect(paths).toContain("src/api/client.ts")
        expect(paths).toContain("src/api/usersApi.ts")
        expect(paths).toContain("test/specs/api/users.api.ts")
      },
    )

    it("Cypress generates cypress/api module set for axios", () => {
      const cfg: Config = {
        ...sampleConfig,
        framework: "cypress",
        apiTesting: { tool: "axios" },
      }
      const paths = collectPaths(generateProject(cfg).tree)
      expect(paths).toContain("cypress/api/client.ts")
      expect(paths).toContain("cypress/api/usersApi.ts")
      expect(paths).toContain("cypress/api/users.api.ts")
    })
  })

  describe("API template matrix (JavaScript)", () => {
    const jsConfig = { ...sampleConfig, language: "js" as const }

    const playwrightTools: APITool[] = [
      "playwright-built-in",
      "axios",
      "supertest",
    ]

    it.each(playwrightTools)(
      "Playwright JS generates tests/api module set for %s",
      (tool) => {
        const paths = collectPaths(
          generateProject({ ...jsConfig, apiTesting: { tool } }).tree,
        )
        expect(paths).toContain("tests/api/client.js")
        expect(paths).toContain("tests/api/usersApi.js")
        expect(paths).toContain("tests/api/users.spec.js")
      },
    )

    it.each(["axios", "supertest"] as const)(
      "WDIO JS generates src/api and example spec for %s",
      (tool) => {
        const cfg: Config = {
          ...jsConfig,
          framework: "wdio",
          apiTesting: { tool },
        }
        const paths = collectPaths(generateProject(cfg).tree)
        expect(paths).toContain("src/api/client.js")
        expect(paths).toContain("src/api/usersApi.js")
        expect(paths).toContain("test/specs/api/users.api.js")
      },
    )

    it("Cypress JS generates cypress/api module set for axios", () => {
      const cfg: Config = {
        ...jsConfig,
        framework: "cypress",
        apiTesting: { tool: "axios" },
      }
      const paths = collectPaths(generateProject(cfg).tree)
      expect(paths).toContain("cypress/api/client.js")
      expect(paths).toContain("cypress/api/usersApi.js")
      expect(paths).toContain("cypress/api/users.api.js")
    })
  })

  describe("Official preset smoke trees", () => {
    const presetSmokePaths: Record<string, string[]> = {
      "playwright-ts-pom": [
        "playwright.config.ts",
        "tests/pages/LoginPage.ts",
        "tests/smoke.spec.ts",
      ],
      "playwright-api-zod": [
        "src/schemas/loginFixture.ts",
        "tests/api/users.spec.ts",
      ],
      "playwright-testlio-ts-pom": [
        "playwright.config.ts",
        "playwright.service.config.ts",
        "testlio-cli/project-config.json",
        "lib/helpers-fixtures.ts",
      ],
      "wdio-ts-pom-allure": ["wdio.conf.ts", "src/pages/LoginPage.ts"],
      "wdio-api-axios": [
        "src/api/client.ts",
        "test/specs/api/users.api.ts",
      ],
      "wdio-testlio-ts-pom": [
        "wdio.conf.ts",
        "testlio-cli/project-config.json",
        "lib/hooks.ts",
      ],
      "cypress-ts-pom-html": [
        "cypress.config.ts",
        "cypress/pages/LoginPage.ts",
      ],
      "cypress-js-minimal": ["cypress.config.js", "cypress/e2e/smoke.cy.js"],
      "cypress-testlio-ts-pom": [
        "cypress.config.ts",
        "cypress/support/allure-hooks.ts",
        "testlio-cli/project-config.json",
      ],
    }

    it.each(officialPresets.map((preset) => [preset.id, preset.config] as const))(
      "%s generates expected scaffold paths",
      (id, config) => {
        const paths = collectPaths(generateProject(config).tree)
        const expected = presetSmokePaths[id]
        expect(expected).toBeDefined()
        for (const sentinel of expected) {
          expect(paths).toContain(sentinel)
        }
      },
    )

    it("wdio-ts-pom-allure wires Allure reporter in wdio.conf.ts", () => {
      const preset = officialPresets.find((p) => p.id === "wdio-ts-pom-allure")
      expect(preset).toBeDefined()
      const wdioFile = findFile(
        generateProject(preset!.config).tree,
        "wdio.conf.ts",
      )
      expect(wdioFile?.content).toContain("allure-results")
    })

    it("cypress-ts-pom-html wires Mochawesome reporter in cypress.config.ts", () => {
      const preset = officialPresets.find((p) => p.id === "cypress-ts-pom-html")
      expect(preset).toBeDefined()
      const configFile = findFile(
        generateProject(preset!.config).tree,
        "cypress.config.ts",
      )
      expect(configFile?.content).toContain("mochawesome")
    })
  })
})
