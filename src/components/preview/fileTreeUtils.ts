import type { FileNode } from "@/types"

export function firstFilePath(
  nodes: FileNode[],
  prefix: string[] = [],
): string | null {
  for (const n of nodes) {
    if (n.kind === "file") {
      return [...prefix, n.name].join("/")
    }
    const p = firstFilePath(n.children, [...prefix, n.name])
    if (p) {
      return p
    }
  }
  return null
}

export function findFileNode(
  nodes: FileNode[],
  parts: string[],
): FileNode | null {
  if (parts.length === 0) {
    return null
  }
  const [head, ...rest] = parts
  for (const n of nodes) {
    if (n.name !== head) {
      continue
    }
    if (rest.length === 0 && n.kind === "file") {
      return n
    }
    if (rest.length > 0 && n.kind === "folder") {
      return findFileNode(n.children, rest)
    }
  }
  return null
}

export function countFiles(nodes: FileNode[]): number {
  let n = 0
  for (const node of nodes) {
    if (node.kind === "file") {
      n += 1
    } else {
      n += countFiles(node.children)
    }
  }
  return n
}
