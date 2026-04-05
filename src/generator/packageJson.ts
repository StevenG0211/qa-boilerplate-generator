import type { Config } from "@/types"

type PackageJsonShape = {
  name: string
  version: string
  private: boolean
  scripts: Record<string, string>
  devDependencies: Record<string, string>
  overrides?: Record<string, Record<string, string>>
}

export function generatePackageJson(config: Config): string {
  const shape = buildPackageJsonShape(config)
  return `${JSON.stringify(shape, null, 2)}\n`
}

function mergeDeps(
  ...parts: Array<Record<string, string>>
): Record<string, string> {
  return Object.assign({}, ...parts)
}

function buildPackageJsonShape(config: Config): PackageJsonShape {
  const { projectName } = config

  const base: PackageJsonShape = {
    name: projectName,
    version: "1.0.0",
    private: true,
    scripts: {},
    devDependencies: {},
  }

  const fw = frameworkBase(config)
  base.scripts = fw.scripts
  let devDependencies = fw.devDependencies

  devDependencies = mergeDeps(devDependencies, reportingDeps(config))
  devDependencies = mergeDeps(devDependencies, apiDeps(config))
  devDependencies = mergeDeps(devDependencies, validationDeps(config))
  devDependencies = mergeDeps(devDependencies, envDeps(config))
  devDependencies = mergeDeps(devDependencies, lintDeps(config))

  base.devDependencies = devDependencies

  if (config.framework === "wdio") {
    base.overrides = {
      mocha: { "serialize-javascript": ">=7.0.5" },
    }
  }

  return base
}

function frameworkBase(config: Config): {
  scripts: Record<string, string>
  devDependencies: Record<string, string>
} {
  const { framework, language } = config
  const isTs = language === "ts"

  switch (framework) {
    case "playwright": {
      const scripts: Record<string, string> = {
        test: "playwright test",
        "test:ui": "playwright test --ui",
      }
      const devDependencies: Record<string, string> = {
        "@playwright/test": "^1.59.0",
      }
      if (isTs) {
        devDependencies.typescript = "^5.8.0"
        devDependencies["@types/node"] = "^22.15.0"
      }
      return { scripts, devDependencies }
    }
    case "wdio": {
      const wdioConf = isTs ? "./wdio.conf.ts" : "./wdio.conf.js"
      const scripts: Record<string, string> = {
        wdio: `wdio run ${wdioConf}`,
      }
      const devDependencies: Record<string, string> = mergeDeps(
        {
          "@wdio/cli": "^9.27.0",
          webdriverio: "^9.27.0",
          "@wdio/local-runner": "^9.27.0",
          "@wdio/mocha-framework": "^9.27.0",
          "expect-webdriverio": "^5.3.0",
          "@types/mocha": "^10.0.10",
        },
        isTs
          ? {
              typescript: "^5.8.0",
              "ts-node": "^10.9.2",
              "@types/node": "^22.15.0",
            }
          : {},
      )
      return { scripts, devDependencies }
    }
    case "cypress": {
      const scripts: Record<string, string> = {
        cypress: "cypress open",
        "cypress:run": "cypress run",
      }
      const devDependencies: Record<string, string> = {
        cypress: "^15.13.0",
      }
      if (isTs) {
        devDependencies.typescript = "^5.8.0"
        devDependencies["@types/node"] = "^22.15.0"
      }
      return { scripts, devDependencies }
    }
    default: {
      const _exhaustive: never = framework
      return _exhaustive
    }
  }
}

function reportingDeps(config: Config): Record<string, string> {
  const { framework, reporting } = config
  const out: Record<string, string> = {}

  if (framework === "wdio") {
    if (reporting.allure) {
      out["@wdio/allure-reporter"] = "^9.27.0"
    }
    if (reporting.html) {
      out["wdio-html-nice-reporter"] = "^8.1.7"
    }
    if (reporting.dot) {
      out["@wdio/dot-reporter"] = "^9.27.0"
    }
  }

  if (framework === "playwright" && reporting.allure) {
    out["allure-playwright"] = "^3.0.0"
  }

  if (framework === "cypress") {
    if (reporting.allure) {
      out["@shelex/cypress-allure-plugin"] = "^2.41.0"
    }
    if (reporting.html) {
      out["cypress-mochawesome-reporter"] = "^4.0.2"
    }
  }

  return out
}

function apiDeps(config: Config): Record<string, string> {
  const { apiTesting } = config
  if (apiTesting.tool === "none" || apiTesting.tool === "playwright-built-in") {
    return {}
  }

  const out: Record<string, string> = {}
  if (apiTesting.tool === "supertest") {
    out.supertest = "^7.0.0"
    out["@types/supertest"] = "^6.0.2"
  }
  if (apiTesting.tool === "axios") {
    out.axios = "^1.7.0"
  }

  return out
}

function validationDeps(config: Config): Record<string, string> {
  if (!config.validation.zod) {
    return {}
  }
  return { zod: "^3.24.0" }
}

function envDeps(config: Config): Record<string, string> {
  if (!config.env.dotenv) {
    return {}
  }
  return { dotenv: "^16.4.0" }
}

function lintDeps(config: Config): Record<string, string> {
  const { linting, language } = config
  if (!linting.eslint && !linting.prettier) {
    return {}
  }

  const out: Record<string, string> = {
    eslint: "^9.17.0",
  }

  if (language === "ts") {
    out["@typescript-eslint/parser"] = "^8.58.0"
    out["@typescript-eslint/eslint-plugin"] = "^8.58.0"
  }

  if (linting.prettier) {
    out.prettier = "^3.4.0"
  }

  if (linting.eslint && linting.prettier) {
    out["eslint-config-prettier"] = "^9.1.0"
    out["eslint-plugin-prettier"] = "^5.2.0"
  }

  return out
}
