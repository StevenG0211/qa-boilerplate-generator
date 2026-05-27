import type { FileNode } from "@qa-boilerplate/generator"

export function flattenFilePaths(nodes: FileNode[], prefix = ""): string[] {
  const paths: string[] = []
  for (const node of nodes) {
    const full = prefix ? `${prefix}/${node.name}` : node.name
    if (node.kind === "file") {
      paths.push(full)
    } else {
      paths.push(`${full}/`)
      paths.push(...flattenFilePaths(node.children, full))
    }
  }
  return paths.sort()
}

export function formatTreePreview(paths: string[], maxLines = 24): string {
  if (paths.length <= maxLines) {
    return paths.join("\n")
  }
  const shown = paths.slice(0, maxLines)
  return `${shown.join("\n")}\n… and ${paths.length - maxLines} more`
}
