import type { ClassValue } from "clsx"
import { cn } from "@/lib/cn"

/** Surface behind the control; sets ring-offset to match for visible focus (WCAG 2.4.7). */
export type FocusRingSurface = "header" | "sidebar" | "light" | "segment"

const focusRingBase =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"

const offsetBySurface: Record<FocusRingSurface, string> = {
  header: "focus-visible:ring-offset-[var(--header-bg)]",
  sidebar: "focus-visible:ring-offset-[var(--sidebar-bg)]",
  light: "focus-visible:ring-offset-[var(--content-bg)]",
  segment: "focus-visible:ring-offset-[var(--segment-bg)]",
}

export function focusRingClassName(
  surface: FocusRingSurface,
  ...extra: ClassValue[]
) {
  return cn(focusRingBase, offsetBySurface[surface], ...extra)
}
