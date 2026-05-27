import * as vscode from "vscode"
import { generateProject, officialPresets } from "@qa-boilerplate/generator"
import {
  buildWritePlan,
  projectTargetDir,
  resolvePlansUnderProject,
  writeProjectToWorkspace,
} from "./fileWriter"

/** Test-only path when `QA_GEN_TEST_PRESET` is set (see `runTest.ts`). */
export async function runGenerateWizardAutopilot(
  presetId: string,
): Promise<void> {
  const folders = vscode.workspace.workspaceFolders
  if (!folders?.length) {
    throw new Error("Open a workspace folder before generating a test project.")
  }

  const preset = officialPresets.find((entry) => entry.id === presetId)
  if (!preset) {
    throw new Error(`Unknown preset: ${presetId}`)
  }

  const config = structuredClone(preset.config)
  const project = generateProject(config)
  const folder = folders[0]!
  const targetDir = projectTargetDir(folder, config.projectName)
  const basePlans = await buildWritePlan(project, folder)
  const plans = resolvePlansUnderProject(basePlans, targetDir)

  const result = await writeProjectToWorkspace(plans)
  if (result.failed.length > 0) {
    throw new Error(`Write failed: ${result.failed.join("; ")}`)
  }
}
