import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../nodes"
import { fileExtension } from "../ext"

export function generateZodNodes(config: Config): FileNode[] {
  if (!config.validation.zod) {
    return []
  }
  const ext = fileExtension(config)
  const loginFixtureTs = `import { z } from 'zod'

export const loginFixtureSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
})

export type LoginFixture = z.infer<typeof loginFixtureSchema>
`
  const loginFixtureJs = `const { z } = require('zod')

const loginFixtureSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
})

module.exports = { loginFixtureSchema }
`
  const apiResponseTs = `import { z } from 'zod'

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
})

export type UserResponse = z.infer<typeof userResponseSchema>
`
  const apiResponseJs = `const { z } = require('zod')

const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
})

module.exports = { userResponseSchema }
`
  const loginFixture = ext === "ts" ? loginFixtureTs : loginFixtureJs
  const apiResponse = ext === "ts" ? apiResponseTs : apiResponseJs

  const lang = ext === "ts" ? "typescript" : "javascript"

  return [
    folder("src", [
      folder("schemas", [
        file(`loginFixture.${ext}`, loginFixture, lang),
        file(`apiResponse.${ext}`, apiResponse, lang),
      ]),
    ]),
  ]
}
