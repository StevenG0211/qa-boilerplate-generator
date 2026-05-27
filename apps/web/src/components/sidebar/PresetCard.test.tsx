/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { PresetCard } from "@/components/sidebar/PresetCard"
import type { Preset } from "@qa-boilerplate/generator"

const samplePreset: Preset = {
  schemaVersion: 1,
  id: "sample-preset",
  name: "Sample Preset",
  description: "A preset used in unit tests.",
  source: "official",
  tags: ["playwright"],
  config: {
    projectName: "sample",
    framework: "playwright",
    language: "ts",
    pattern: "none",
    reporting: { allure: false, html: true, dot: false },
    ci: { provider: "none" },
    linting: { eslint: false, prettier: false },
    env: { dotenv: false },
    validation: { zod: false },
    apiTesting: { tool: "none" },
    integrations: { testlio: false, mailinator: false },
  },
}

describe("PresetCard", () => {
  it("exposes radio semantics and reflects selection state", () => {
    const onSelect = vi.fn()

    const { rerender } = render(
      <PresetCard preset={samplePreset} selected={false} onSelect={onSelect} />,
    )

    const card = screen.getByRole("radio", { name: /sample preset/i })
    expect(card).toHaveAttribute("aria-checked", "false")

    rerender(
      <PresetCard preset={samplePreset} selected onSelect={onSelect} />,
    )
    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "true")
  })

  it("calls onSelect when clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <PresetCard preset={samplePreset} selected={false} onSelect={onSelect} />,
    )

    await user.click(
      screen.getByRole("radio", { name: /sample preset/i }),
    )
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it("calls onSelect when activated with Enter or Space", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <PresetCard preset={samplePreset} selected={false} onSelect={onSelect} />,
    )

    const card = screen.getByRole("radio", { name: /sample preset/i })
    card.focus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")
    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it("forwards onKeyDown for radiogroup navigation", async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()

    render(
      <PresetCard
        preset={samplePreset}
        selected={false}
        onSelect={() => {}}
        onKeyDown={onKeyDown}
      />,
    )

    const card = screen.getByRole("radio", { name: /sample preset/i })
    card.focus()
    await user.keyboard("{ArrowDown}")
    expect(onKeyDown).toHaveBeenCalled()
  })
})
