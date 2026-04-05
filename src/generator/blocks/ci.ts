import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../nodes"

export function generateCiNodes(config: Config): FileNode[] {
  if (config.ci.provider === "github") {
    return [
      folder(".github", [
        folder("workflows", [file("test.yml", githubWorkflow(config), "yaml")]),
      ]),
    ]
  }
  if (config.ci.provider === "gitlab") {
    return [file(".gitlab-ci.yml", gitlabCi(config), "yaml")]
  }
  return []
}

function githubWorkflow(config: Config): string {
  const fw = config.framework
  const install = "      - run: npm install"

  if (fw === "playwright") {
    return (
      `name: Test
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
` +
      install +
      `
      - run: npx playwright install --with-deps
      - run: npm test
`
    )
  }

  if (fw === "wdio") {
    return (
      `name: Test
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
` +
      install +
      `
      - run: npm run wdio
`
    )
  }

  return (
    `name: Test
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
` +
    install +
    `
      - run: npm run cypress:run
`
  )
}

function gitlabCi(config: Config): string {
  const fw = config.framework
  const base = `image: node:20

cache:
  paths:
    - node_modules/

before_script:
  - npm install
`

  if (fw === "playwright") {
    return (
      base +
      `test:
  stage: test
  script:
    - npx playwright install --with-deps
    - npm test
`
    )
  }

  if (fw === "wdio") {
    return (
      base +
      `test:
  stage: test
  script:
    - npm run wdio
`
    )
  }

  return (
    base +
    `test:
  stage: test
  script:
    - npm run cypress:run
`
  )
}
