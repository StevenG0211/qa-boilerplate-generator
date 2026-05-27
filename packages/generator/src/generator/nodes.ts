import type { FileNode } from "@/types"

export function file(
  name: string,
  content: string,
  language: string,
): FileNode {
  return { kind: "file", name, content, language }
}

export function folder(name: string, children: FileNode[]): FileNode {
  return { kind: "folder", name, children }
}
