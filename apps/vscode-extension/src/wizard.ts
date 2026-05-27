import * as vscode from "vscode"
import {
  generateProject,
  officialPresets,
  parsePresetJson,
  type APITool,
  type CIProvider,
  type Config,
  type Framework,
  type Language,
  type Pattern,
} from "@qa-boilerplate/generator"
import { defaultConfig } from "./defaultConfig"
import {
  buildWritePlan,
  confirmOverwrite,
  pickWorkspaceFolder,
  projectTargetDir,
  resolvePlansUnderProject,
  writeProjectToWorkspace,
} from "./fileWriter"
import { flattenFilePaths, formatTreePreview } from "./treePreview"

type SourceKind = "official" | "import" | "manual"

export async function runGenerateWizard(): Promise<void> {
  const folder = await pickWorkspaceFolder()
  if (!folder) {
    return
  }

  const source = await pickSource()
  if (!source) {
    return
  }

  let config: Config | undefined

  switch (source) {
    case "official":
      config = await pickOfficialPreset()
      break
    case "import":
      config = await importPresetFromFile()
      break
    case "manual":
      config = await configureManually(structuredClone(defaultConfig))
      break
  }

  if (!config) {
    return
  }

  const customize = await vscode.window.showQuickPick(
    [
      { label: "Generate now", value: false },
      { label: "Customize settings", value: true },
    ],
    { placeHolder: "Use preset as-is or customize?" },
  )
  if (!customize) {
    return
  }

  if (customize.value) {
    config = await configureManually(config)
    if (!config) {
      return
    }
  }

  const project = generateProject(config)
  const paths = flattenFilePaths(project.tree)
  const preview = formatTreePreview(paths)

  const previewChoice = await vscode.window.showInformationMessage(
    `${paths.length} file(s) will be generated under ${config.projectName}/`,
    { modal: true, detail: preview },
    "Continue",
    "Cancel",
  )
  if (previewChoice !== "Continue") {
    return
  }

  const targetDir = projectTargetDir(folder, config.projectName)
  const basePlans = await buildWritePlan(project, folder)
  const plans = resolvePlansUnderProject(basePlans, targetDir)
  const existing = plans.filter((p) => p.exists).map((p) => p.relativePath)

  if (!(await confirmOverwrite(existing))) {
    return
  }

  const result = await writeProjectToWorkspace(plans)
  if (result.failed.length > 0) {
    void vscode.window.showErrorMessage(
      `Generated with errors: ${result.written} written, ${result.failed.length} failed. See Output.`,
    )
    const channel = vscode.window.createOutputChannel("QA Gen")
    channel.appendLine(result.failed.join("\n"))
    channel.show()
    return
  }

  void vscode.window.showInformationMessage(
    `QA Gen: wrote ${result.written} file(s) to ${config.projectName}/`,
  )
}

async function pickSource(): Promise<SourceKind | undefined> {
  const choice = await vscode.window.showQuickPick(
    [
      {
        label: "Official preset",
        description: "Nine curated Playwright, WDIO, and Cypress starters",
        value: "official" as const,
      },
      {
        label: "Import JSON preset",
        description: "Validate and apply a preset file from disk",
        value: "import" as const,
      },
      {
        label: "Configure manually",
        description: "Step through framework, language, and options",
        value: "manual" as const,
      },
    ],
    { placeHolder: "How do you want to configure the project?" },
  )
  return choice?.value
}

async function pickOfficialPreset(): Promise<Config | undefined> {
  const items = officialPresets.map((preset) => ({
    label: preset.name,
    description: preset.description,
    detail: preset.tags?.join(", "),
    preset,
  }))
  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: "Select an official preset",
    matchOnDescription: true,
    matchOnDetail: true,
  })
  if (!picked) {
    return undefined
  }
  return structuredClone(picked.preset.config)
}

async function importPresetFromFile(): Promise<Config | undefined> {
  const uris = await vscode.window.showOpenDialog({
    canSelectMany: false,
    filters: { "Preset JSON": ["json"] },
    openLabel: "Import preset",
  })
  const uri = uris?.[0]
  if (!uri) {
    return undefined
  }

  const bytes = await vscode.workspace.fs.readFile(uri)
  const json = Buffer.from(bytes).toString("utf8")
  const result = parsePresetJson(json)
  if (!result.success) {
    const message = result.errors
      .map((e) => `${e.path}: ${e.message}`)
      .join("; ")
    void vscode.window.showErrorMessage(`Invalid preset: ${message}`)
    return undefined
  }
  void vscode.window.showInformationMessage(
    `Loaded preset "${result.preset.name}" (${result.preset.id})`,
  )
  return structuredClone(result.preset.config)
}

