"use client"

import type { KeyboardEvent } from "react"
import { cn } from "@/lib/cn"
import type { Preset } from "@/presets"
import { PresetTagList } from "@/components/sidebar/PresetTag"

type PresetCardProps = {
  preset: Preset
  selected: boolean
  onSelect: () => void
  tabIndex?: number
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void
}

export function PresetCard({
  preset,
  selected,
  onSelect,
  tabIndex = 0,
  onKeyDown,
}: PresetCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={cn(
        "flex w-full flex-col rounded-md border px-3 py-3 text-left outline-none ring-[var(--focus-ring)] transition-colors focus:ring-2",
        selected
          ? "border-[var(--accent)] bg-[var(--sidebar-bg-hover)]"
          : "border-[var(--sidebar-border)] bg-[var(--sidebar-bg-hover)] hover:border-[var(--sidebar-text-muted)]",
      )}
    >
      <span className="block font-mono text-xs font-semibold leading-snug text-[var(--sidebar-text)]">
        {preset.name}
      </span>

      <p className="mt-2 block font-mono text-[11px] leading-relaxed text-[var(--sidebar-text-muted)]">
        {preset.description}
      </p>

      {preset.tags.length > 0 ? (
        <div className="mt-3 border-t border-[var(--sidebar-border)] pt-3">
          <PresetTagList tags={preset.tags} />
        </div>
      ) : null}
    </button>
  )
}
