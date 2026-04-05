"use client"

import { useMemo } from "react"
import { highlightToHtml } from "@/lib/highlightCode"
import { cn } from "@/lib/cn"

type CodeViewerProps = {
  content: string
  language: string
  fileLabel: string
  className?: string
}

export function CodeViewer({
  content,
  language,
  fileLabel,
  className,
}: CodeViewerProps) {
  const html = useMemo(
    () => highlightToHtml(content, language),
    [content, language],
  )

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--content-bg-secondary)]",
        className,
      )}
    >
      <div
        className="flex h-11 shrink-0 items-center border-b border-[var(--content-border)] px-4"
        role="status"
      >
        <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
          Code Preview
        </span>
        <span className="ml-2 truncate font-mono text-[10px] text-[var(--text-tertiary)]">
          {fileLabel}
        </span>
      </div>
      <div className="scrollbar-content min-h-0 flex-1 overflow-auto p-4">
        <pre
          className="hljs m-0 rounded-lg bg-[var(--code-bg)] p-4 font-mono text-xs leading-relaxed text-[var(--code-text)]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
