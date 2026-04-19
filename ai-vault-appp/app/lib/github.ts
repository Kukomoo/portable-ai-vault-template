// app/lib/github.ts
const GITHUB_API_BASE = 'https://api.github.com';

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

if (!owner || !repo) {
  console.warn('GITHUB_OWNER or GITHUB_REPO env vars are not set.');
}

function getGithubHeaders(contentType = true): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function githubRequest<T>(
  path: string,
  method: 'GET' | 'PUT' = 'GET',
  body?: unknown
): Promise<T> {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    method,
    headers: getGithubHeaders(method !== 'GET'),
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} — ${text}`);
  }

  return res.json() as Promise<T>;
}

function requireRepoEnv(): { owner: string; repo: string } {
  if (!owner || !repo) {
    throw new Error('Missing GITHUB_OWNER or GITHUB_REPO environment variables.');
  }

  return { owner, repo };
}

export type GithubContentItem = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string | null;
};

export type GithubFileContent = GithubContentItem & {
  content: string;
  encoding: string;
};

export async function listDirectory(path: string): Promise<GithubContentItem[]> {
  const { owner, repo } = requireRepoEnv();
  const encodedPath = path ? encodeURI(path) : '';
  const apiPath = `/repos/${owner}/${repo}/contents/${encodedPath}`;
  return githubRequest<GithubContentItem[]>(apiPath);
}

export async function getFile(path: string): Promise<GithubFileContent> {
  const { owner, repo } = requireRepoEnv();
  const encodedPath = encodeURI(path);
  const apiPath = `/repos/${owner}/${repo}/contents/${encodedPath}`;
  return githubRequest<GithubFileContent>(apiPath);
}

export async function getFileContent(path: string): Promise<string> {
  const file = await getFile(path);
  const cleaned = file.content.replace(/\n/g, '');
  return decodeURIComponent(escape(atob(cleaned)));
}

export async function getFileSha(path: string): Promise<string> {
  const file = await getFile(path);
  return file.sha;
}

export async function updateFileContent(
  path: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  const { owner, repo } = requireRepoEnv();
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const apiPath = `/repos/${owner}/${repo}/contents/${encodeURI(path)}`;

  await githubRequest(apiPath, 'PUT', {
    message,
    content: encoded,
    sha,
  });
}

export type SearchResult = {
  name: string;
  path: string;
  html_url: string;
  text_matches?: { fragment: string }[];
};

export async function searchFiles(query: string): Promise<SearchResult[]> {
  const { owner, repo } = requireRepoEnv();
  const q = encodeURIComponent(`${query} repo:${owner}/${repo} extension:md`);
  const apiPath = `/search/code?q=${q}&per_page=30`;

  const res = await fetch(`${GITHUB_API_BASE}${apiPath}`, {
    headers: {
      ...getGithubHeaders(false),
      Accept: 'application/vnd.github.text-match+json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`GitHub Search error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { items: SearchResult[] };
  return data.items;
}