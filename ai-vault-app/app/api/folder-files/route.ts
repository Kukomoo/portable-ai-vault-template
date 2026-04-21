// app/api/folder-files/route.ts
// Lists all .md files in the root of a memory repo
// Query params: repo (required), path (optional subfolder)
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get('repo');
  const path = req.nextUrl.searchParams.get('path') ?? '';

  if (!repo) {
    return NextResponse.json({ error: 'Missing repo param' }, { status: 400 });
  }

  try {
    const apiPath = path
      ? `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`
      : `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents`;

    const res = await fetch(apiPath, { headers: authHeaders, cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const items = await res.json() as Array<{ name: string; path: string; type: string }>;

    const files = items
      .filter((item) => item.type === 'file' && item.name.endsWith('.md'))
      .map((item) => ({ name: item.name, path: item.path }));

    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
