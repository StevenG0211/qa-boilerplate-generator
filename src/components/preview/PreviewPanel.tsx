"use client"

import { useConfig } from "@/context/ConfigContext"
import { generateProject } from "@/generator"
import { useMemo, useState } from "react"
import { FileTree } from "./FileTree"
import { countFiles, findFileNode, firstFilePath } from "./fileTreeUtils"
import { CodeViewer } from "./CodeViewer"

export function PreviewPanel({ className }: { className?: string }) {
  const { config } = useConfig()
  const project = useMemo(() => generateProject(config), [config])
  const tree = project.tree
  const totalFiles = countFiles(tree)

  const defaultPath = useMemo(() => firstFilePath(tree), [tree])
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const resolvedPath = useMemo(() => {
    if (!defaultPath) {
      return null
    }
    if (!selectedPath) {
      return defaultPath
    }
    const parts = selectedPath.split("/").filter(Boolean)
    const node = findFileNode(tree, parts)
    return node?.kind === "file" ? selectedPath : defaultPath
  }, [tree, selectedPath, defaultPath])

  const selectedParts = resolvedPath?.split("/").filter(Boolean) ?? []
  const selectedNode =
    selectedParts.length > 0 ? findFileNode(tree, selectedParts) : null
  const fileNode = selectedNode?.kind === "file" ? selectedNode : null

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col md:flex-row ${className ?? ""}`}
    >
      <div className="flex min-h-[200px] w-full min-w-0 shrink-0 flex-col border-[var(--content-border)] md:h-auto md:w-[280px] md:border-r md:border-b-0 border-b">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--content-border)] px-4">
          <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
            File Explorer
          </span>
          <span className="rounded-full bg-[var(--accent-light)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--accent)]">
            {totalFiles} files
          </span>
        </div>
        <div className="scrollbar-content min-h-0 flex-1 overflow-auto py-2">
          {tree.length === 0 ? (
            <p className="px-4 font-mono text-xs text-[var(--text-tertiary)]">
              No files generated yet.
            </p>
          ) : (
            <FileTree
              nodes={tree}
              selectedPath={resolvedPath}
              onSelectFile={setSelectedPath}
            />
          )}
        </div>
      </div>
      <CodeViewer
        className="min-h-[240px]"
        content={fileNode?.content ?? ""}
        language={fileNode?.language ?? "plaintext"}
        fileLabel={fileNode ? (resolvedPath ?? "") : "Select a file"}
      />
    </div>
  )
}