async function configureManually(
  config: Config,
): Promise<Config | undefined> {
  const projectName = await vscode.window.showInputBox({
    prompt: "Project folder name",
    value: config.projectName,
    validateInput: (v) =>
      v.trim().length > 0 ? null : "Project name is required",
  })
  if (projectName === undefined) {
    return undefined
  }
  config.projectName = projectName.trim()

  const framework = await pickEnum<Framework>(
    "Framework",
    [
      { label: "Playwright", value: "playwright" },
      { label: "WebdriverIO v9", value: "wdio" },
      { label: "Cypress", value: "cypress" },
    ],
    config.framework,
  )
  if (!framework) {
    return undefined
  }
  config = applyFrameworkRules(config, framework)

  const language = await pickEnum<Language>(
    "Language",
    [
      { label: "TypeScript", value: "ts" },
      { label: "JavaScript", value: "js" },
    ],
    config.language,
  )
  if (!language) {
    return undefined
  }
  config.language = language

  const pattern = await pickEnum<Pattern>(
    "Test pattern",
    [
      { label: "Page Object Model", value: "pom" },
      { label: "Screenplay", value: "screenplay" },
      { label: "None", value: "none" },
    ],
    config.pattern,
  )
  if (!pattern) {
    return undefined
  }
  config.pattern = pattern

  const ciProvider = await pickEnum<CIProvider>(
    "CI provider",
    [
      { label: "None", value: "none" },
      { label: "GitHub Actions", value: "github" },
      { label: "GitLab CI", value: "gitlab" },
    ],
    config.ci.provider,
  )
  if (!ciProvider) {
    return undefined
  }
  config.ci = { provider: ciProvider }

  const eslint = await pickYesNo("Enable ESLint?", config.linting.eslint)
  if (eslint === undefined) {
    return undefined
  }
  config.linting = { ...config.linting, eslint }

  const prettier = await pickYesNo("Enable Prettier?", config.linting.prettier)
  if (prettier === undefined) {
    return undefined
  }
  config.linting = { ...config.linting, prettier }

  const dotenv = await pickYesNo("Include dotenv setup?", config.env.dotenv)
  if (dotenv === undefined) {
    return undefined
  }
  config.env = { dotenv }

  const zod = await pickYesNo("Enable Zod validation helpers?", config.validation.zod)
  if (zod === undefined) {
    return undefined
  }
  config.validation = { zod }

  const reporting = await pickReporting(config)
  if (!reporting) {
    return undefined
  }
  config.reporting = reporting
  if (!reporting.allure && config.integrations.testlio) {
    config.integrations = { ...config.integrations, testlio: false }
  }

  const apiTool = await pickApiTool(config)
  if (!apiTool) {
    return undefined
  }
  config.apiTesting = { tool: apiTool }

  const testlio = await pickYesNo(
    "Enable Testlio integration? (requires Allure reporting)",
    config.integrations.testlio,
  )
  if (testlio === undefined) {
    return undefined
  }
  if (testlio && !config.reporting.allure) {
    void vscode.window.showWarningMessage(
      "Testlio requires Allure reporting. Enable Allure or disable Testlio.",
    )
    config.integrations.testlio = false
  } else {
    config.integrations = { ...config.integrations, testlio }
  }

  const mailinator = await pickYesNo(
    "Enable Mailinator helper?",
    config.integrations.mailinator,
  )
  if (mailinator === undefined) {
    return undefined
  }
  config.integrations = { ...config.integrations, mailinator }

  return config
}

function applyFrameworkRules(config: Config, framework: Framework): Config {
  let reporting = config.reporting
  if (framework !== "wdio" && reporting.dot) {
    reporting = { ...reporting, dot: false }
  }
  let apiTesting = config.apiTesting
  if (framework !== "playwright" && apiTesting.tool === "playwright-built-in") {
    apiTesting = { tool: "none" }
  }
  let integrations = config.integrations
  if (!reporting.allure && integrations.testlio) {
    integrations = { ...integrations, testlio: false }
  }
  return { ...config, framework, reporting, apiTesting, integrations }
}

async function pickReporting(
  config: Config,
): Promise<Config["reporting"] | undefined> {
  const allure = await pickYesNo("Allure reporting?", config.reporting.allure)
  if (allure === undefined) {
    return undefined
  }
  let html = config.reporting.html
  let dot = config.reporting.dot
  if (config.framework === "playwright" || config.framework === "cypress") {
    const htmlPick = await pickYesNo("HTML / Mochawesome reporting?", html)
    if (htmlPick === undefined) {
      return undefined
    }
    html = htmlPick
  }
  if (config.framework === "wdio") {
    const dotPick = await pickYesNo("WDIO dot reporter?", dot)
    if (dotPick === undefined) {
      return undefined
    }
    dot = dotPick
  }
  return { allure, html, dot }
}

async function pickApiTool(config: Config): Promise<APITool | undefined> {
  const options: { label: string; value: APITool }[] = [
    { label: "None", value: "none" },
  ]
  if (config.framework === "playwright") {
    options.push({
      label: "Playwright built-in request",
      value: "playwright-built-in",
    })
  }
  options.push(
    { label: "Axios", value: "axios" },
    { label: "Supertest", value: "supertest" },
  )
  return pickEnum("API testing tool", options, config.apiTesting.tool)
}

async function pickEnum<T extends string>(
  title: string,
  options: { label: string; value: T }[],
  current: T,
): Promise<T | undefined> {
  const items = options.map((o) => ({
    label: o.label,
    value: o.value,
    picked: o.value === current,
  }))
  const choice = await vscode.window.showQuickPick(items, {
    placeHolder: title,
  })
  return choice?.value
}

async function pickYesNo(
  prompt: string,
  current: boolean,
): Promise<boolean | undefined> {
  const choice = await vscode.window.showQuickPick(
    [
      { label: "Yes", value: true, picked: current },
      { label: "No", value: false, picked: !current },
    ],
    { placeHolder: prompt },
  )
  if (choice === undefined) {
    return undefined
  }
  return choice.value
}
