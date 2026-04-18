// app/api/file-create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createFile } from '@/lib/github';

export async function POST(req: NextRequest) {
  try {
    const { path, content, message } = await req.json();
    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }
    const commitMsg = message || `Create ${path.split('/').pop()}`;
    await createFile(path, content ?? '', commitMsg);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
