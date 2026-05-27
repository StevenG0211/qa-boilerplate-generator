import * as vscode from "vscode"
import { runGenerateWizard } from "./wizard"

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "qaBoilerplateGen.generateProject",
      async () => {
        try {
          await runGenerateWizard()
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error)
          void vscode.window.showErrorMessage(`QA Gen failed: ${message}`)
        }
      },
    ),
  )
}

export function deactivate(): void {}
