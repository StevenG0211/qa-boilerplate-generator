"use client"

import { useState, type ChangeEvent } from "react"
import type { APITool, CIProvider, Framework, Language, Pattern } from "@/types"
import { useConfig } from "@/context/ConfigContext"
import { AccordionSection } from "@/components/ui/AccordionSection"
import { SegmentedControl } from "@/components/ui/SegmentedControl"
import { Toggle } from "@/components/ui/Toggle"
import { cn } from "@/lib/cn"
import {
  officialPresets,
  parsePresetJson,
  type Preset,
  type PresetValidationError,
} from "@/presets"

function frameworkLabel(f: Framework): string {
  switch (f) {
    case "wdio":
      return "WDIO"
    case "playwright":
      return "Playwright"
    case "cypress":
      return "Cypress"
  }
}

function languageLabel(l: Language): string {
  return l === "ts" ? "TS" : "JS"
}

function patternLabel(p: Pattern): string {
  switch (p) {
    case "pom":
      return "POM"
    case "screenplay":
      return "Screen"
    case "none":
      return "None"
  }
}

function ciLabel(c: CIProvider): string {
  switch (c) {
    case "github":
      return "GitHub"
    case "gitlab":
      return "GitLab"
    case "none":
      return "None"
  }
}

function apiLabel(t: APITool): string {
  switch (t) {
    case "none":
      return "None"
    case "supertest":
      return "Supertest"
    case "axios":
      return "Axios"
    case "playwright-built-in":
      return "PW API"
  }
}

function presetSummary(preset: Preset): string {
  return [
    frameworkLabel(preset.config.framework),
    languageLabel(preset.config.language),
    patternLabel(preset.config.pattern),
    apiLabel(preset.config.apiTesting.tool),
  ].join(" / ")
}

type PresetPanelProps = {
  onNavigate?: () => void
}

