"use client"

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react"
import type { Config } from "@qa-boilerplate/generator"
import {
  configReducer,
  type ActivePreset,
  type ConfigAction,
} from "./configActions"
import { defaultConfig } from "./defaultConfig"

type ConfigContextValue = {
  config: Config
  activePreset: ActivePreset | null
  dispatch: Dispatch<ConfigAction>
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, dispatchConfig] = useReducer(configReducer, defaultConfig)
  const [activePreset, setActivePreset] = useState<ActivePreset | null>(null)

  const dispatch = useCallback<Dispatch<ConfigAction>>(
    (action) => {
      if (action.type === "APPLY_PRESET") {
        const { preset, fileName } = action.payload
        setActivePreset({
          id: preset.id,
          name: preset.name,
          source: preset.source,
          customized: false,
          fileName,
        })
        dispatchConfig(action)
        return
      }

      if (action.type === "CLEAR_PRESET") {
        setActivePreset(null)
        dispatchConfig(action)
        return
      }

      if (action.type === "RESET") {
        setActivePreset(null)
        dispatchConfig(action)
        return
      }

      setActivePreset((current) =>
        current ? { ...current, customized: true } : current,
      )
      dispatchConfig(action)
    },
    [dispatchConfig],
  )

  return (
    <ConfigContext.Provider value={{ config, activePreset, dispatch }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext)
  if (!ctx) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return ctx
}
