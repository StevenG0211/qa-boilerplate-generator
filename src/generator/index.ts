import type { Config, FileNode, GeneratedProject } from "@/types"
import { generateSharedBlockNodes } from "./blocks"
import { generateApiNodes } from "./blocks/api"
import { generateIntegrationsNodes } from "./blocks/integrations"
import { generateFrameworkNodes } from "./frameworks"
import { mergeFileNodes } from "./mergeTree"
import { file } from "./nodes"
import { generatePackageJson } from "./packageJson"
import { generateReadme } from "./readme"

export { file, folder } from "./nodes"
export { generatePackageJson } from "./packageJson"

export function generateProject(config: Config): GeneratedProject {
  const raw: FileNode[] = [
    file("package.json", generatePackageJson(config), "json"),
    file("README.md", generateReadme(config), "markdown"),
    ...generateSharedBlockNodes(config),
    ...generateApiNodes(config),
    ...generateIntegrationsNodes(config),
    ...generateFrameworkNodes(config),
  ]

  return {
    projectName: config.projectName,
    tree: mergeFileNodes(raw),
  }
}
