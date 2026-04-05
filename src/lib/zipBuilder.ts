import JSZip from "jszip"
import type { FileNode, GeneratedProject } from "@/types"

function sanitizeSegment(name: string): string {
  return name.replace(/[/\\]/g, "-") || "untitled"
}

async function addNode(
  folder: JSZip,
  node: FileNode,
  pathPrefix: string,
): Promise<void> {
  if (node.kind === "file") {
    folder.file(`${pathPrefix}${sanitizeSegment(node.name)}`, node.content)
    return
  }
  const dir = `${pathPrefix}${sanitizeSegment(node.name)}/`
  for (const child of node.children) {
    await addNode(folder, child, dir)
  }
}

export async function buildZip(project: GeneratedProject): Promise<Blob> {
  const zip = new JSZip()
  const rootName = sanitizeSegment(project.projectName) || "project"
  const root = zip.folder(rootName)
  if (!root) {
    throw new Error("Could not create zip root folder")
  }
  for (const node of project.tree) {
    await addNode(root, node, "")
  }
  return root.generateAsync({ type: "blob" })
}
