// app/memory/[slug]/page.tsx
// slug = GitHub repo name (the memory vault)
import VaultCopyButton from '@/app/components/VaultCopyButton';
import NewFileButton from '@/app/components/NewFileButton';

const GITHUB_OWNER = process.env.GITHUB_OWNER;

// Files that are internal/system files and should never be shown to users
const HIDDEN_FILES = ['README.md', 'readme.md'];

function parseVaultMeta(repoDescription: string, slug: string): { name: string; icon: string; description: string } {
  const desc = repoDescription ?? '';
  const emojiMatch = desc.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
  const icon = emojiMatch ? emojiMatch[0] : '📊';
  const description = emojiMatch ? desc.replace(emojiMatch[0], '').trim() : desc;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { name, icon, description };
}

function friendlyFileName(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let files: Array<{ name: string; path: string }> = [];
  let meta = { name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), icon: '📊', description: '' };

  try {
    // Get repo info for the description/icon
    const repoInfo = await fetchRepoInfo(slug);
    meta = parseVaultMeta(repoInfo.description ?? '', slug);

    // List all .md files, excluding system files
    const items = await fetchRepoContents(slug);
    files = items
      .filter((item: { type: string; name: string }) =>
        item.type === 'file' &&
        item.name.endsWith('.md') &&
        !HIDDEN_FILES.includes(item.name)
      )
      .map((item: { name: string; path: string }) => ({ name: item.name, path: item.path }));
  } catch {}

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
        <div className="flex flex-wrap items-center gap-2">
          <VaultCopyButton repo={slug} folders={folderList} />
          <NewFileButton repo={slug} folder="" />
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">Files</h2>
        {files.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-10 text-center">
            <p className="text-sm text-neutral-400">No files yet.</p>
            <p className="mt-1 text-xs text-neutral-400">Click &quot;+ New File&quot; to add your first note.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((f) => (
              <a
                key={f.path}
                href={`/memory/${slug}/file/${encodeURIComponent(f.path)}`}
                className="flex items-center gap-3 rounded-xl border border-[#e7e5e4] bg-white px-4 py-3 text-sm hover:shadow-sm transition-shadow group"
              >
                <span className="text-base">📝</span>
                <div className="flex flex-col">
                  <span className="font-medium text-neutral-900">{friendlyFileName(f.name)}</span>
                  <span className="text-xs text-neutral-400">{f.name}</span>
                </div>
                <span className="ml-auto text-neutral-300 group-hover:text-neutral-500 transition-colors">→</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

async function fetchRepoInfo(repo: string) {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${repo}`,
    { headers, cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json() as Promise<{ description: string | null }>;
}

async function fetchRepoContents(repo: string) {
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
