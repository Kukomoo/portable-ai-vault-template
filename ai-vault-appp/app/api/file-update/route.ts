// app/api/file-update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateFileContent, getFileSha } from '@/lib/github';

export async function PUT(req: NextRequest) {
  try {
    const { path, content, message } = await req.json();
    if (!path || content === undefined) {
      return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
    }
    // Get current SHA
    const sha = await getFileSha(path);
    const commitMsg = message || `Update ${path.split('/').pop()}`;
    await updateFileContent(path, content, sha, commitMsg);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
