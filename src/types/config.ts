export type Framework = "wdio" | "playwright" | "cypress"

export type Language = "ts" | "js"

export type Pattern = "pom" | "screenplay" | "none"

export type CIProvider = "github" | "gitlab" | "none"

export type APITool = "supertest" | "axios" | "playwright-built-in" | "none"

export type ReportingConfig = {
  allure: boolean
  html: boolean
  dot: boolean
}

export type CIConfig = {
  provider: CIProvider
}

export type LintingConfig = {
  eslint: boolean
  prettier: boolean
}

export type EnvConfig = {
  dotenv: boolean
}

export type ValidationConfig = {
  zod: boolean
}

export type APITestingConfig = {
  tool: APITool
}

export type Config = {
  projectName: string
  framework: Framework
  language: Language
  pattern: Pattern
  reporting: ReportingConfig
  ci: CIConfig
  linting: LintingConfig
  env: EnvConfig
  validation: ValidationConfig
  apiTesting: APITestingConfig
}
