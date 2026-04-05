"use client"

import type { APITool, CIProvider, Framework, Language, Pattern } from "@/types"
import { useConfig } from "@/context/ConfigContext"
import { AccordionSection } from "@/components/ui/AccordionSection"
import { SegmentedControl } from "@/components/ui/SegmentedControl"
import { Toggle } from "@/components/ui/Toggle"
import { cn } from "@/lib/cn"

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
