import type { Config } from "@/types"

export function shouldGenerateLibHelpers(config: Config): boolean {
  return (
    config.integrations.testlio ||
    config.reporting.allure ||
    config.integrations.mailinator
  )
}

export function shouldGenerateTestlioLib(config: Config): boolean {
  return config.integrations.testlio || config.reporting.allure
}
