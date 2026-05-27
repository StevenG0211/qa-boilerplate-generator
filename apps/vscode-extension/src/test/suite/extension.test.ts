import * as assert from "node:assert/strict"
import * as vscode from "vscode"

const EXTENSION_ID = "qa-boilerplate-gen.qa-boilerplate-generator"
const PRESET_ID = "cypress-js-minimal"

suite("Extension smoke", () => {
  test("activates and generates project from test preset", async () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID)
    assert.ok(extension, `Extension ${EXTENSION_ID} not found`)

    await extension.activate()
    assert.strictEqual(process.env.QA_GEN_TEST_PRESET, PRESET_ID)

    await vscode.commands.executeCommand("qaBoilerplateGen.generateProject")

    const folder = vscode.workspace.workspaceFolders?.[0]
    assert.ok(folder, "Expected an open workspace folder")

    const configUri = vscode.Uri.joinPath(
      folder.uri,
      PRESET_ID,
      "cypress.config.js",
    )
    const smokeUri = vscode.Uri.joinPath(
      folder.uri,
      PRESET_ID,
      "cypress/e2e/smoke.cy.js",
    )

    await vscode.workspace.fs.stat(configUri)
    await vscode.workspace.fs.stat(smokeUri)
  })
})
