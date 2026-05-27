import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../../nodes"
import { fileExtension } from "../../ext"

export function generateMailinatorNodes(config: Config): FileNode[] {
  if (!config.integrations.mailinator) {
    return []
  }

  const ext = fileExtension(config)
  const lang = ext === "ts" ? "typescript" : "javascript"

  return [
    folder("lib", [
      file(`mailinator-provider.${ext}`, mailinatorProvider(ext), lang),
    ]),
  ]
}

function mailinatorProvider(ext: "ts" | "js"): string {
  if (ext === "js") {
    return `const {
  GetInboxRequest,
  GetMessageLinksRequest,
  GetMessageRequest,
  MailinatorClient,
  Sort,
} = require('mailinator-client');

class Mailinator {
  constructor(apiToken, domain, inbox) {
    this.client = new MailinatorClient(apiToken);
    this.domain = domain;
    this.inbox = inbox;
  }

  async getLastMessage(maxTimeout = 120000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxTimeout) {
      const inboxResponse = await this.client.request(
        new GetInboxRequest(this.domain, this.inbox, 0, 1, Sort.DESC, true),
      );
      const messages = inboxResponse.result?.msgs ?? [];

      if (messages.length > 0) {
        const messageResponse = await this.client.request(
          new GetMessageRequest(this.domain, messages[0].id),
        );
        if (messageResponse.result) {
          return messageResponse.result;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error(\`No new message within \${maxTimeout}ms\`);
  }

  async getLastMessageLinks(maxTimeout = 20000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxTimeout) {
      const inboxResponse = await this.client.request(
        new GetInboxRequest(this.domain, this.inbox, 0, 1, Sort.DESC, true),
      );
      const messages = inboxResponse.result?.msgs ?? [];

      if (messages.length > 0) {
        const messageResponse = await this.client.request(
          new GetMessageLinksRequest(this.domain, messages[0].id),
        );
        const links = messageResponse.result?.links ?? [];
        if (links.length > 0) {
          return links;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error(\`No new message within \${maxTimeout}ms\`);
  }
}

module.exports = { Mailinator };
`
  }

  return `import {
  GetInboxRequest,
  GetMessageLinksRequest,
  GetMessageRequest,
  MailinatorClient,
  Message,
  Sort,
} from 'mailinator-client';

export class Mailinator {
  private client: MailinatorClient;
  private domain: string;
  private inbox: string;

  constructor(apiToken: string, domain: string, inbox: string) {
    this.client = new MailinatorClient(apiToken);
    this.domain = domain;
    this.inbox = inbox;
  }

  async getLastMessage(maxTimeout = 120_000): Promise<Message> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxTimeout) {
      const inboxResponse = await this.client.request(
        new GetInboxRequest(this.domain, this.inbox, 0, 1, Sort.DESC, true),
      );
      const messages = inboxResponse.result?.msgs ?? [];

      if (messages.length > 0) {
        const messageResponse = await this.client.request(
          new GetMessageRequest(this.domain, messages[0].id),
        );
        if (messageResponse.result) {
          return messageResponse.result;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error(\`No new message within \${maxTimeout}ms\`);
  }

  async getLastMessageLinks(maxTimeout = 20_000): Promise<string[]> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxTimeout) {
      const inboxResponse = await this.client.request(
        new GetInboxRequest(this.domain, this.inbox, 0, 1, Sort.DESC, true),
      );
      const messages = inboxResponse.result?.msgs ?? [];

      if (messages.length > 0) {
        const messageResponse = await this.client.request(
          new GetMessageLinksRequest(this.domain, messages[0].id),
        );
        const links = messageResponse.result?.links ?? [];
        if (links.length > 0) {
          return links;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error(\`No new message within \${maxTimeout}ms\`);
  }
}
`
}

