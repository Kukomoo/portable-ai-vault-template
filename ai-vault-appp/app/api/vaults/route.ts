// app/api/vaults/route.ts
import { NextResponse } from 'next/server';
import { listDirectory, getFileContent } from '@/app/lib/github';

interface VaultMeta {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

function parseReadme(content: string, slug: string): { name: string; icon: string; description: string } {
  const lines = content.split('\n').filter((l) => l.trim() !== '');
  const heading = lines[0]?.replace(/^#+\s*/, '').trim() ?? slug;

  // Try to extract emoji icon from heading (e.g. "# 🧠 Personal")
  const emojiMatch = heading.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
  const icon = emojiMatch ? emojiMatch[0] : '📁';
  const name = emojiMatch ? heading.replace(emojiMatch[0], '').trim() : heading;

  // Description: first non-empty line after heading that isn't a heading
  const description = lines.slice(1).find((l) => l.trim() && !l.startsWith('#')) ?? '';

  return { name, icon, description };
}

export async function GET() {
  try {
    const dirs = await listDirectory('memory');
    const vaultDirs = dirs.filter((item) => item.type === 'dir');

    const vaults = await Promise.all(
      vaultDirs.map(async (dir): Promise<VaultMeta> => {
        const slug = dir.name;
        try {
          const readme = await getFileContent(`memory/${slug}/README.md`);
          const { name, icon, description } = parseReadme(readme, slug);
          return { slug, name, icon, description };
        } catch {
          // No README — derive name from slug
          const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          return { slug, name, icon: '📁', description: '' };
        }
      })
    );

    return NextResponse.json({ vaults }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
