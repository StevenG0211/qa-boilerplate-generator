"use client"

import { ChevronDown, FileText, Folder } from "lucide-react"
import { useState } from "react"
import type { FileNode } from "@/types"
import { focusRingClassName } from "@/lib/a11yClasses"
import { cn } from "@/lib/cn"

type FileTreeProps = {
  nodes: FileNode[]
  selectedPath: string | null
  onSelectFile: (path: string) => void
  depth?: number
  pathPrefix?: string[]
}

export function FileTree({
  nodes,
  selectedPath,
  onSelectFile,
  depth = 0,
  pathPrefix = [],
}: FileTreeProps) {
  return (
    <ul className="list-none">
      {nodes.map((node) => (
        <li key={[...pathPrefix, node.name].join("/")} className="py-px">
          {node.kind === "file" ? (
            <FileLeaf
              node={node}
              depth={depth}
              pathPrefix={pathPrefix}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ) : (
            <FolderBranch
              node={node}
              depth={depth}
              pathPrefix={pathPrefix}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

function FileLeaf({
  node,
  depth,
  pathPrefix,
  selectedPath,
  onSelectFile,
}: {
  node: FileNode & { kind: "file" }
  depth: number
  pathPrefix: string[]
  selectedPath: string | null
  onSelectFile: (path: string) => void
}) {
  const fullPath = [...pathPrefix, node.name].join("/")
  const active = selectedPath === fullPath
  return (
    <button
      type="button"
      aria-current={active ? "true" : undefined}
      onClick={() => onSelectFile(fullPath)}
      style={{ paddingLeft: 8 + depth * 12 }}
      className={cn(
        focusRingClassName("light"),
        "flex min-h-9 w-full min-w-0 items-center gap-1.5 rounded border-l-2 border-transparent pr-2 text-left font-mono text-xs",
        active
          ? "border-[var(--accent)] bg-[var(--content-bg-tertiary)] font-medium text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--content-bg-secondary)]",
      )}
    >
      <FileText
        className="h-3.5 w-3.5 shrink-0 text-[var(--tree-icon-file)]"
        aria-hidden
      />
      <span className="truncate">{node.name}</span>
    </button>
  )
}

function FolderBranch({
  node,
  depth,
  pathPrefix,
  selectedPath,
  onSelectFile,
}: {
  node: FileNode & { kind: "folder" }
  depth: number
  pathPrefix: string[]
  selectedPath: string | null
  onSelectFile: (path: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          focusRingClassName("light"),
          "flex min-h-9 w-full min-w-0 items-center gap-1.5 rounded px-2 text-left font-mono text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--content-bg-secondary)]",
        )}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 text-[var(--text-tertiary)] transition-transform motion-reduce:transition-none",
            !open && "-rotate-90",
          )}
          aria-hidden
        />
        <Folder
          className="h-3.5 w-3.5 shrink-0 text-[var(--tree-icon-folder)]"
          aria-hidden
        />
        <span className="truncate">{node.name}</span>
      </button>
      {open ? (
        <FileTree
          nodes={node.children}
          pathPrefix={[...pathPrefix, node.name]}
          depth={depth + 1}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
        />
      ) : null}
    </>
  )
}
