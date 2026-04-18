// app/memory/[slug]/page.tsx
// slug = GitHub repo name (the memory vault)
import { listDirectory, getFileContent } from '../../lib/github';
import VaultCopyButton from '@/app/components/VaultCopyButton';
import NewFileButton from '@/app/components/NewFileButton';

const GITHUB_OWNER = process.env.GITHUB_OWNER;

function parseReadme(content: string, slug: string): { name: string; icon: string; description: string } {
  const lines = content.split('\n').filter((l) => l.trim() !== '');
  const heading = lines[0]?.replace(/^#+\s*/, '').trim() ?? slug;
  const emojiMatch = heading.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
  const icon = emojiMatch ? emojiMatch[0] : '📊';
  const name = emojiMatch ? heading.replace(emojiMatch[0], '').trim() : heading;
  const description = lines.slice(1).find((l) => l.trim() && !l.startsWith('#')) ?? '';
  return { name, icon, description };
}

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch all .md files from the root of this repo
  let files: Array<{ name: string; path: string }> = [];
  let meta = { name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), icon: '📊', description: '' };

  try {
    const items = await listDirectory_repo(slug);
    files = items
      .filter((item: { type: string; name: string }) => item.type === 'file' && item.name.endsWith('.md'))
      .map((item: { name: string; path: string }) => ({ name: item.name, path: item.path }));
  } catch {}

  // Try to read the README for title/icon/description
  try {
    const readme = await getFileContent_repo(slug, 'README.md');
    meta = parseReadme(readme, slug);
  } catch {}

  // Build folder list for the Copy for AI button
  const folderList = [{ name: 'All files', path: '' }];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {meta.icon} {meta.name}
          </h1>
          {meta.description && (
            <p className="mt-1 text-sm text-neutral-500">{meta.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <VaultCopyButton repo={slug} folders={folderList} />
          <NewFileButton repo={slug} folder="" />
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">Files</h2>
        {files.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-10 text-center">
            <p className="text-sm text-neutral-400">No files yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((f) => (
              <a
                key={f.path}
                href={`/memory/${slug}/file/${encodeURIComponent(f.path)}`}
                className="flex items-center gap-3 rounded-xl border border-[#e7e5e4] bg-white px-4 py-3 text-sm hover:shadow-sm transition-shadow"
              >
                <span className="text-base">📝</span>
                <span className="font-medium text-neutral-900">{f.name.replace(/\.md$/, '')}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Helper: list root contents of a specific repo
async function listDirectory_repo(repo: string) {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents`,
    { headers, cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

async function getFileContent_repo(repo: string, path: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${repo}/contents/${path}`,
    { headers, cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json() as { content: string };
  const cleaned = data.content.replace(/\n/g, '');
  return decodeURIComponent(escape(atob(cleaned)));
}
