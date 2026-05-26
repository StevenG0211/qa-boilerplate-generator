import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parsePresetJson } from "../src/presets/validatePreset"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const PRESET_DIRS = [
  path.join(root, "presets", "official"),
  path.join(root, "presets", "community"),
] as const

async function listPresetJsonFiles(dir: string): Promise<string[]> {
  let entries: string[]
  try {
    entries = await readdir(dir)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return []
    }
    throw error
  }

  return entries
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(dir, name))
    .sort()
}

async function main(): Promise<void> {
  const files = (
    await Promise.all(PRESET_DIRS.map((dir) => listPresetJsonFiles(dir)))
  ).flat()

  if (files.length === 0) {
    console.error("No preset JSON files found under presets/official or presets/community.")
    process.exit(1)
  }

  let failed = false

  for (const filePath of files) {
    const relative = path.relative(root, filePath)
    const json = await readFile(filePath, "utf8")
    const result = parsePresetJson(json)

    if (result.success) {
      console.log(`ok  ${relative} (${result.preset.id})`)
      continue
    }

    failed = true
    console.error(`fail ${relative}`)
    for (const error of result.errors) {
      console.error(`  ${error.path}: ${error.message}`)
    }
  }

  if (failed) {
    process.exit(1)
  }

  console.log(`Validated ${files.length} preset file(s).`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
