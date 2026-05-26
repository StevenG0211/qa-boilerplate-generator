import type { Config } from "@/types"
import { resolveDependencyManifest } from "./dependencyManifest"

type PackageJsonShape = {
  name: string
  version: string
  private: boolean
  scripts: Record<string, string>
  devDependencies: Record<string, string>
  overrides?: Record<string, Record<string, string>>
}

export function generatePackageJson(config: Config): string {
  const shape = buildPackageJsonShape(config)
  return `${JSON.stringify(shape, null, 2)}\n`
}

function buildPackageJsonShape(config: Config): PackageJsonShape {
  const { projectName } = config
  const manifest = resolveDependencyManifest(config)

  const base: PackageJsonShape = {
    name: projectName,
    version: "1.0.0",
    private: true,
    scripts: manifest.scripts,
    devDependencies: manifest.devDependencies,
  }

  if (manifest.overrides) {
    base.overrides = manifest.overrides
  }

  return base
}
