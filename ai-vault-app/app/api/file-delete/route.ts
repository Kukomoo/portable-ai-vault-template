// app/api/file-delete/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

export async function DELETE(req: NextRequest) {
  try {
    const { repo, path, message } = await req.json();
    if (!repo || !path) {
      return NextResponse.json({ error: 'Missing repo or path' }, { status: 400 });
    }
    // Get current SHA first
    const shaRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`,
      { headers: authHeaders, cache: 'no-store' }
    );
    if (!shaRes.ok) throw new Error(`Could not get file SHA: ${shaRes.status}`);
    const { sha } = await shaRes.json() as { sha: string };

    const deleteRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`,
      {
        method: 'DELETE',
        headers: authHeaders,
        body: JSON.stringify({ message: message || `Delete ${path.split('/').pop()}`, sha }),
      }
    );
    if (!deleteRes.ok) throw new Error(`Failed to delete: ${deleteRes.status}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}