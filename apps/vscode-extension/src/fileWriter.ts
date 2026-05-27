import * as path from "node:path"
import * as vscode from "vscode"
import type { FileNode, GeneratedProject } from "@qa-boilerplate/generator"

export type WritePlan = {
  uri: vscode.Uri
  relativePath: string
  content: Uint8Array
  exists: boolean
}

function collectFiles(
  nodes: FileNode[],
  baseUri: vscode.Uri,
  prefix = "",
): WritePlan[] {
  const plans: WritePlan[] = []
  for (const node of nodes) {
    const relativePath = prefix ? `${prefix}/${node.name}` : node.name
    const uri = vscode.Uri.joinPath(baseUri, relativePath)
    if (node.kind === "file") {
      plans.push({
        uri,
        relativePath,
        content: Buffer.from(node.content, "utf8"),
        exists: false,
      })
    } else {
      plans.push(...collectFiles(node.children, baseUri, relativePath))
    }
  }
  return plans
}

export async function buildWritePlan(
  project: GeneratedProject,
  targetFolder: vscode.WorkspaceFolder,
): Promise<WritePlan[]> {
  const plans = collectFiles(project.tree, targetFolder.uri)
  await Promise.all(
    plans.map(async (plan) => {
      try {
        await vscode.workspace.fs.stat(plan.uri)
        plan.exists = true
      } catch {
        plan.exists = false
      }
    }),
  )
  return plans
}

export async function confirmOverwrite(
  existingPaths: string[],
): Promise<boolean> {
  if (existingPaths.length === 0) {
    return true
  }
  const sample = existingPaths.slice(0, 5).join("\n")
  const more =
    existingPaths.length > 5
      ? `\n… and ${existingPaths.length - 5} more`
      : ""
  const choice = await vscode.window.showWarningMessage(
    `${existingPaths.length} file(s) already exist and will be overwritten:\n${sample}${more}`,
    { modal: true },
    "Overwrite",
    "Cancel",
  )
  return choice === "Overwrite"
}

export async function writeProjectToWorkspace(
  plans: WritePlan[],
): Promise<{ written: number; failed: string[] }> {
  const failed: string[] = []
  let written = 0

  for (const plan of plans) {
    try {
      await vscode.workspace.fs.createDirectory(
        vscode.Uri.joinPath(plan.uri, ".."),
      )
      await vscode.workspace.fs.writeFile(plan.uri, plan.content)
      written++
    } catch (error) {
      failed.push(
        `${plan.relativePath}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  return { written, failed }
}

export async function pickWorkspaceFolder(): Promise<
  vscode.WorkspaceFolder | undefined
> {
  const folders = vscode.workspace.workspaceFolders
  if (!folders?.length) {
    void vscode.window.showErrorMessage(
      "Open a workspace folder before generating a test project.",
    )
    return undefined
  }
  if (folders.length === 1) {
    return folders[0]
  }
  const picked = await vscode.window.showWorkspaceFolderPick({
    placeHolder: "Select workspace folder for generated files",
  })
  return picked
}

export function projectTargetDir(
  folder: vscode.WorkspaceFolder,
  projectName: string,
): vscode.Uri {
  return vscode.Uri.joinPath(folder.uri, projectName)
}

export function resolvePlansUnderProject(
  plans: WritePlan[],
  targetDir: vscode.Uri,
): WritePlan[] {
  const base = targetDir.fsPath
  return plans.map((plan) => {
    const absolute = path.join(base, plan.relativePath)
    const uri = vscode.Uri.file(absolute)
    return { ...plan, uri }
  })
}
