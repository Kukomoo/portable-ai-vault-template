// app/api/file-content/route.ts
// Returns the text content of a file from a specific memory repo
// Query params: repo (required), path (required)
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
  const path = req.nextUrl.searchParams.get('path');

  if (!repo || !path) {
    return NextResponse.json({ error: 'Missing repo or path param' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`,
      { headers: authHeaders, cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json() as { content: string; encoding: string; sha: string };
    const cleaned = data.content.replace(/\n/g, '');
    const content = decodeURIComponent(escape(atob(cleaned)));

    return NextResponse.json({ content, sha: data.sha });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
