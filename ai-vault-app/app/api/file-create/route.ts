// app/api/file-create/route.ts
// Creates a new file in a specific memory repo
// Body: { repo, path, content?, message? }
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const authHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

export async function POST(req: NextRequest) {
  try {
    const { repo, path, content, message } = await req.json();

    if (!repo || !path) {
      return NextResponse.json({ error: 'Missing repo or path' }, { status: 400 });
    }

    const encoded = Buffer.from(content ?? '', 'utf-8').toString('base64');
    const commitMsg = message || `Create ${path.split('/').pop()}`;

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ message: commitMsg, content: encoded }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      // 422 = file already exists
      if (res.status === 422) {
        return NextResponse.json({ error: 'File already exists' }, { status: 409 });
      }
      throw new Error(err.message || `Failed to create file: ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
