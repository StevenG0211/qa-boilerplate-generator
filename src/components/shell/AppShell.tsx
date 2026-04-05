"use client"

import { ConfigSidebar } from "@/components/sidebar/ConfigSidebar"
import { PreviewPanel } from "@/components/preview/PreviewPanel"
import { useConfig } from "@/context/ConfigContext"
import { generateProject } from "@/generator"
import { buildZip } from "@/lib/zipBuilder"
import { Download, Menu, RotateCcw } from "lucide-react"
import { useMemo, useState } from "react"
import { focusRingClassName } from "@/lib/a11yClasses"
import { cn } from "@/lib/cn"

export function AppShell() {
  const { config, dispatch } = useConfig()
  const project = useMemo(() => generateProject(config), [config])
  const zipFileName = useMemo(() => {
    const base = config.projectName.replace(/[^a-zA-Z0-9-_]/g, "-") || "project"
    return `${base}.zip`
  }, [config.projectName])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const blob = await buildZip(project)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = zipFileName
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex h-[100dvh] min-h-0 max-h-[100dvh] flex-col overflow-hidden bg-[var(--content-bg)]">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 bg-[var(--header-bg)] px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className={cn(
              focusRingClassName("header"),
              "flex min-h-11 min-w-11 items-center justify-center rounded-md text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-bg-hover)] md:hidden",
            )}
            aria-label="Open configuration panel"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-mono text-lg font-bold text-[var(--header-accent)]">
            {"<QA/>"}
          </span>
          <span className="hidden font-mono text-sm font-medium text-[var(--sidebar-text)] sm:inline">
            Boilerplate Generator
          </span>
        </div>
        <div className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "RESET" })}
            className={cn(
              focusRingClassName("header"),
              "flex min-h-11 items-center gap-1.5 rounded-md border border-[var(--sidebar-border)] px-3 font-mono text-[11px] font-medium text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-bg-hover)]",
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Reset</span>
            <span className="sr-only sm:hidden">Reset configuration</span>
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            aria-busy={downloading}
            aria-label={
              downloading
                ? "Generating ZIP file"
                : `Download ${zipFileName}`
            }
            title={downloading ? undefined : `Download ${zipFileName}`}
            className={cn(
              focusRingClassName("header"),
              "flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-4 font-mono text-xs font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-70",
            )}
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden />
            <span>{downloading ? "Generating…" : "Download"}</span>
          </button>
        </div>
      </header>
      <div
        className="h-0.5 w-full shrink-0 bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#0EA5E9]"
        aria-hidden
      />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {mobileSidebarOpen ? (
          <button
            type="button"
            className={cn(
              focusRingClassName("header"),
              "fixed inset-0 z-40 bg-[#0f172a]/60 md:hidden",
            )}
            aria-label="Close configuration panel"
            onClick={() => setMobileSidebarOpen(false)}
          />
        ) : null}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex min-h-0 w-[min(340px,100vw)] max-w-full flex-col overflow-hidden shadow-xl transition-transform duration-200 ease-out motion-reduce:transition-none md:relative md:z-0 md:h-full md:w-[340px] md:shrink-0 md:shadow-none",
            "md:translate-x-0",
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          )}
        >
          <ConfigSidebar
            onNavigate={() => setMobileSidebarOpen(false)}
            className="min-h-0 flex-1 border-r border-[var(--sidebar-border)]"
          />
        </div>
        <div className="hidden w-1 shrink-0 bg-[var(--content-border)] md:block" />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <PreviewPanel className="min-h-0 flex-1" />
        </main>
      </div>
    </div>
  )
}
