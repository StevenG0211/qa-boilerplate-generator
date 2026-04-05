import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../nodes"
import { fileExtension } from "../ext"

export function generateCypressNodes(config: Config): FileNode[] {
  const ext = fileExtension(config)
  const lang = ext === "ts" ? "typescript" : "javascript"

  const cypressChildren: FileNode[] = [
    folder("e2e", [file(`smoke.cy.${ext}`, cypressSmokeSpec(config), lang)]),
    folder("support", [
      file(`e2e.${ext}`, cypressSupportE2e(config), lang),
      file(`commands.${ext}`, cypressCommands(config), lang),
    ]),
  ]

  if (config.pattern === "pom") {
    cypressChildren.push(folder("pages", [file(`LoginPage.${ext}`, cypressLoginPage(config), lang)]))
  }

  if (config.pattern === "screenplay") {
    cypressChildren.push(
      folder("actors", []),
      folder("tasks", []),
      folder("questions", []),
    )
  }

  if (config.apiTesting.tool === "supertest" || config.apiTesting.tool === "axios") {
    cypressChildren.push(folder("api", [file(`apiClient.${ext}`, cypressApiStub(config), lang)]))
  }

  const nodes: FileNode[] = [
    file(`cypress.config.${ext}`, cypressConfig(config), lang),
    folder("cypress", cypressChildren),
  ]

  if (ext === "ts") {
    nodes.push(file("tsconfig.json", cypressTsconfig(), "json"))
  }

  return nodes
}

function cypressConfig(config: Config): string {
  const ext = fileExtension(config)
  const allure = config.reporting.allure
  const html = config.reporting.html

  if (ext === "ts") {
    const imports: string[] = ["import { defineConfig } from 'cypress'"]
    if (allure) {
      imports.push("import allureWriter from '@shelex/cypress-allure-plugin/writer'")
    }
    if (html) {
      imports.push("import mochawesome from 'cypress-mochawesome-reporter/plugin'")
    }

    const events: string[] = []
    if (allure) events.push("allureWriter(on, config)")
    if (html) events.push("mochawesome(on)")

    const setup =
      events.length > 0
        ? `setupNodeEvents(on, config) {
      ${events.join("\n      ")}
      return config
    }`
        : `setupNodeEvents(on, config) { return config }`

    return `${imports.join("\n")}

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.ts',
    ${setup},
  },
})
`
  }

  const requires: string[] = ["const { defineConfig } = require('cypress')"]
  if (allure) {
    requires.push(
      "const allureWriter = require('@shelex/cypress-allure-plugin/writer')",
    )
  }
  if (html) {
    requires.push("const mochawesome = require('cypress-mochawesome-reporter/plugin')")
  }

  const events: string[] = []
  if (allure) events.push("allureWriter(on, config)")
  if (html) events.push("mochawesome(on)")

  const setup =
    events.length > 0
      ? `setupNodeEvents(on, config) {
      ${events.join("\n      ")}
      return config
    }`
      : `setupNodeEvents(on, config) { return config }`

  return `${requires.join("\n")}

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    ${setup},
  },
})
`
}

function cypressTsconfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["cypress", "node"]
  },
  "include": ["cypress/**/*.ts", "cypress.config.ts"]
}
`
}

function cypressSupportE2e(config: Config): string {
  const ext = fileExtension(config)
  if (ext === "ts") {
    return `import './commands'\n`
  }
  return `require('./commands')\n`
}

function cypressCommands(config: Config): string {
  const ext = fileExtension(config)
  if (ext === "ts") {
    return `export {}\n`
  }
  return `module.exports = {}\n`
}

function cypressSmokeSpec(config: Config): string {
  const ext = fileExtension(config)
  if (config.pattern === "pom") {
    if (ext === "ts") {
      return `import { LoginPage } from '../pages/LoginPage'

describe('smoke', () => {
  it('visits', () => {
    const login = new LoginPage()
    login.visit('https://example.com')
    cy.contains('Example')
  })
})
`
    }
    return `const { LoginPage } = require('../pages/LoginPage')

describe('smoke', () => {
  it('visits', () => {
    const login = new LoginPage()
    login.visit('https://example.com')
    cy.contains('Example')
  })
})
`
  }

  if (ext === "ts") {
    return `describe('smoke', () => {
  it('loads example', () => {
    cy.visit('https://example.com')
    cy.title().should('contain', 'Example')
  })
})
`
  }
  return `describe('smoke', () => {
  it('loads example', () => {
    cy.visit('https://example.com')
    cy.title().should('contain', 'Example')
  })
})
`
}

function cypressLoginPage(config: Config): string {
  const ext = fileExtension(config)
  if (ext === "ts") {
    return `export class LoginPage {
  visit(url: string) {
    cy.visit(url)
  }

  get username() {
    return cy.get('[data-testid="username"]')
  }
}
`
  }
  return `class LoginPage {
  visit(url) {
    cy.visit(url)
  }

  get username() {
    return cy.get('[data-testid="username"]')
  }
}

module.exports = { LoginPage }
`
}

function cypressApiStub(config: Config): string {
  const tool = config.apiTesting.tool
  const ext = fileExtension(config)

  if (tool === "supertest") {
    if (ext === "ts") {
      return `import request from 'supertest'

export function createClient(baseUrl: string) {
  return request(baseUrl)
}
`
    }
    return `const request = require('supertest')

function createClient(baseUrl) {
  return request(baseUrl)
}

module.exports = { createClient }
`
  }

  if (tool === "axios") {
    if (ext === "ts") {
      return `import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.API_BASE_URL ?? 'http://localhost:4000',
})
`
    }
    return `const axios = require('axios')

const api = axios.create({
  baseURL: process.env.API_BASE_URL ?? 'http://localhost:4000',
})

module.exports = { api }
`
  }

  return ''
}
