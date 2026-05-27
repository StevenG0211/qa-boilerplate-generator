import { ZodError } from "zod"
import { presetSchema, type Preset } from "./schema"

export type PresetValidationError = {
  path: string
  message: string
}

export type PresetValidationResult =
  | { success: true; preset: Preset }
  | { success: false; errors: PresetValidationError[] }

export function parsePresetJson(json: string): PresetValidationResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(json) as unknown
  } catch {
    return {
      success: false,
      errors: [{ path: "file", message: "Invalid JSON file." }],
    }
  }

  return validatePreset(parsed)
}

export function validatePreset(input: unknown): PresetValidationResult {
  const result = presetSchema.safeParse(input)

  if (result.success) {
    return { success: true, preset: result.data }
  }

  return { success: false, errors: formatPresetErrors(result.error) }
}

function formatPresetErrors(error: ZodError): PresetValidationError[] {
  return error.issues.map((issue) => ({
    path: issue.path.length > 0 ? issue.path.join(".") : "preset",
    message: issue.message,
  }))
}
