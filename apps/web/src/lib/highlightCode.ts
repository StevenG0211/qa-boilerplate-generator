import hljs from "highlight.js/lib/core"
import bash from "highlight.js/lib/languages/bash"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import markdown from "highlight.js/lib/languages/markdown"
import typescript from "highlight.js/lib/languages/typescript"
import yaml from "highlight.js/lib/languages/yaml"

hljs.registerLanguage("json", json)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("js", javascript)
hljs.registerLanguage("ts", typescript)
hljs.registerLanguage("yaml", yaml)
hljs.registerLanguage("yml", yaml)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("sh", bash)
hljs.registerLanguage("shell", bash)
hljs.registerLanguage("markdown", markdown)
hljs.registerLanguage("md", markdown)

export function highlightToHtml(code: string, language: string): string {
  const lang = language.toLowerCase().trim() || "plaintext"
  if (lang === "plaintext" || lang === "text") {
    return escapeHtml(code)
  }
  try {
    const { value } = hljs.highlight(code, {
      language: lang,
      ignoreIllegals: true,
    })
    return value
  } catch {
    return escapeHtml(code)
  }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}
