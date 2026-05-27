import type { FileNode } from "@/types"

export function mergeFileNodes(nodes: FileNode[]): FileNode[] {
  const map = new Map<string, FileNode[]>()
  for (const node of nodes) {
    const list = map.get(node.name) ?? []
    list.push(node)
    map.set(node.name, list)
  }

  const merged: FileNode[] = []
  for (const [name, group] of map) {
    const folders = group.filter(
      (n): n is Extract<FileNode, { kind: "folder" }> => n.kind === "folder",
    )
    const files = group.filter((n) => n.kind === "file")

    if (folders.length > 0) {
      const childBuckets: FileNode[] = []
      for (const f of folders) {
        childBuckets.push(...f.children)
      }
      merged.push({
        kind: "folder",
        name,
        children: mergeFileNodes(childBuckets),
      })
    } else if (files.length > 0) {
      merged.push(files[files.length - 1]!)
    }
  }

  merged.sort((a, b) => a.name.localeCompare(b.name))
  return merged
}
