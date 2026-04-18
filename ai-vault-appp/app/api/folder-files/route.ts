// app/api/folder-files/route.ts
// Returns a list of .md files in a given folder path (relative to the repo memory root)
import { NextRequest, NextResponse } from 'next/server';
import { listDirectory } from '@/lib/github';

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }
  try {
    const items = await listDirectory(path);
    const files = items
      .filter((item) => item.type === 'file' && item.name.endsWith('.md'))
      .map((item) => ({ name: item.name, path: item.path }));
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
