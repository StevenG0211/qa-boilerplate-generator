import type { Config } from "@/types"

export function fileExtension(config: Config): "ts" | "js" {
  return config.language === "ts" ? "ts" : "js"
}
