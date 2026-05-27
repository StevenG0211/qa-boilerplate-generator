"use client"

import { cn } from "@/lib/cn"

const INTEGRATION_TAGS = new Set(["testlio", "mailinator", "allure"])

type PresetTagProps = {
  tag: string
}

export function PresetTag({ tag }: PresetTagProps) {
  const isIntegration = INTEGRATION_TAGS.has(tag.toLowerCase())

  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 font-mono text-[10px] leading-none",
        isIntegration
          ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
          : "border-[var(--sidebar-border)] bg-[var(--sidebar-border)]/60 text-[var(--sidebar-text-muted)]",
      )}
    >
      {tag}
    </span>
  )
}

export function PresetTagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null

  return (
    <div
      className="flex flex-wrap gap-1.5"
      aria-label={`Tags: ${tags.join(", ")}`}
    >
      {tags.map((tag) => (
        <PresetTag key={tag} tag={tag} />
      ))}
    </div>
  )
}
