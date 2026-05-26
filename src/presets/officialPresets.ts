import cypressJsMinimal from "../../presets/official/cypress-js-minimal.json"
import cypressTestlioTsPom from "../../presets/official/cypress-testlio-ts-pom.json"
import cypressTsPomHtml from "../../presets/official/cypress-ts-pom-html.json"
import playwrightApiZod from "../../presets/official/playwright-api-zod.json"
import playwrightTestlioTsPom from "../../presets/official/playwright-testlio-ts-pom.json"
import playwrightTsPom from "../../presets/official/playwright-ts-pom.json"
import wdioApiAxios from "../../presets/official/wdio-api-axios.json"
import wdioTestlioTsPom from "../../presets/official/wdio-testlio-ts-pom.json"
import wdioTsPomAllure from "../../presets/official/wdio-ts-pom-allure.json"
import { validatePreset } from "./validatePreset"

const rawOfficialPresets = [
  playwrightTsPom,
  playwrightApiZod,
  playwrightTestlioTsPom,
  wdioTsPomAllure,
  wdioApiAxios,
  wdioTestlioTsPom,
  cypressTsPomHtml,
  cypressJsMinimal,
  cypressTestlioTsPom,
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
