import * as path from "node:path"
import Mocha from "mocha"
import { globSync } from "glob"

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: "tdd", timeout: 120_000 })
  const testsRoot = path.resolve(__dirname)

  for (const file of globSync("**/*.test.js", { cwd: testsRoot })) {
    mocha.addFile(path.resolve(testsRoot, file))
  }

  return new Promise((resolve, reject) => {
    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`))
          return
        }
        resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}
