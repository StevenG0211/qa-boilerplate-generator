import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { generateCypressApiNodes } from "./cypressApi"
import { generatePlaywrightApiNodes } from "./playwrightApi"
import { generateWdioApiNodes } from "./wdioApi"

export function generateApiNodes(config: Config): FileNode[] {
  switch (config.framework) {
    case "playwright":
      return generatePlaywrightApiNodes(config)
    case "wdio":
      return generateWdioApiNodes(config)
    case "cypress":
      return generateCypressApiNodes(config)
  }
}
