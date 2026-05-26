import cypressJsMinimal from "../../presets/official/cypress-js-minimal.json"
import cypressTsPomHtml from "../../presets/official/cypress-ts-pom-html.json"
import playwrightApiZod from "../../presets/official/playwright-api-zod.json"
import playwrightTsPom from "../../presets/official/playwright-ts-pom.json"
import wdioApiAxios from "../../presets/official/wdio-api-axios.json"
import wdioTsPomAllure from "../../presets/official/wdio-ts-pom-allure.json"
import { validatePreset } from "./validatePreset"

const rawOfficialPresets = [
  playwrightTsPom,
  playwrightApiZod,
  wdioTsPomAllure,
  wdioApiAxios,
  cypressTsPomHtml,
  cypressJsMinimal,
] as const

export const officialPresets = rawOfficialPresets.map((preset) => {
  const result = validatePreset(preset)
  if (!result.success) {
    const messages = result.errors
      .map((error) => `${error.path}: ${error.message}`)
      .join("; ")
    throw new Error(`Invalid official preset: ${messages}`)
  }
  return result.preset
})
