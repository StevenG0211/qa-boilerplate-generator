import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { generateCiNodes } from "./ci"
import { generateEnvNodes } from "./env"
import { generateLintingNodes } from "./linting"
import { generateZodNodes } from "./zodSchemas"

export function generateSharedBlockNodes(config: Config): FileNode[] {
  return [
    ...generateCiNodes(config),
    ...generateLintingNodes(config),
    ...generateEnvNodes(config),
    ...generateZodNodes(config),
  ]
}
