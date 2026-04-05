"use client"

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import type { Config } from "@/types"
import { configReducer, type ConfigAction } from "./configActions"
import { defaultConfig } from "./defaultConfig"

type ConfigContextValue = {
  config: Config
  dispatch: Dispatch<ConfigAction>
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(configReducer, defaultConfig)

  return (
    <ConfigContext.Provider value={{ config, dispatch }}>
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
