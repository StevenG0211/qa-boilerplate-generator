import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { shouldGenerateTestlioLib } from "../blocks/integrations/shared"
import { file, folder } from "../nodes"
import { fileExtension } from "../ext"

export function generateWdioNodes(config: Config): FileNode[] {
  const ext = fileExtension(config)
  const lang = ext === "ts" ? "typescript" : "javascript"
  const nodes: FileNode[] = []

  nodes.push(file(`wdio.conf.${ext}`, wdioConf(config), lang))

  if (ext === "ts") {
    nodes.push(file("tsconfig.json", wdioTsconfig(), "json"))
  }

  const srcChildren: FileNode[] = []

  if (config.pattern === "pom") {
    srcChildren.push(
      folder("pages", [file(`LoginPage.${ext}`, wdioLoginPage(config), lang)]),
    )
  }

  if (config.pattern === "screenplay") {
    srcChildren.push(
      folder("actors", []),
      folder("tasks", []),
      folder("questions", []),
    )
  }

  if (srcChildren.length > 0) {
    nodes.push(folder("src", srcChildren))
  }

  nodes.push(
    folder("test", [
      folder("specs", [file(`smoke.${ext}`, wdioSmokeSpec(config), lang)]),
    ]),
  )

  return nodes
}

function wdioConf(config: Config): string {
  const ext = fileExtension(config)
  const reporters: string[] = ["'spec'"]

  if (config.reporting.allure) {
    reporters.push("['allure', { outputDir: 'allure-results' }]")
  }
  if (config.reporting.html) {
    reporters.push(`['html-nice', {
      outputDir: './reports/html-reports',
      filename: 'report.html',
      reportTitle: 'Test report',
      linkScreenshots: true,
      showInBrowser: false,
      collapseTests: false,
      useOnAfterCommandForScreenshot: false,
    }]`)
  }
  if (config.reporting.dot) {
    reporters.push("'dot'")
  }

  const reportersBlock = reporters.join(",\n    ")
  const specsGlob =
    ext === "ts" ? "'./test/specs/**/*.ts'" : "'./test/specs/**/*.js'"

  const inner = `{\n  runner: 'local',\n  // All .ts/.js files under test/specs (WDIO does not require *.spec.ts)\n  specs: [${specsGlob}],\n  maxInstances: 1,\n  capabilities: [\n    {\n      browserName: 'chrome',\n      'goog:chromeOptions': {\n        args: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],\n      },\n    },\n  ],\n  logLevel: 'info',\n  framework: 'mocha',\n  reporters: [\n    ${reportersBlock}\n  ],\n  mochaOpts: {\n    ui: 'bdd',\n    timeout: 60000,\n  },\n}`

  if (ext === "ts") {
    return `export const config = ${inner}\n\nexport default config\n`
  }

  return `exports.config = ${inner}\n`
}

function wdioTsconfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node", "@wdio/globals/types", "@wdio/mocha-framework"]
  },
  "include": ["wdio.conf.ts", "src/**/*.ts", "test/**/*.ts"]
}
`
}

function wdioLoginPage(config: Config): string {
  const ext = fileExtension(config)
  if (ext === "ts") {
    return `import type { ChainablePromiseElement } from 'webdriverio'

export class LoginPage {
  constructor(private browser: WebdriverIO.Browser) {}

  get usernameInput(): ChainablePromiseElement {
    return this.browser.$('#username')
  }

  get passwordInput(): ChainablePromiseElement {
    return this.browser.$('#password')
  }

  get submitButton(): ChainablePromiseElement {
    return this.browser.$('button[type="submit"]')
  }

  async open(path: string = '/login') {
    await this.browser.url(path)
  }
}
`
  }
  return `class LoginPage {
  constructor(browser) {
    this.browser = browser
  }

  get usernameInput() {
    return this.browser.$('#username')
  }

  get passwordInput() {
    return this.browser.$('#password')
  }

  get submitButton() {
    return this.browser.$('button[type="submit"]')
  }

  async open(path = '/login') {
    await this.browser.url(path)
  }
}

module.exports = { LoginPage }
`
}

function wdioSmokeSpec(config: Config): string {
  const ext = fileExtension(config)
  const hooksPrefix =
    ext === "ts"
      ? `import { registerFailureHooks } from '../../lib/hooks';\n\nregisterFailureHooks();\n\n`
      : `const { registerFailureHooks } = require('../../lib/hooks');\n\nregisterFailureHooks();\n\n`
  const prefix = shouldGenerateTestlioLib(config) ? hooksPrefix : ""

  if (config.pattern === "pom") {
    if (ext === "ts") {
      return `${prefix}import { expect } from 'expect-webdriverio'
import { LoginPage } from '../../src/pages/LoginPage'

describe('login page', () => {
  it('has inputs', async () => {
    const page = new LoginPage(browser)
    await page.open('https://example.com')
    await expect(page.usernameInput).toBeExisting()
  })
})
`
    }
    return `${prefix}const { expect } = require('expect-webdriverio')
const { LoginPage } = require('../../src/pages/LoginPage')

describe('login page', () => {
  it('has inputs', async () => {
    const page = new LoginPage(browser)
    await page.open('https://example.com')
    await expect(page.usernameInput).toBeExisting()
  })
})
`
  }

  if (ext === "ts") {
    return `${prefix}import { expect } from 'expect-webdriverio'

describe('smoke', () => {
  it('loads example.com', async () => {
    await browser.url('https://example.com')
    await expect(browser).toHaveTitle(expect.stringContaining('Example'))
  })
})
`
  }
  return `${prefix}const { expect } = require('expect-webdriverio')

describe('smoke', () => {
  it('loads example.com', async () => {
    await browser.url('https://example.com')
    await expect(browser).toHaveTitle(expect.stringContaining('Example'))
  })
})
`
}

