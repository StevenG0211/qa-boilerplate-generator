import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { runTests } from "@vscode/test-electron"

async function main(): Promise<void> {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../..")
    const extensionTestsPath = path.resolve(__dirname, "./suite/index")
    const workspacePath = fs.mkdtempSync(
      path.join(os.tmpdir(), "qa-gen-extension-test-"),
    )

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [workspacePath, "--disable-extensions"],
      extensionTestsEnv: {
        QA_GEN_TEST_PRESET: "cypress-js-minimal",
      },
    })
  } catch (error) {
    console.error("Failed to run extension tests", error)
    process.exit(1)
  }
}

void main()
