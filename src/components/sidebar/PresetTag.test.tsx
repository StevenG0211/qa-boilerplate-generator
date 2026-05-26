/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PresetTag, PresetTagList } from "@/components/sidebar/PresetTag"

describe("PresetTag", () => {
  it("uses accent styling for integration tags", () => {
    const { container, rerender } = render(<PresetTag tag="testlio" />)
    expect(container.firstChild).toHaveClass("text-[var(--accent)]")

    rerender(<PresetTag tag="typescript" />)
    expect(container.firstChild).toHaveClass("text-[var(--sidebar-text-muted)]")
    expect(container.firstChild).not.toHaveClass("text-[var(--accent)]")
  })

  it("renders a tag list with an accessible label", () => {
    render(<PresetTagList tags={["playwright", "testlio"]} />)
    expect(screen.getByLabelText("Tags: playwright, testlio")).toBeInTheDocument()
    expect(screen.getByText("testlio")).toBeInTheDocument()
  })
})
