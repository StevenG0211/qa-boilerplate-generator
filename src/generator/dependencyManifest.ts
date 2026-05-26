import type { APITool, Config, Framework } from "@/types"

type DependencyGroup = {
  packages?: Record<string, string>
  scripts?: Record<string, string>
  notes?: string[]
  conflictsWith?: string[]
  overrides?: Record<string, Record<string, string>>
}

export type ResolvedDependencyManifest = {
  scripts: Record<string, string>
  devDependencies: Record<string, string>
  notes: string[]
  conflicts: string[]
  overrides?: Record<string, Record<string, string>>
}

const FORBIDDEN_PHASE_2_PACKAGES = [
  "@wdio/cucumber-framework",
  "@badeball/cypress-cucumber-preprocessor",
  "cucumber",
  "@cucumber/cucumber",
] as const

const frameworkCore: Record<Framework, DependencyGroup> = {
  playwright: {
    scripts: {
      test: "playwright test",
      "test:ui": "playwright test --ui",
    },
    packages: {
      "@playwright/test": "^1.59.0",
    },
    notes: ["Run `npx playwright install` after installing dependencies."],
  },
  wdio: {
    scripts: {
      wdio: "wdio run ./wdio.conf.js",
    },
    packages: {
      "@wdio/cli": "^9.27.0",
      webdriverio: "^9.27.0",
      "@wdio/local-runner": "^9.27.0",
      "@wdio/mocha-framework": "^9.27.0",
      "expect-webdriverio": "^5.3.0",
      "@types/mocha": "^10.0.10",
    },
    overrides: {
      mocha: { "serialize-javascript": ">=7.0.5" },
    },
    notes: ["WDIO packages are kept on the same v9 family for compatibility."],
  },
  cypress: {
    scripts: {
      cypress: "cypress open",
      "cypress:run": "cypress run",
    },
    packages: {
      cypress: "^15.13.0",
    },
  },
}

const typescriptGroups: Record<Framework, DependencyGroup> = {
  playwright: {
    packages: {
      typescript: "^5.8.0",
      "@types/node": "^22.15.0",
    },
  },
  wdio: {
    packages: {
      typescript: "^5.8.0",
      tsx: "^4.21.0",
      "@types/node": "^22.15.0",
    },
    notes: [
      "WDIO v9 uses `tsx` to run TypeScript config and spec files; run `tsc` separately for type checking.",
    ],
  },
  cypress: {
    packages: {
      typescript: "^5.8.0",
      "@types/node": "^22.15.0",
    },
  },
}

const reportingGroups: Record<Framework, Record<string, DependencyGroup>> = {
  playwright: {
    allure: {
      packages: {
        "allure-playwright": "^3.0.0",
      },
    },
    html: {
      notes: ["Playwright HTML reporting uses the built-in `html` reporter."],
    },
  },
  wdio: {
    allure: {
      packages: {
        "@wdio/allure-reporter": "^9.27.0",
      },
    },
    html: {
      packages: {
        "wdio-html-nice-reporter": "^8.1.7",
      },
      notes: [
        "WDIO HTML reporting uses `wdio-html-nice-reporter`; validate compatibility when upgrading WDIO.",
      ],
    },
    dot: {
      packages: {
        "@wdio/dot-reporter": "^9.27.0",
      },
    },
  },
  cypress: {
    allure: {
      packages: {
        "allure-cypress": "^3.7.1",
      },
      conflictsWith: ["cypress-event-hooks"],
      notes: [
        'Cypress Allure requires config wiring plus `import "allure-cypress"` in the support file.',
      ],
    },
    html: {
      packages: {
        "cypress-mochawesome-reporter": "^3.8.4",
      },
      conflictsWith: ["cypress-event-hooks"],
      notes: [
        "Cypress HTML reporting requires `cypress-mochawesome-reporter/register` in the support file.",
      ],
    },
  },
}

const apiGroups: Record<APITool, DependencyGroup> = {
  none: {},
  "playwright-built-in": {
    notes: ["Playwright API testing uses the built-in request fixture."],
  },
  supertest: {
    packages: {
      supertest: "^7.0.0",
      "@types/supertest": "^6.0.2",
    },
  },
  axios: {
    packages: {
      axios: "^1.7.0",
    },
  },
}

