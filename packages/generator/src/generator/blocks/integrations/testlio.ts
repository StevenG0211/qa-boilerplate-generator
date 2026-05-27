import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../../nodes"

export function generateTestlioCliNodes(config: Config): FileNode[] {
  if (!config.integrations.testlio) {
    return []
  }

  return [
    folder("testlio-cli", [
      file(
        "project-config.json",
        `{
  "baseURI": "https://api.testlio.com",
  "platformURI": "https://app.testlio.com/tmt/project/",
  "projectId": "YOUR_PROJECT_ID",
  "automatedRunCollectionGuid": "YOUR_AUTOMATED_RUN_COLLECTION_GUID",
  "testRunCollectionGuid": "YOUR_TEST_RUN_COLLECTION_GUID",
  "resultCollectionGuid": "YOUR_RESULT_COLLECTION_GUID",
  "workspaceName": "YOUR_WORKSPACE_NAME"
}
`,
        "json",
      ),
      file(
        "test-config.json",
        `{
  "automatedTestNamePrefix": "${config.projectName} Automated Run"
}
`,
        "json",
      ),
    ]),
  ]
}
