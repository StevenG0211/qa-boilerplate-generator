import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file } from "../nodes"

export function generateLintingNodes(config: Config): FileNode[] {
  const nodes: FileNode[] = []
  const { eslint, prettier } = config.linting
  const isTs = config.language === "ts"

  if (eslint) {
    nodes.push(file(".eslintrc.cjs", eslintRcCjs({ isTs, prettier }), "javascript"))
  }
  if (prettier) {
    nodes.push(
      file(
        ".prettierrc",
        `${JSON.stringify(
          { semi: false, singleQuote: true, trailingComma: "es5" as const },
          null,
          2,
        )}\n`,
        "json",
      ),
    )
  }
  if (eslint && prettier) {
    nodes.push(
      file(
        ".eslintignore",
        "dist\ncoverage\nplaywright-report\nallure-results\n.mochawesome-report\n",
        "plaintext",
      ),
    )
  }

  return nodes
}

function eslintRcCjs(opts: { isTs: boolean; prettier: boolean }): string {
  const { isTs, prettier } = opts
  if (isTs) {
    const extendsArr = prettier
      ? `[
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ]`
      : `[
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ]`
    return `module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint'${prettier ? ", 'prettier'" : ""}],
  extends: ${extendsArr},
  ignorePatterns: ['dist', 'coverage'],
};
`
  }
  const extendsArr = prettier
    ? "['eslint:recommended', 'plugin:prettier/recommended']"
    : "['eslint:recommended']"
  return `module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ${extendsArr},
  ignorePatterns: ['dist', 'coverage'],
};
`
}
