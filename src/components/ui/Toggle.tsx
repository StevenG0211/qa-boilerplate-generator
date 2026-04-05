"use client"

import { focusRingClassName } from "@/lib/a11yClasses"
import { cn } from "@/lib/cn"

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  "aria-label"?: string
}

export function Toggle({
  checked,
  onChange,
  disabled,
  id,
  "aria-label": ariaLabel,
}: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        focusRingClassName("sidebar"),
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-0",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "relative h-[22px] w-10 shrink-0 rounded-[11px] p-0.5 transition-colors motion-reduce:transition-none",
          checked ? "bg-[var(--toggle-bg-on)]" : "bg-[var(--toggle-bg-off)]",
        )}
      >
        <span
          className={cn(
            "block h-[18px] w-[18px] rounded-full bg-white transition-transform motion-reduce:transition-none",
            checked ? "translate-x-[18px]" : "translate-x-0",
          )}
        />
      </span>
    </button>
  )
}
