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
    // Avoid caching during dev
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// Types based on GitHub "Get repository content" response for directories [web:192]
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

export async function listDirectory(path: string): Promise<GithubContentItem[]> {
  // path like "" (root) or "memory/01-identity"
  const encodedPath = path ? encodeURI(path) : '';
  const apiPath = `/repos/${owner}/${repo}/contents/${encodedPath}`;
  return githubFetch<GithubContentItem[]>(apiPath);
}

export async function getFile(path: string): Promise<GithubContentItem> {
  const encodedPath = encodeURI(path);
  const apiPath = `/repos/${owner}/${repo}/contents/${encodedPath}`;
  return githubFetch<GithubContentItem>(apiPath);
}