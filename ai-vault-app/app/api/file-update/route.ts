// app/api/file-update/route.ts
// Updates a file in a specific memory repo
// Body: { repo, path, content, message? }
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

export async function PUT(req: NextRequest) {
  try {
    const { repo, path, content, message } = await req.json();

    if (!repo || !path || content === undefined) {
      return NextResponse.json({ error: 'Missing repo, path, or content' }, { status: 400 });
    }

    // Get current SHA
    const shaRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`,
      { headers: authHeaders, cache: 'no-store' }
    );
    if (!shaRes.ok) {
      throw new Error(`Could not get file SHA: ${shaRes.status}`);
    }
    const shaData = await shaRes.json() as { sha: string };

    const encoded = Buffer.from(content, 'utf-8').toString('base64');
    const commitMsg = message || `Update ${path.split('/').pop()}`;

    const updateRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ message: commitMsg, content: encoded, sha: shaData.sha }),
      }
    );

    if (!updateRes.ok) {
      throw new Error(`Failed to update file: ${updateRes.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
