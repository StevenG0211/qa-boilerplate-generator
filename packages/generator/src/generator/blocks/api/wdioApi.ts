import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../../nodes"
import { fileExtension } from "../../ext"
import { hasNodeApiTool } from "./shared"

export function generateWdioApiNodes(config: Config): FileNode[] {
  if (!hasNodeApiTool(config.apiTesting.tool)) {
    return []
  }

  const ext = fileExtension(config)
  const lang = ext === "ts" ? "typescript" : "javascript"
  const tool = config.apiTesting.tool

  return [
    folder("src", [
      folder("api", [
        file(`client.${ext}`, wdioClient(tool, ext), lang),
        file(`usersApi.${ext}`, wdioUsersApi(tool, ext), lang),
      ]),
    ]),
    folder("test", [
      folder("specs", [
        folder("api", [
          file(`users.api.${ext}`, wdioUsersApiSpec(tool, ext), lang),
        ]),
      ]),
    ]),
  ]
}

function wdioClient(tool: Config["apiTesting"]["tool"], ext: "ts" | "js"): string {
  if (tool === "supertest") {
    if (ext === "ts") {
      return `import request from 'supertest';

export function createClient(baseUrl?: string) {
  const url =
    baseUrl ??
    process.env.API_BASE_URL ??
    'https://jsonplaceholder.typicode.com';
  return request(url);
}
`
    }
    return `const request = require('supertest');

function createClient(baseUrl) {
  const url =
    baseUrl ??
    process.env.API_BASE_URL ??
    'https://jsonplaceholder.typicode.com';
  return request(url);
}

module.exports = { createClient };
`
  }

  if (tool === "axios") {
    if (ext === "ts") {
      return `import axios from 'axios';

export const api = axios.create({
  baseURL:
    process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
});
`
    }
    return `const axios = require('axios');

const api = axios.create({
  baseURL:
    process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
});

module.exports = { api };
`
  }

  return ""
}

function wdioUsersApi(tool: Config["apiTesting"]["tool"], ext: "ts" | "js"): string {
  if (tool === "supertest") {
    if (ext === "ts") {
      return `import { createClient } from './client';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export async function getUsers(): Promise<User[]> {
  const response = await createClient().get('/users').expect(200);
  return response.body as User[];
}

export async function getUser(id: number): Promise<User> {
  const response = await createClient().get(\`/users/\${id}\`).expect(200);
  return response.body as User;
}
`
    }
    return `const { createClient } = require('./client');

async function getUsers() {
  const response = await createClient().get('/users').expect(200);
  return response.body;
}

async function getUser(id) {
  const response = await createClient().get(\`/users/\${id}\`).expect(200);
  return response.body;
}

module.exports = { getUsers, getUser };
`
  }

  if (tool === "axios") {
    if (ext === "ts") {
      return `import { api } from './client';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users');
  return data;
}

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get<User>(\`/users/\${id}\`);
  return data;
}
`
    }
    return `const { api } = require('./client');

async function getUsers() {
  const { data } = await api.get('/users');
  return data;
}

async function getUser(id) {
  const { data } = await api.get(\`/users/\${id}\`);
  return data;
}

module.exports = { getUsers, getUser };
`
  }

  return ""
}

function wdioUsersApiSpec(tool: Config["apiTesting"]["tool"], ext: "ts" | "js"): string {
  if (ext === "ts") {
    return `import { expect } from 'expect-webdriverio';
import { getUser, getUsers } from '../../../src/api/usersApi';

describe('Users API', () => {
  it('lists users', async () => {
    const users = await getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  it('gets a user by id', async () => {
    const user = await getUser(1);
    expect(user.id).toBe(1);
    expect(user.email).toBeTruthy();
  });
});
`
  }
  return `const { expect } = require('expect-webdriverio');
const { getUser, getUsers } = require('../../../src/api/usersApi');

describe('Users API', () => {
  it('lists users', async () => {
    const users = await getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  it('gets a user by id', async () => {
    const user = await getUser(1);
    expect(user.id).toBe(1);
    expect(user.email).toBeTruthy();
  });
});
`
}