function PresetPanel({ onNavigate }: PresetPanelProps) {
  const { activePreset, dispatch } = useConfig()
  const [uploadedPreset, setUploadedPreset] = useState<Preset | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [importErrors, setImportErrors] = useState<PresetValidationError[]>([])
  const [importMessage, setImportMessage] = useState("")

  const activeOfficialId =
    activePreset?.source === "official" ? activePreset.id : ""

  const applyPreset = (preset: Preset, fileName?: string) => {
    dispatch({ type: "APPLY_PRESET", payload: { preset, fileName } })
    setImportMessage(`${preset.name} applied.`)
    onNavigate?.()
  }

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    try {
      const result = parsePresetJson(await file.text())
      if (result.success) {
        setUploadedPreset(result.preset)
        setUploadedFileName(file.name)
        setImportErrors([])
        setImportMessage(`${result.preset.name} is ready to apply.`)
        return
      }

      setUploadedPreset(null)
      setUploadedFileName(null)
      setImportErrors(result.errors)
      setImportMessage("Preset import failed.")
    } catch {
      setUploadedPreset(null)
      setUploadedFileName(null)
      setImportErrors([
        { path: "file", message: "Could not read the selected file." },
      ])
      setImportMessage("Preset import failed.")
    }
  }

  return (
    <section className="flex flex-col gap-3 px-4 pb-4 pt-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-[10px] font-semibold tracking-wider text-[var(--sidebar-text-muted)]">
          PRESETS
        </h2>
        {activePreset ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "CLEAR_PRESET" })}
            className="min-h-8 rounded-md px-2 font-mono text-[10px] text-[var(--sidebar-text-muted)] outline-none ring-[var(--focus-ring)] hover:bg-[var(--sidebar-bg-hover)] focus:ring-2"
          >
            Clear
          </button>
        ) : null}
      </div>

      <label className="sr-only" htmlFor="official-preset-select">
        Official preset
      </label>
      <select
        id="official-preset-select"
        value={activeOfficialId}
        onChange={(event) => {
          const preset = officialPresets.find(
            (p) => p.id === event.target.value,
          )
          if (preset) applyPreset(preset)
        }}
        className="select-sidebar min-h-11 w-full rounded-md border border-[var(--sidebar-border)] pl-3 font-mono text-xs text-[var(--sidebar-text)] outline-none ring-[var(--focus-ring)] focus:ring-2"
      >
        <option value="">Choose official preset</option>
        {officialPresets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>

      {activePreset ? (
        <p className="rounded-md border border-[var(--sidebar-border)] bg-[var(--sidebar-bg-hover)] px-3 py-2 font-mono text-[11px] text-[var(--sidebar-text-muted)]">
          Active: {activePreset.name}
          {activePreset.customized ? " (customized)" : ""}
          {activePreset.fileName ? ` from ${activePreset.fileName}` : ""}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="preset-upload"
          className="font-mono text-[10px] font-semibold tracking-wider text-[var(--sidebar-text-muted)]"
        >
          IMPORT JSON PRESET
        </label>
        <input
          id="preset-upload"
          type="file"
          accept="application/json,.json"
          onChange={handleUpload}
          className="min-h-11 w-full rounded-md border border-[var(--sidebar-border)] bg-[var(--sidebar-bg-hover)] px-3 py-2 font-mono text-[11px] text-[var(--sidebar-text)] outline-none ring-[var(--focus-ring)] file:mr-3 file:rounded file:border-0 file:bg-[var(--sidebar-border)] file:px-2 file:py-1 file:font-mono file:text-[10px] file:text-[var(--sidebar-text)] focus:ring-2"
        />
      </div>

      {uploadedPreset ? (
        <div className="rounded-md border border-[var(--sidebar-border)] bg-[var(--sidebar-bg-hover)] p-3">
          <p className="font-mono text-xs font-semibold text-[var(--sidebar-text)]">
            {uploadedPreset.name}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--sidebar-text-muted)]">
            {presetSummary(uploadedPreset)}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--sidebar-text-muted)]">
            {uploadedFileName}
          </p>
          <button
            type="button"
            onClick={() =>
              applyPreset(uploadedPreset, uploadedFileName ?? undefined)
            }
            className="mt-3 min-h-10 w-full rounded-md bg-[var(--accent)] px-3 font-mono text-xs font-semibold text-white outline-none ring-[var(--focus-ring)] focus:ring-2"
          >
            Apply imported preset
          </button>
        </div>
      ) : null}

      <div aria-live="polite" className="font-mono text-[11px]">
        {importMessage ? (
          <p className="text-[var(--sidebar-text-muted)]">{importMessage}</p>
        ) : null}
        {importErrors.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1 text-red-300">
            {importErrors.map((error) => (
              <li key={`${error.path}-${error.message}`}>
                {error.path}: {error.message}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

type ToggleRowProps = {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  tooltip?: string
}

function ToggleRow({
  label,
  checked,
  onChange,
  disabled,
  tooltip,
}: ToggleRowProps) {
  return (
    <div
      className="flex min-h-11 items-center justify-between gap-2"
      title={tooltip}
    >
      <span className="font-mono text-xs text-[var(--sidebar-text-muted)]">
        {label}
      </span>
      <Toggle
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  )
}

type ConfigSidebarProps = {
  className?: string
  onNavigate?: () => void
}

export function ConfigSidebar({ className, onNavigate }: ConfigSidebarProps) {
  const { config, dispatch } = useConfig()
  const dotDisabled = config.framework !== "wdio"
  const showPwApi = config.framework === "playwright"

  const reportingCount =
    (config.reporting.allure ? 1 : 0) +
    (config.reporting.html ? 1 : 0) +
    (config.reporting.dot ? 1 : 0)

  return (
    <aside
      className={cn(
        "scrollbar-sidebar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain bg-[var(--sidebar-bg)]",
        className,
      )}
    >
      <PresetPanel onNavigate={onNavigate} />

      <div className="h-px w-full bg-[var(--sidebar-border)]" />

      <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
        <label className="font-mono text-[10px] font-semibold tracking-wider text-[var(--sidebar-text-muted)]">
          PROJECT NAME
        </label>
        <input
          type="text"
          value={config.projectName}
          onChange={(e) => {
            dispatch({ type: "SET_PROJECT_NAME", payload: e.target.value })
            onNavigate?.()
          }}
          autoComplete="off"
          className="h-9 w-full rounded-md border border-[var(--sidebar-border)] bg-[var(--sidebar-bg-hover)] px-3 font-mono text-xs text-[var(--sidebar-text)] outline-none ring-[var(--focus-ring)] focus:ring-2"
        />
      </div>

      <div className="h-px w-full bg-[var(--sidebar-border)]" />

      <AccordionSection
        title="FRAMEWORK"
        badge={frameworkLabel(config.framework)}
      >
        <SegmentedControl
          aria-label="Test framework"
          value={config.framework}
          onChange={(v) => dispatch({ type: "SET_FRAMEWORK", payload: v })}
          options={[
            { value: "wdio" as const, label: "WDIO" },
            { value: "playwright" as const, label: "PW" },
            { value: "cypress" as const, label: "Cy" },
          ]}
        />
      </AccordionSection>

      <AccordionSection title="LANGUAGE" badge={languageLabel(config.language)}>
        <SegmentedControl
          aria-label="Language"
          value={config.language}
          onChange={(v) => dispatch({ type: "SET_LANGUAGE", payload: v })}
          options={[
            { value: "ts" as const, label: "TypeScript" },
            { value: "js" as const, label: "JavaScript" },
          ]}
        />
      </AccordionSection>

      <AccordionSection title="PATTERN" badge={patternLabel(config.pattern)}>
        <SegmentedControl
          aria-label="Pattern"
          value={config.pattern}
          onChange={(v) => dispatch({ type: "SET_PATTERN", payload: v })}
          options={[
            { value: "pom" as const, label: "POM" },
            { value: "screenplay" as const, label: "Screenplay" },
            { value: "none" as const, label: "None" },
          ]}
        />
      </AccordionSection>

      <AccordionSection title="REPORTING" badge={String(reportingCount)}>
        <ToggleRow
          label="Allure"
          checked={config.reporting.allure}
          onChange={(v) =>
            dispatch({
              type: "SET_REPORTING",
              payload: { ...config.reporting, allure: v },
            })
          }
        />
        <ToggleRow
          label="HTML"
          checked={config.reporting.html}
          onChange={(v) =>
            dispatch({
              type: "SET_REPORTING",
              payload: { ...config.reporting, html: v },
            })
          }
        />
        <div
          title={
            dotDisabled
              ? "Dot reporter is only used with WebdriverIO"
              : undefined
          }
        >
          <ToggleRow
            label="Dot"
            checked={config.reporting.dot}
            disabled={dotDisabled}
            tooltip={
              dotDisabled
                ? "Dot reporter is only used with WebdriverIO"
                : undefined
            }
            onChange={(v) =>
              dispatch({
                type: "SET_REPORTING",
                payload: { ...config.reporting, dot: v },
              })
            }
          />
        </div>
      </AccordionSection>

      <AccordionSection title="CI" badge={ciLabel(config.ci.provider)}>
        <label className="sr-only" htmlFor="ci-select">
          CI provider
        </label>
        <select
          id="ci-select"
          value={config.ci.provider}
          onChange={(e) =>
            dispatch({
              type: "SET_CI",
              payload: { provider: e.target.value as CIProvider },
            })
          }
          className="select-sidebar h-9 w-full rounded-md border border-[var(--sidebar-border)] pl-3 font-mono text-xs text-[var(--sidebar-text)] outline-none ring-[var(--focus-ring)] focus:ring-2"
        >
          <option value="none">None</option>
          <option value="github">GitHub Actions</option>
          <option value="gitlab">GitLab CI</option>
        </select>
      </AccordionSection>

      <AccordionSection
        title="LINTING"
        badge={
          [config.linting.eslint, config.linting.prettier].filter(Boolean)
            .length
        }
      >
        <ToggleRow
          label="ESLint"
          checked={config.linting.eslint}
          onChange={(v) =>
            dispatch({
              type: "SET_LINTING",
              payload: { ...config.linting, eslint: v },
            })
          }
        />
        <ToggleRow
          label="Prettier"
          checked={config.linting.prettier}
          onChange={(v) =>
            dispatch({
              type: "SET_LINTING",
              payload: { ...config.linting, prettier: v },
            })
          }
        />
      </AccordionSection>

      <AccordionSection title="ENV" badge={config.env.dotenv ? "On" : "Off"}>
        <ToggleRow
          label="dotenv"
          checked={config.env.dotenv}
          onChange={(v) =>
            dispatch({
              type: "SET_ENV",
              payload: { dotenv: v },
            })
          }
        />
      </AccordionSection>

      <AccordionSection
        title="VALIDATION"
        badge={config.validation.zod ? "On" : "Off"}
      >
        <ToggleRow
          label="Zod"
          checked={config.validation.zod}
          onChange={(v) =>
            dispatch({
              type: "SET_VALIDATION",
              payload: { zod: v },
            })
          }
        />
      </AccordionSection>

      <AccordionSection
        title="API TESTING"
        badge={apiLabel(config.apiTesting.tool)}
      >
        <label className="sr-only" htmlFor="api-select">
          API testing tool
        </label>
        <select
          id="api-select"
          value={config.apiTesting.tool}
          onChange={(e) =>
            dispatch({
              type: "SET_API_TESTING",
              payload: { tool: e.target.value as APITool },
            })
          }
          className="select-sidebar h-9 w-full rounded-md border border-[var(--sidebar-border)] pl-3 font-mono text-xs text-[var(--sidebar-text)] outline-none ring-[var(--focus-ring)] focus:ring-2"
        >
          <option value="none">None</option>
          <option value="supertest">Supertest</option>
          <option value="axios">Axios</option>
          {showPwApi ? (
            <option value="playwright-built-in">Playwright built-in</option>
          ) : null}
        </select>
      </AccordionSection>
    </aside>
  )
}
