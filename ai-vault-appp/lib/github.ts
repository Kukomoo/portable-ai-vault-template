// lib/github.ts
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_OWNER;
const REPO_NAME = process.env.GITHUB_REPO;

export interface GitHubItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  html_url: string;
  download_url: string | null;
  sha?: string;
}

export interface SearchResult {
  name: string;
  path: string;
  html_url: string;
  repository: { full_name: string };
  text_matches?: { fragment: string }[];
}

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

// repo defaults to REPO_NAME env var; pass an explicit repo to target a different vault
async function githubFetch(path: string, repo: string = REPO_NAME ?? '') {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${repo}/contents/${path}`;
  const res = await fetch(url, {
    headers: authHeaders,
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} for path: ${path}`);
  }
  return res.json();
}

export async function listDirectory(path: string, repo?: string): Promise<GitHubItem[]> {
  const data = await githubFetch(path, repo);
  if (!Array.isArray(data)) {
    throw new Error(`Expected directory listing for path: ${path}`);
  }
  return data as GitHubItem[];
}

export async function getFileContent(path: string, repo?: string): Promise<string> {
  const data = await githubFetch(path, repo);
  // Case 1: content is present and base64 encoded (files < 1MB)
  if (data.encoding === 'base64' && data.content) {
    return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
  }
  // Case 2: file too large for contents API - use download_url
  if (data.download_url) {
    const res = await fetch(data.download_url, {
      headers: authHeaders,
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to download file from: ${data.download_url}`);
    }
    return res.text();
  }
  throw new Error(`Could not decode file content for path: ${path}`);
}

export async function getFileSha(path: string, repo?: string): Promise<string> {
  const data = await githubFetch(path, repo);
  return data.sha as string;
}

export async function updateFileContent(
  path: string,
  content: string,
  sha: string,
  message: string,
  repo?: string
): Promise<void> {
  const repoName = repo ?? REPO_NAME ?? '';
  const url = `https://api.github.com/repos/${REPO_OWNER}/${repoName}/contents/${path}`;
  const encoded = Buffer.from(content, 'utf-8').toString('base64');
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: encoded, sha }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update file: ${err}`);
  }
}

export async function createFile(
  path: string,
  content: string,
  message: string,
  repo?: string
): Promise<void> {
  const repoName = repo ?? REPO_NAME ?? '';
  const url = `https://api.github.com/repos/${REPO_OWNER}/${repoName}/contents/${path}`;
  const encoded = Buffer.from(content, 'utf-8').toString('base64');
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: encoded }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create file: ${err}`);
  }
}

export async function searchFiles(query: string): Promise<SearchResult[]> {
  const q = encodeURIComponent(`${query} repo:${REPO_OWNER}/${REPO_NAME} extension:md`);
  const url = `https://api.github.com/search/code?q=${q}&per_page=30`;
  const res = await fetch(url, {
    headers: {
      ...authHeaders,
      Accept: 'application/vnd.github.v3.text-match+json',
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Search API error: ${res.status}`);
  }
  const data = await res.json();
  return data.items as SearchResult[];
}