const lintGroup = (isTs: boolean): DependencyGroup => ({
  packages: {
    eslint: "^9.17.0",
    ...(isTs
      ? {
          "@typescript-eslint/parser": "^8.58.0",
          "@typescript-eslint/eslint-plugin": "^8.58.0",
        }
      : {}),
  },
})

const prettierGroup: DependencyGroup = {
  packages: {
    prettier: "^3.4.0",
  },
}

const eslintPrettierGroup: DependencyGroup = {
  packages: {
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.0",
  },
}

const envGroup: DependencyGroup = {
  packages: {
    dotenv: "^16.4.0",
  },
}

const validationGroup: DependencyGroup = {
  packages: {
    zod: "^3.24.0",
  },
}

export function resolveDependencyManifest(
  config: Config,
): ResolvedDependencyManifest {
  const groups = collectDependencyGroups(config)
  const resolved = groups.reduce<ResolvedDependencyManifest>(
    (acc, group) => {
      Object.assign(acc.scripts, group.scripts)
      Object.assign(acc.devDependencies, group.packages)

      if (group.notes) acc.notes.push(...group.notes)
      if (group.conflictsWith) acc.conflicts.push(...group.conflictsWith)
      if (group.overrides) {
        acc.overrides = { ...(acc.overrides ?? {}), ...group.overrides }
      }

      return acc
    },
    { scripts: {}, devDependencies: {}, notes: [], conflicts: [] },
  )

  if (
    config.framework === "wdio" &&
    config.language === "ts" &&
    resolved.scripts.wdio
  ) {
    resolved.scripts.wdio = "wdio run ./wdio.conf.ts"
  }

  if (config.framework === "cypress" && hasMultipleCypressHookPlugins(config)) {
    resolved.devDependencies["cypress-on-fix"] = "^1.0.3"
    resolved.notes.push(
      "Cypress reporter hooks are composed with `cypress-on-fix` when Allure and HTML reporting are both enabled.",
    )
  }

  assertNoForbiddenPackages(resolved.devDependencies)

  return {
    ...resolved,
    notes: Array.from(new Set(resolved.notes)),
    conflicts: Array.from(new Set(resolved.conflicts)),
  }
}

function collectDependencyGroups(config: Config): DependencyGroup[] {
  const groups: DependencyGroup[] = [frameworkCore[config.framework]]

  if (config.language === "ts") {
    groups.push(typescriptGroups[config.framework])
  }

  groups.push(...reportingDependencyGroups(config))

  const apiGroup = apiDependencyGroup(config)
  if (apiGroup) groups.push(apiGroup)

  if (config.env.dotenv) groups.push(envGroup)
  if (config.validation.zod) groups.push(validationGroup)

  if (config.linting.eslint) groups.push(lintGroup(config.language === "ts"))
  if (config.linting.prettier) groups.push(prettierGroup)
  if (config.linting.eslint && config.linting.prettier) {
    groups.push(eslintPrettierGroup)
  }

  return groups
}

function reportingDependencyGroups(config: Config): DependencyGroup[] {
  const groups: DependencyGroup[] = []
  const frameworkReporting = reportingGroups[config.framework]

  if (config.reporting.allure && frameworkReporting.allure) {
    groups.push(frameworkReporting.allure)
  }
  if (config.reporting.html && frameworkReporting.html) {
    groups.push(frameworkReporting.html)
  }
  if (
    config.framework === "wdio" &&
    config.reporting.dot &&
    frameworkReporting.dot
  ) {
    groups.push(frameworkReporting.dot)
  }

  return groups
}

function apiDependencyGroup(config: Config): DependencyGroup | null {
  if (
    config.apiTesting.tool === "playwright-built-in" &&
    config.framework !== "playwright"
  ) {
    return null
  }
  return apiGroups[config.apiTesting.tool]
}

function hasMultipleCypressHookPlugins(config: Config): boolean {
  return (
    config.framework === "cypress" &&
    config.reporting.allure &&
    config.reporting.html
  )
}

function assertNoForbiddenPackages(packages: Record<string, string>): void {
  for (const name of FORBIDDEN_PHASE_2_PACKAGES) {
    if (name in packages) {
      throw new Error(`Phase 2 dependency output cannot include ${name}`)
    }
  }
}
