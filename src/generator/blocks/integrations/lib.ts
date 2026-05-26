import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../../nodes"
import { fileExtension } from "../../ext"
import { shouldGenerateLibHelpers, shouldGenerateTestlioLib } from "./shared"

export function generateLibNodes(config: Config): FileNode[] {
  if (!shouldGenerateLibHelpers(config)) {
    return []
  }

  const ext = fileExtension(config)
  const lang = ext === "ts" ? "typescript" : "javascript"
  const libFiles: FileNode[] = []

  if (shouldGenerateTestlioLib(config)) {
    libFiles.push(file(`test-target.${ext}`, testTarget(config, ext), lang))
    libFiles.push(file(`allure-helper.${ext}`, allureHelper(config, ext), lang))
  }

  if (config.framework === "playwright" && shouldGenerateTestlioLib(config)) {
    libFiles.push(
      file(`helpers-fixtures.${ext}`, playwrightHelpersFixtures(ext), lang),
    )
    if (config.pattern === "pom") {
      libFiles.push(
        file(
          `page-object-fixtures.${ext}`,
          playwrightPageObjectFixtures(ext),
          lang,
        ),
      )
    }
  }

  if (config.framework === "wdio" && shouldGenerateTestlioLib(config)) {
    libFiles.push(file(`hooks.${ext}`, wdioHooks(ext), lang))
  }

  const nodes: FileNode[] = []
  if (libFiles.length > 0) {
    nodes.push(folder("lib", libFiles))
  }

  if (
    config.framework === "wdio" &&
    config.pattern === "pom" &&
    shouldGenerateTestlioLib(config)
  ) {
    nodes.push(
      folder("src", [
        folder("pages", [
          file(`index.${ext}`, wdioPagesIndex(ext), lang),
        ]),
      ]),
    )
  }

  if (config.framework === "cypress" && shouldGenerateTestlioLib(config)) {
    nodes.push(
      folder("cypress", [
        folder("support", [
          file(`allure-hooks.${ext}`, cypressAllureHooks(ext), lang),
        ]),
      ]),
    )
  }

  return nodes
}

function testTarget(config: Config, ext: "ts" | "js"): string {
  if (config.framework === "playwright") {
    if (ext === "ts") {
      return `export function getPlaywrightBaseUrl(): string {
  return process.env.BASEURL ?? process.env.BASE_URL ?? 'http://localhost:3000';
}

export function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ?? 'http://localhost:4000';
}
`
    }
    return `function getPlaywrightBaseUrl() {
  return process.env.BASEURL ?? process.env.BASE_URL ?? 'http://localhost:3000';
}

function getApiBaseUrl() {
  return process.env.API_BASE_URL ?? 'http://localhost:4000';
}

module.exports = { getPlaywrightBaseUrl, getApiBaseUrl };
`
  }

  if (ext === "ts") {
    return `export function getBaseUrl(): string {
  return process.env.BASEURL ?? process.env.BASE_URL ?? 'http://localhost:3000';
}

export function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ?? 'http://localhost:4000';
}
`
  }
  return `function getBaseUrl() {
  return process.env.BASEURL ?? process.env.BASE_URL ?? 'http://localhost:3000';
}

function getApiBaseUrl() {
  return process.env.API_BASE_URL ?? 'http://localhost:4000';
}

module.exports = { getBaseUrl, getApiBaseUrl };
`
}

function allureHelper(config: Config, ext: "ts" | "js"): string {
  if (config.framework === "playwright") {
    if (ext === "ts") {
      return `import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';

class AllureHelper {
  async attachScreenshot(page: Page) {
    const buffer = await page.screenshot({ fullPage: true });
    await allure.attachment('Screenshot', buffer, ContentType.PNG);
  }
}

export default new AllureHelper();
`
    }
    return `const allure = require('allure-js-commons');
const { ContentType } = require('allure-js-commons');

class AllureHelper {
  async attachScreenshot(page) {
    const buffer = await page.screenshot({ fullPage: true });
    await allure.attachment('Screenshot', buffer, ContentType.PNG);
  }
}

module.exports = new AllureHelper();
`
  }

  if (config.framework === "wdio") {
    if (ext === "ts") {
      return `import allureReporter from '@wdio/allure-reporter';

export function attachText(name: string, content: string) {
  allureReporter.addAttachment(name, content, 'text/plain');
}
`
    }
    return `const allureReporter = require('@wdio/allure-reporter');

function attachText(name, content) {
  allureReporter.addAttachment(name, content, 'text/plain');
}

module.exports = { attachText };
`
  }

  if (ext === "ts") {
    return `import * as allure from 'allure-js-commons';

export async function attachText(name: string, content: string) {
  await allure.attachment(name, content, 'text/plain');
}
`
  }
  return `const allure = require('allure-js-commons');

async function attachText(name, content) {
  await allure.attachment(name, content, 'text/plain');
}

module.exports = { attachText };
`
}

