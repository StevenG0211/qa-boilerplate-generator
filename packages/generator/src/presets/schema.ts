import { z } from "zod"

export const PRESET_SCHEMA_VERSION = 1 as const

const reportingSchema = z
  .object({
    allure: z.boolean(),
    html: z.boolean(),
    dot: z.boolean(),
  })
  .strict()

const ciSchema = z
  .object({
    provider: z.enum(["github", "gitlab", "none"]),
  })
  .strict()

const lintingSchema = z
  .object({
    eslint: z.boolean(),
    prettier: z.boolean(),
  })
  .strict()

const envSchema = z
  .object({
    dotenv: z.boolean(),
  })
  .strict()

const validationSchema = z
  .object({
    zod: z.boolean(),
  })
  .strict()

const apiTestingSchema = z
  .object({
    tool: z.enum(["supertest", "axios", "playwright-built-in", "none"]),
  })
  .strict()

const integrationsSchema = z
  .object({
    testlio: z.boolean(),
    mailinator: z.boolean(),
  })
  .strict()

export const configSchema = z
  .object({
    projectName: z.string().min(1),
    framework: z.enum(["wdio", "playwright", "cypress"]),
    language: z.enum(["ts", "js"]),
    pattern: z.enum(["pom", "screenplay", "none"]),
    reporting: reportingSchema,
    ci: ciSchema,
    linting: lintingSchema,
    env: envSchema,
    validation: validationSchema,
    apiTesting: apiTestingSchema,
    integrations: integrationsSchema,
  })
  .strict()
  .superRefine((config, ctx) => {
    if (config.framework !== "wdio" && config.reporting.dot) {
      ctx.addIssue({
        code: "custom",
        path: ["reporting", "dot"],
        message: "Dot reporting is only supported for WDIO presets.",
      })
    }

    if (
      config.framework !== "playwright" &&
      config.apiTesting.tool === "playwright-built-in"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["apiTesting", "tool"],
        message:
          "Playwright built-in API testing is only supported for Playwright presets.",
      })
    }

    if (config.integrations.testlio && !config.reporting.allure) {
      ctx.addIssue({
        code: "custom",
        path: ["integrations", "testlio"],
        message: "Testlio integration requires Allure reporting to be enabled.",
      })
    }
  })

export const presetMetadataSchema = z
  .object({
    author: z.string().min(1).optional(),
    homepage: z.string().url().optional(),
    minGeneratorVersion: z.string().min(1).optional(),
  })
  .strict()

export const presetSchema = z
  .object({
    schemaVersion: z.literal(PRESET_SCHEMA_VERSION),
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    source: z.enum(["official", "community", "uploaded"]),
    tags: z.array(z.string().min(1)),
    config: configSchema,
    metadata: presetMetadataSchema.optional(),
  })
  .strict()

export type Preset = z.infer<typeof presetSchema>
export type PresetConfig = z.infer<typeof configSchema>
export type PresetSource = Preset["source"]
