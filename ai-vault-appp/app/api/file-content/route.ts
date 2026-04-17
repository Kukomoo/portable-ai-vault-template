// app/api/file-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFileContent } from '@/lib/github';

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }
  try {
    const content = await getFileContent(path);
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