function playwrightHelpersFixtures(ext: "ts" | "js"): string {
  if (ext === "ts") {
    return `import { test as base } from '@playwright/test';
import AllureHelper from './allure-helper';

type HelperFixtures = {
  saveFailureScreenshot: void;
};

export const test = base.extend<HelperFixtures>({
  saveFailureScreenshot: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        await AllureHelper.attachScreenshot(page);
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
`
  }
  return `const { test: base, expect } = require('@playwright/test');
const AllureHelper = require('./allure-helper');

const test = base.extend({
  saveFailureScreenshot: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        await AllureHelper.attachScreenshot(page);
      }
    },
    { auto: true },
  ],
});

module.exports = { test, expect };
`
}

function playwrightPageObjectFixtures(ext: "ts" | "js"): string {
  if (ext === "ts") {
    return `import { test as helperTest } from './helpers-fixtures';
import { LoginPage } from '../tests/pages/LoginPage';

type PageObjectFixtures = {
  loginPage: LoginPage;
};

export const test = helperTest.extend<PageObjectFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
`
  }
  return `const { test: helperTest, expect } = require('./helpers-fixtures');
const { LoginPage } = require('../tests/pages/LoginPage');

const test = helperTest.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

module.exports = { test, expect };
`
}

function wdioHooks(ext: "ts" | "js"): string {
  if (ext === "ts") {
    return `import { attachText } from './allure-helper';

export function registerFailureHooks() {
  afterEach(async function () {
    if (this.currentTest?.state === 'failed') {
      const screenshot = await browser.takeScreenshot();
      attachText('Screenshot', Buffer.from(screenshot, 'base64').toString('base64'));
    }
  });
}
`
  }
  return `const { attachText } = require('./allure-helper');

function registerFailureHooks() {
  afterEach(async function () {
    if (this.currentTest?.state === 'failed') {
      const screenshot = await browser.takeScreenshot();
      attachText('Screenshot', Buffer.from(screenshot, 'base64').toString('base64'));
    }
  });
}

module.exports = { registerFailureHooks };
`
}

function wdioPagesIndex(ext: "ts" | "js"): string {
  if (ext === "ts") {
    return `import { LoginPage } from './LoginPage';

export function createLoginPage(browser: WebdriverIO.Browser) {
  return new LoginPage(browser);
}
`
  }
  return `const { LoginPage } = require('./LoginPage');

function createLoginPage(browser) {
  return new LoginPage(browser);
}

module.exports = { createLoginPage };
`
}

function cypressAllureHooks(ext: "ts" | "js"): string {
  if (ext === "ts") {
    return `import { attachText } from '../../lib/allure-helper';

afterEach(function () {
  if (this.currentTest?.state === 'failed') {
    cy.screenshot({ capture: 'fullPage' }).then(async () => {
      await attachText('Failure context', this.currentTest?.title ?? 'failed test');
    });
  }
});
`
  }
  return `const { attachText } = require('../../lib/allure-helper');

afterEach(function () {
  if (this.currentTest?.state === 'failed') {
    cy.screenshot({ capture: 'fullPage' }).then(async () => {
      await attachText('Failure context', this.currentTest?.title ?? 'failed test');
    });
  }
});
`
}

export function generatePlaywrightServiceConfig(config: Config): FileNode[] {
  if (config.framework !== "playwright" || !config.integrations.testlio) {
    return []
  }

  return [
    file(
      "playwright.service.config.ts",
      `import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

// Azure Playwright Testing service template.
// Set PLAYWRIGHT_SERVICE_ACCESS_TOKEN and PLAYWRIGHT_SERVICE_URL in .env before use.
process.env.PLAYWRIGHT_SERVICE_RUN_ID =
  process.env.PLAYWRIGHT_SERVICE_RUN_ID ?? new Date().toISOString();

const { projects: _projects, ...baseWithoutProjects } = baseConfig;

export default defineConfig({
  ...baseWithoutProjects,
  workers: 1,
  reporter: [
    ['line'],
    ['allure-playwright', { detail: false, resultsDir: 'allure-results' }],
  ],
  use: {
    ...baseConfig.use,
    connectOptions: {
      wsEndpoint: \`\${process.env.PLAYWRIGHT_SERVICE_URL}?cap=\${JSON.stringify({
        os: process.env.PLAYWRIGHT_SERVICE_OS ?? 'linux',
        runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID,
      })}\`,
      headers: {
        'x-mpt-access-key': process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN ?? '',
      },
    },
  },
  projects: baseConfig.projects ?? [],
});
`,
      "typescript",
    ),
  ]
}
