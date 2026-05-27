import type { APITool } from "@/types"

export const API_BASE_URL =
  "process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'"

export function hasApiTesting(tool: APITool): boolean {
  return tool !== "none"
}

export function hasNodeApiTool(tool: APITool): boolean {
  return tool === "axios" || tool === "supertest"
}
