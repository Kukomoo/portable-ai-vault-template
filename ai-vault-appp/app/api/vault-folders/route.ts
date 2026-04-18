// app/api/vault-folders/route.ts
// Returns all sub-directories under memory/ (the vault's folders).
// The `slug` param is accepted but currently all vaults share the same
// memory directory structure, so we return all dirs regardless.
import { NextRequest, NextResponse } from 'next/server';
import { listDirectory } from '@/lib/github';

export async function GET(_req: NextRequest) {
  try {
    const items = await listDirectory('memory');
    const folders = items
      .filter((item) => item.type === 'dir')
      .map((item) => ({ name: item.name, path: item.path }));
    return NextResponse.json({ folders });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
