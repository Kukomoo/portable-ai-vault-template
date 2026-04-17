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
}

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

async function githubFetch(path: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const res = await fetch(url, {
    headers: authHeaders,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} for path: ${path}`);
  }

  return res.json();
}

export async function listDirectory(path: string): Promise<GitHubItem[]> {
  const data = await githubFetch(path);
  if (!Array.isArray(data)) {
    throw new Error(`Expected directory listing for path: ${path}`);
  }
  return data as GitHubItem[];
}

export async function getFileContent(path: string): Promise<string> {
  const data = await githubFetch(path);

  // Case 1: content is present and base64 encoded (files < 1MB)
  if (data.encoding === 'base64' && data.content) {
    return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
  }

  // Case 2: file too large for contents API — use download_url
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
