import type {
  APITestingConfig,
  CIConfig,
  Config,
  EnvConfig,
  Framework,
  Language,
  LintingConfig,
  Pattern,
  ReportingConfig,
  ValidationConfig,
} from "@/types"
import type { Preset, PresetSource } from "@/presets"
import { defaultConfig } from "./defaultConfig"

export type ActivePreset = {
  id: string
  name: string
  source: PresetSource
  customized: boolean
  fileName?: string
}

export type ConfigAction =
  | { type: "SET_PROJECT_NAME"; payload: string }
  | { type: "SET_FRAMEWORK"; payload: Framework }
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_PATTERN"; payload: Pattern }
  | { type: "SET_REPORTING"; payload: ReportingConfig }
  | { type: "SET_CI"; payload: CIConfig }
  | { type: "SET_LINTING"; payload: LintingConfig }
  | { type: "SET_ENV"; payload: EnvConfig }
  | { type: "SET_VALIDATION"; payload: ValidationConfig }
  | { type: "SET_API_TESTING"; payload: APITestingConfig }
  | { type: "APPLY_PRESET"; payload: { preset: Preset; fileName?: string } }
  | { type: "CLEAR_PRESET" }
  | { type: "REPLACE_CONFIG"; payload: Config }
  | { type: "RESET" }

export function configReducer(state: Config, action: ConfigAction): Config {
  switch (action.type) {
    case "SET_PROJECT_NAME":
      return { ...state, projectName: action.payload }
    case "SET_FRAMEWORK": {
      const framework = action.payload
      let reporting = state.reporting
      if (framework !== "wdio" && reporting.dot) {
        reporting = { ...reporting, dot: false }
      }
      let apiTesting = state.apiTesting
      if (
        framework !== "playwright" &&
        apiTesting.tool === "playwright-built-in"
      ) {
        apiTesting = { tool: "none" }
      }
      return { ...state, framework, reporting, apiTesting }
    }
    case "SET_LANGUAGE":
      return { ...state, language: action.payload }
    case "SET_PATTERN":
      return { ...state, pattern: action.payload }
    case "SET_REPORTING":
      return { ...state, reporting: action.payload }
    case "SET_CI":
      return { ...state, ci: action.payload }
    case "SET_LINTING":
      return { ...state, linting: action.payload }
    case "SET_ENV":
      return { ...state, env: action.payload }
    case "SET_VALIDATION":
      return { ...state, validation: action.payload }
    case "SET_API_TESTING":
      return { ...state, apiTesting: action.payload }
    case "APPLY_PRESET":
      return structuredClone(action.payload.preset.config)
    case "REPLACE_CONFIG":
      return structuredClone(action.payload)
    case "CLEAR_PRESET":
      return state
    case "RESET":
      return structuredClone(defaultConfig)
    default:
      return state
  }
}
