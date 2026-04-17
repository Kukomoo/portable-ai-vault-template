// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchFiles } from '@/lib/github';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchFiles(q.trim());
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
