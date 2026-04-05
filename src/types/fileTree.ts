export type FileNode =
  | { kind: "file"; name: string; content: string; language: string }
  | { kind: "folder"; name: string; children: FileNode[] }

export type GeneratedProject = {
  projectName: string
  tree: FileNode[]
}
