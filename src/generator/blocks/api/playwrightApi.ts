import type { Config } from "@/types"
import type { FileNode } from "@/types"
import { file, folder } from "../../nodes"
import { fileExtension } from "../../ext"
import { hasApiTesting } from "./shared"

export function generatePlaywrightApiNodes(config: Config): FileNode[] {
  if (!hasApiTesting(config.apiTesting.tool)) {
    return []
  }

  const ext = fileExtension(config)
  const lang = ext === "ts" ? "typescript" : "javascript"
  const tool = config.apiTesting.tool

  return [
    folder("tests", [
      folder("api", [
        file(`client.${ext}`, playwrightClient(tool, ext), lang),
        file(`usersApi.${ext}`, playwrightUsersApi(tool, ext), lang),
        file(`users.spec.${ext}`, playwrightUsersSpec(tool, ext), lang),
      ]),
    ]),
  ]
}

function playwrightClient(tool: Config["apiTesting"]["tool"], ext: "ts" | "js"): string {
  if (tool === "playwright-built-in") {
    if (ext === "ts") {
      return `import type { APIRequestContext } from '@playwright/test';

const defaultBaseUrl =
  process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

export async function fetchJson<T>(
  request: APIRequestContext,
  path: string,
): Promise<T> {
  const response = await request.get(path);
  if (!response.ok()) {
    throw new Error(\`Request failed: \${response.status()} \${response.statusText()}\`);
  }
  return response.json() as Promise<T>;
}

export function apiBaseUrl(): string {
  return defaultBaseUrl;
}
`
    }
    return `const defaultBaseUrl =
  process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

async function fetchJson(request, path) {
  const response = await request.get(path);
  if (!response.ok()) {
    throw new Error(\`Request failed: \${response.status()} \${response.statusText()}\`);
  }
  return response.json();
}

function apiBaseUrl() {
  return defaultBaseUrl;
}

module.exports = { fetchJson, apiBaseUrl };
`
  }

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

function playwrightUsersApi(tool: Config["apiTesting"]["tool"], ext: "ts" | "js"): string {
  if (tool === "playwright-built-in") {
    if (ext === "ts") {
      return `import type { APIRequestContext } from '@playwright/test';
import { fetchJson } from './client';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export async function getUsers(request: APIRequestContext): Promise<User[]> {
  return fetchJson<User[]>(request, '/users');
}

export async function getUser(
  request: APIRequestContext,
  id: number,
): Promise<User> {
  return fetchJson<User>(request, \`/users/\${id}\`);
}
`
    }
    return `const { fetchJson } = require('./client');

async function getUsers(request) {
  return fetchJson(request, '/users');
}

async function getUser(request, id) {
  return fetchJson(request, \`/users/\${id}\`);
}

module.exports = { getUsers, getUser };
`
  }

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

function playwrightUsersSpec(tool: Config["apiTesting"]["tool"], ext: "ts" | "js"): string {
  if (tool === "playwright-built-in") {
    if (ext === "ts") {
      return `import { test, expect } from '@playwright/test';
import { getUser, getUsers } from './usersApi';

test.describe('Users API', () => {
  test('lists users', async ({ request }) => {
    const users = await getUsers(request);
    expect(users.length).toBeGreaterThan(0);
  });

  test('gets a user by id', async ({ request }) => {
    const user = await getUser(request, 1);
    expect(user.id).toBe(1);
    expect(user.email).toBeTruthy();
  });
});
`
    }
    return `const { test, expect } = require('@playwright/test');
const { getUser, getUsers } = require('./usersApi');

test.describe('Users API', () => {
  test('lists users', async ({ request }) => {
    const users = await getUsers(request);
    expect(users.length).toBeGreaterThan(0);
  });

  test('gets a user by id', async ({ request }) => {
    const user = await getUser(request, 1);
    expect(user.id).toBe(1);
    expect(user.email).toBeTruthy();
  });
});
`
  }

  if (tool === "supertest" || tool === "axios") {
    if (ext === "ts") {
      return `import { test, expect } from '@playwright/test';
import { getUser, getUsers } from './usersApi';

test.describe('Users API', () => {
  test('lists users', async () => {
    const users = await getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  test('gets a user by id', async () => {
    const user = await getUser(1);
    expect(user.id).toBe(1);
    expect(user.email).toBeTruthy();
  });
});
`
    }
    return `const { test, expect } = require('@playwright/test');
const { getUser, getUsers } = require('./usersApi');

test.describe('Users API', () => {
  test('lists users', async () => {
    const users = await getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  test('gets a user by id', async () => {
    const user = await getUser(1);
    expect(user.id).toBe(1);
    expect(user.email).toBeTruthy();
  });
});
`
  }

  return ""
}
