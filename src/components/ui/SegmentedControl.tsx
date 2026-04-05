"use client"

import { focusRingClassName } from "@/lib/a11yClasses"
import { cn } from "@/lib/cn"

export type SegmentOption<T extends string> = {
  value: T
  label: string
  disabled?: boolean
}

type SegmentedControlProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: SegmentOption<T>[]
  className?: string
  "aria-label"?: string
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "flex gap-0.5 rounded-lg bg-[var(--segment-bg)] p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = value === opt.value
        const disabled = opt.disabled
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            title={disabled ? "Not available for this framework" : undefined}
            onClick={() => !disabled && onChange(opt.value)}
            className={cn(
              focusRingClassName("segment"),
              "min-h-7 min-w-0 flex-1 rounded-md px-3.5 py-1.5 text-center font-mono text-xs transition-colors",
              active
                ? "bg-[var(--segment-active-bg)] font-semibold text-[var(--text-primary)] shadow-[0_1px_3px_#0000001a] ring-1 ring-inset ring-[var(--accent)]"
                : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
