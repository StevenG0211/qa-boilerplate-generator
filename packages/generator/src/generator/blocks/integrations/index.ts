import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { generateLibNodes, generatePlaywrightServiceConfig } from "./lib"
import { generateMailinatorNodes } from "./mailinator"
import { generateTestlioCliNodes } from "./testlio"

export function generateIntegrationsNodes(config: Config): FileNode[] {
  return [
    ...generateTestlioCliNodes(config),
    ...generateMailinatorNodes(config),
    ...generateLibNodes(config),
    ...generatePlaywrightServiceConfig(config),
  ]
}
