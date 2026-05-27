import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { generateCypressNodes } from "./cypress"
import { generatePlaywrightNodes } from "./playwright"
import { generateWdioNodes } from "./wdio"

export function generateFrameworkNodes(config: Config): FileNode[] {
  switch (config.framework) {
    case "playwright":
      return generatePlaywrightNodes(config)
    case "wdio":
      return generateWdioNodes(config)
    case "cypress":
      return generateCypressNodes(config)
    default: {
      const _n: never = config.framework
      return _n
    }
  }
}
