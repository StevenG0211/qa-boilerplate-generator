import type { Config } from "@/types"
import type { FileNode } from "@/types"
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

  if (config.apiTesting.tool !== "none") {
    testsChildren.push(
      folder("api", [file(`apiClient.${ext}`, playwrightApiStub(config), lang)]),
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
  const reporterParts: string[] = ["['list']"]
  if (config.reporting.allure) {
    reporterParts.push("['allure-playwright']")
  }
  if (config.reporting.html) {
    reporterParts.push("['html', { outputFolder: 'playwright-report' }]")
  }
  const reporterBlock = reporterParts.join(",\n    ")

  if (ext === "ts") {
    return `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ${reporterBlock}
  ],
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
`
  }

  return `const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ${reporterBlock}
  ],
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
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
  "include": ["tests/**/*.ts", "playwright.config.ts", "src/**/*.ts"]
}
`
}

function playwrightSmokeSpec(config: Config): string {
  const ext = fileExtension(config)
  if (config.pattern === "pom") {
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

function playwrightApiStub(config: Config): string {
  const tool = config.apiTesting.tool
  const ext = fileExtension(config)

  if (tool === "playwright-built-in") {
    if (ext === "ts") {
      return `import type { APIRequestContext } from '@playwright/test';

export async function fetchJson(request: APIRequestContext, path: string) {
  const res = await request.get(path);
  return res.json();
}
`
    }
    return `async function fetchJson(request, path) {
  const res = await request.get(path);
  return res.json();
}

module.exports = { fetchJson };
`
  }

  if (tool === "supertest") {
    if (ext === "ts") {
      return `import request from 'supertest';

export function createClient(baseUrl: string) {
  return request(baseUrl);
}
`
    }
    return `const request = require('supertest');

function createClient(baseUrl) {
  return request(baseUrl);
}

module.exports = { createClient };
`
  }

  if (tool === "axios") {
    if (ext === "ts") {
      return `import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_BASE_URL ?? 'http://localhost:4000',
});
`
    }
    return `const axios = require('axios');

const api = axios.create({
  baseURL: process.env.API_BASE_URL ?? 'http://localhost:4000',
});

module.exports = { api };
`
  }

  return ''
}
