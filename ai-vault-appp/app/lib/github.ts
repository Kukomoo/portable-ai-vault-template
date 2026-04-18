// app/lib/github.ts
const GITHUB_API_BASE = 'https://api.github.com';

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const token = process.env.GITHUB_TOKEN;

if (!owner || !repo) {
  console.warn('GITHUB_OWNER or GITHUB_REPO env vars are not set.');
}

async function githubFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function githubRequest<T>(
  path: string,
  method: string,
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} — ${text}`);
  }
  return res.json() as Promise<T>;
}

// Types based on GitHub "Get repository content" response
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
  content: string; // base64 encoded
  encoding: string;
};

export async function listDirectory(path: string): Promise<GithubContentItem[]> {
  const encodedPath = path ? encodeURI(path) : '';
  const apiPath = `/repos/${owner}/${repo}/contents/${encodedPath}`;
  return githubFetch<GithubContentItem[]>(apiPath);
}

export async function getFile(path: string): Promise<GithubFileContent> {
  const encodedPath = encodeURI(path);
  const apiPath = `/repos/${owner}/${repo}/contents/${encodedPath}`;
  return githubFetch<GithubFileContent>(apiPath);
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

export async function searchFiles(
  query: string
): Promise<SearchResult[]> {
  const q = encodeURIComponent(
    `${query} repo:${owner}/${repo} extension:md`
  );
  const apiPath = `/search/code?q=${q}&per_page=30`;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.text-match+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${GITHUB_API_BASE}${apiPath}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`GitHub Search error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { items: SearchResult[] };
  return data.items;
}
