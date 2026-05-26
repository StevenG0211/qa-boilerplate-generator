import { describe, expect, it } from "vitest"
import type { Preset } from "./schema"
import { generateProject } from "@/generator"
import { officialPresets } from "./officialPresets"
import { parsePresetJson, validatePreset } from "./validatePreset"

const validUploadedPreset: Preset = {
  schemaVersion: 1,
  id: "uploaded-playwright",
  name: "Uploaded Playwright",
  description: "A valid uploaded Playwright preset.",
  source: "uploaded",
  tags: ["uploaded", "playwright"],
  config: {
    projectName: "uploaded-playwright",
    framework: "playwright",
    language: "ts",
    pattern: "pom",
    reporting: { allure: false, html: true, dot: false },
    ci: { provider: "none" },
    linting: { eslint: true, prettier: true },
    env: { dotenv: true },
    validation: { zod: false },
    apiTesting: { tool: "none" },
  },
}

describe("preset validation", () => {
  it("validates every official preset and generates a project tree", () => {
    expect(officialPresets).toHaveLength(6)

    for (const preset of officialPresets) {
      const result = validatePreset(preset)
      expect(result.success).toBe(true)

      const project = generateProject(preset.config)
      expect(project.projectName).toBe(preset.config.projectName)
      expect(project.tree.some((node) => node.name === "package.json")).toBe(
        true,
      )
    }
  })

  it("parses and validates an uploaded preset JSON file", () => {
    const result = parsePresetJson(JSON.stringify(validUploadedPreset))

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.preset.config.framework).toBe("playwright")
    }
  })

  it("rejects invalid JSON", () => {
    const result = parsePresetJson("{not valid")

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors[0]?.message).toBe("Invalid JSON file.")
    }
  })

  it("rejects unsupported schema versions", () => {
    const result = validatePreset({ ...validUploadedPreset, schemaVersion: 2 })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.errors.some((error) => error.path === "schemaVersion"),
      ).toBe(true)
    }
  })

  it("rejects unknown fields and raw dependency declarations", () => {
    const result = validatePreset({
      ...validUploadedPreset,
      dependencies: { "@playwright/test": "latest" },
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.errors.some((error) => error.message.includes("dependencies")),
      ).toBe(true)
    }
  })

  it("rejects incompatible framework options", () => {
    const cypressDot = validatePreset({
      ...validUploadedPreset,
      config: {
        ...validUploadedPreset.config,
        framework: "cypress",
        reporting: { allure: false, html: false, dot: true },
      },
    })
    const wdioPlaywrightApi = validatePreset({
      ...validUploadedPreset,
      config: {
        ...validUploadedPreset.config,
        framework: "wdio",
        apiTesting: { tool: "playwright-built-in" },
      },
    })

    expect(cypressDot.success).toBe(false)
    expect(wdioPlaywrightApi.success).toBe(false)
  })
})
