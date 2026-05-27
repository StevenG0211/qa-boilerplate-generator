"use client"

import { ChevronDown } from "lucide-react"
import { useId, useState, type ReactNode } from "react"
import { focusRingClassName } from "@/lib/a11yClasses"
import { cn } from "@/lib/cn"

type AccordionSectionProps = {
  title: string
  badge?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

export function AccordionSection({
  title,
  badge,
  defaultOpen = true,
  children,
}: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const panelId = `${id}-panel`
  const buttonId = `${id}-button`

  return (
    <div className="border-b border-[var(--sidebar-border)]">
      <div className="flex h-10 w-full items-center justify-between px-4">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            focusRingClassName("sidebar"),
            "flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-md text-left",
          )}
        >
          <span className="font-mono text-xs font-semibold tracking-wide text-[var(--sidebar-text)]">
            {title}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {badge != null ? (
              <span className="rounded bg-[var(--sidebar-bg-hover)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--sidebar-text-muted)]">
                {badge}
              </span>
            ) : null}
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-[var(--sidebar-text-muted)] transition-transform motion-reduce:transition-none",
                open ? "rotate-180" : "rotate-0",
              )}
              aria-hidden
            />
          </span>
        </button>
      </div>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="flex flex-col gap-2.5 px-4 pb-3 pt-0"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
