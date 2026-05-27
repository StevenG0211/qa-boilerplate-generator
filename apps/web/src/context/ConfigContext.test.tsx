/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { ConfigProvider, useConfig } from "@/context/ConfigContext"
import { officialPresets } from "@qa-boilerplate/generator"

function ApplyPresetProbe() {
  const { config, activePreset, dispatch } = useConfig()
  const preset = officialPresets[0]

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "APPLY_PRESET",
            payload: { preset, fileName: "custom.json" },
          })
        }
      >
        Apply preset
      </button>
      <span data-testid="framework">{config.framework}</span>
      <span data-testid="preset-id">{activePreset?.id ?? ""}</span>
      <span data-testid="preset-name">{activePreset?.name ?? ""}</span>
      <span data-testid="preset-source">{activePreset?.source ?? ""}</span>
      <span data-testid="preset-customized">
        {activePreset?.customized ? "yes" : "no"}
      </span>
      <span data-testid="preset-file">{activePreset?.fileName ?? ""}</span>
    </div>
  )
}

describe("ConfigProvider", () => {
  it("APPLY_PRESET updates config and active preset metadata", async () => {
    const user = userEvent.setup()
    const preset = officialPresets[0]

    render(
      <ConfigProvider>
        <ApplyPresetProbe />
      </ConfigProvider>,
    )

    await user.click(screen.getByRole("button", { name: /apply preset/i }))

    expect(screen.getByTestId("framework")).toHaveTextContent(
      preset.config.framework,
    )
    expect(screen.getByTestId("preset-id")).toHaveTextContent(preset.id)
    expect(screen.getByTestId("preset-name")).toHaveTextContent(preset.name)
    expect(screen.getByTestId("preset-source")).toHaveTextContent(preset.source)
    expect(screen.getByTestId("preset-customized")).toHaveTextContent("no")
    expect(screen.getByTestId("preset-file")).toHaveTextContent("custom.json")
  })
})
