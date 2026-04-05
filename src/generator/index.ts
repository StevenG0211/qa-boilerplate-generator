import type { Config, FileNode, GeneratedProject } from "@/types"
import { generateSharedBlockNodes } from "./blocks"
import { generateFrameworkNodes } from "./frameworks"
import { mergeFileNodes } from "./mergeTree"
import { file } from "./nodes"
import { generatePackageJson } from "./packageJson"

export { file, folder } from "./nodes"
export { generatePackageJson } from "./packageJson"

export function generateProject(config: Config): GeneratedProject {
  const raw: FileNode[] = [
    file("package.json", generatePackageJson(config), "json"),
    ...generateSharedBlockNodes(config),
    ...generateFrameworkNodes(config),
  ]

  return {
    projectName: config.projectName,
    tree: mergeFileNodes(raw),
  }
}
