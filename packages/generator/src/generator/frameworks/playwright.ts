import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { shouldGenerateTestlioLib } from "../blocks/integrations/shared"
import { file, folder } from "../nodes"
import { fileExtension } from "../ext"

export function generatePlaywrightNodes(config: Config): FileNode[] {
  const ext = fileExtension(config)
  const lang = ext === "ts" ? "typescript" : "javascript"
  const nodes: FileNode[] = []

  nodes.push(file(`playwright.config.${ext}`, playwrightConfig(config), lang))

  if (ext === "ts") {
    nodes.push(file("tsconfig.json", playwrightTsconfig(), "json"))
  }

  const testsChildren: FileNode[] = []

  testsChildren.push(file(`smoke.spec.${ext}`, playwrightSmokeSpec(config), lang))

  if (config.pattern === "pom") {
    testsChildren.push(
      folder("pages", [file(`LoginPage.${ext}`, playwrightLoginPage(config), lang)]),
    )
  }

  nodes.push(folder("tests", testsChildren))

  if (config.pattern === "screenplay") {
    nodes.push(
      folder("src", [
        folder("actors", []),
        folder("tasks", []),
        folder("questions", []),
      ]),
    )
  }

  return nodes
}

function playwrightConfig(config: Config): string {
  const ext = fileExtension(config)
  const testlio = config.integrations.testlio
  const reporterParts: string[] = ["['list']"]
  if (config.reporting.allure) {
    if (testlio) {
      reporterParts.push(
        "['allure-playwright', { detail: false, resultsDir: 'allure-results' }]",
      )
    } else {
      reporterParts.push("['allure-playwright']")
    }
  }
  if (config.reporting.html) {
    reporterParts.push("['html', { outputFolder: 'playwright-report' }]")
  }
  const reporterBlock = reporterParts.join(",\n    ")

  const imports: string[] = ["import { defineConfig, devices } from '@playwright/test'"]
  if (testlio && config.env.dotenv) {
    imports.push("import dotenv from 'dotenv'")
    imports.push("import path from 'path'")
    imports.push("import { getPlaywrightBaseUrl } from './lib/test-target'")
  }

  const dotenvSetup =
    testlio && config.env.dotenv
      ? `\ndotenv.config({ path: path.resolve(__dirname, '.env') });\n`
      : ""

  const baseUrlExpr =
    testlio && config.env.dotenv
      ? "getPlaywrightBaseUrl()"
      : "process.env.BASE_URL ?? 'http://localhost:3000'"

  const traceSetting = testlio ? "'retain-on-failure'" : "'on-first-retry'"
  const retries = testlio ? "0" : "process.env.CI ? 2 : 0"

  const projectsBlock = testlio
    ? `[
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ]`
    : `[
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ]`

  if (ext === "ts") {
    return `${imports.join(";\n")};${dotenvSetup}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: ${retries},
  reporter: [
    ${reporterBlock}
  ],
  use: {
    trace: ${traceSetting},
    baseURL: ${baseUrlExpr},
  },
  projects: ${projectsBlock},
});
`
  }

  const jsDotenv =
    testlio && config.env.dotenv
      ? `\nrequire('dotenv').config({ path: require('path').resolve(__dirname, '.env') });\n`
      : ""
  const jsBaseUrl =
    testlio && config.env.dotenv
      ? "require('./lib/test-target').getPlaywrightBaseUrl()"
      : "process.env.BASE_URL ?? 'http://localhost:3000'"

  return `const { defineConfig, devices } = require('@playwright/test');${jsDotenv}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: ${retries},
  reporter: [
    ${reporterBlock}
  ],
  use: {
    trace: ${traceSetting},
    baseURL: ${jsBaseUrl},
  },
  projects: ${projectsBlock},
});
`
}

function playwrightTsconfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node", "@playwright/test"]
  },
  "include": ["tests/**/*.ts", "playwright.config.ts", "lib/**/*.ts", "src/**/*.ts"]
}
`
}

function playwrightSmokeSpec(config: Config): string {
  const ext = fileExtension(config)
  const useLib = shouldGenerateTestlioLib(config)

  if (config.pattern === "pom") {
    if (useLib) {
      if (ext === "ts") {
        return `import { test, expect } from '../lib/page-object-fixtures';

test('login page structure', async ({ loginPage }) => {
  await loginPage.goto();
  await expect(loginPage.usernameInput).toBeVisible();
});
`
      }
      return `const { test, expect } = require('../lib/page-object-fixtures');

test('login page structure', async ({ loginPage }) => {
  await loginPage.goto();
  await expect(loginPage.usernameInput).toBeVisible();
});
`
    }
    if (ext === "ts") {
      return `import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('login page structure', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await expect(login.usernameInput).toBeVisible();
});
`
    }
    return `const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

test('login page structure', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await expect(login.usernameInput).toBeVisible();
});
`
  }

  if (useLib) {
    if (ext === "ts") {
      return `import { test, expect } from '../lib/helpers-fixtures';

test('smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
`
    }
    return `const { test, expect } = require('../lib/helpers-fixtures');

test('smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
`
  }

  if (ext === "ts") {
    return `import { test, expect } from '@playwright/test';

test('smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
`
  }
  return `const { test, expect } = require('@playwright/test');

test('smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
`
}

function playwrightLoginPage(config: Config): string {
  const ext = fileExtension(config)
  if (ext === "ts") {
    return `import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel(/user(name)?/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in|log in/i });
  }

  async goto() {
    await this.page.goto('/login');
  }
}
`
  }
  return `class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByLabel(/user(name)?/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in|log in/i });
  }

  async goto() {
    await this.page.goto('/login');
  }
}

module.exports = { LoginPage };
`
}

