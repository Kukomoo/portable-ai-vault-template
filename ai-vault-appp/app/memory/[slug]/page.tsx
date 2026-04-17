// app/memory/[slug]/page.tsx
import Link from 'next/link';
import { listDirectory, type GithubContentItem } from '../../lib/github';

const friendlyFolderNames: Record<string, string> = {
  '01-identity': 'Identity',
  '02-projects': 'Projects',
  '03-policies': 'Policies',
  '04-prompts': 'Prompts',
};

const recentFiles = [
  'about-me.md',
  'preferences.md',
  'current-projects.md',
];

export default async function MemoryPage({
  params,
}: {
  params: { slug: string };
}) {
  // Later: map slug → repo; for now, always use your template repo
  const [memoryItems, setMemoryItems] = useState<GithubContentItem[]>([]);
  const fetchedMemoryItems = await listDirectory('memory') as GithubContentItem[];
  const folders = fetchedMemoryItems.filter((item) => item.type === 'dir');

  const title =
    params.slug === 'founder-os'
      ? '🚀 Founder OS'
      : params.slug === 'team-vault'
      ? '👥 Team Vault'
      : '🧠 Personal';

  return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <header className="flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                <p className="text-xs text-neutral-600">
                This space shows the real folders from your template&apos;s
                <code className="ml-1 rounded bg-neutral-100 px-1 py-[1px] text-[10px]">
                    memory/
                </code>{' '}
                directory on GitHub.
                </p>
            </div>
            <div className="flex gap-2">
                <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">
                Paste from chat
                </button>
                <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">
                Copy for AI
                </button>
            </div>
            </header>

            <section className="space-y-3">
            <h2 className="text-sm font-semibold text-neutral-800">Folders</h2>
            <div className="rounded-2xl border border-[#e7e5e4] bg-white p-3 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                <ul>
                {folders.map((f: GithubContentItem) => (
                    <li
                    key={f.path}
                    className="flex items-center justify-between border-b border-neutral-100 last:border-none"
                    >
                    <Link
                        href="#"
                        className="flex flex-1 items-center gap-2 py-2 text-neutral-800 hover:text-black"
                    >
                        <span className="text-xs text-neutral-400">📁</span>
                        <span>{friendlyFolderNames[f.name] ?? f.name}</span>
                    </Link>
                    <span className="text-[11px] uppercase tracking-wide text-neutral-400">
                        folder
                    </span>
                    </li>
                ))}
                </ul>
            </div>
        </section>

        <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">Recent files</h2>
        <div className="rounded-2xl border border-[#e7e5e4] bg-white px-4 py-3 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)]">
            <ul className="space-y-1.5">
            {recentFiles.map((name) => (
                <li key={name} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span>{name}</span>
                </li>
            ))}
            </ul>
        </div>
        </section>
    </div>
    );
}// app/memory/[slug]/page.tsx
import Link from 'next/link';
import { listDirectory } from '@/app/lib/github';

const friendlyFolderNames: Record<string, string> = {
  '01-identity': 'Identity',
  '02-projects': 'Projects',
  '03-policies': 'Policies',
  '04-prompts': 'Prompts',
};

const recentFiles = [
  'about-me.md',
  'preferences.md',
  'current-projects.md',
];

export default async function MemoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const memoryItems = await listDirectory('memory');
  const folders = memoryItems.filter((item) => item.type === 'dir');

  const title =
    params.slug === 'founder-os'
      ? '🚀 Founder OS'
      : params.slug === 'team-vault'
      ? '👥 Team Vault'
      : '🧠 Personal';

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-xs text-neutral-600">
            This space shows the real folders from your template&apos;s
            <code className="ml-1 rounded bg-neutral-100 px-1 py-[1px] text-[10px]">
              memory/
            </code>{' '}
            directory on GitHub.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">
            Paste from chat
          </button>
          <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">
            Copy for AI
          </button>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">Folders</h2>
        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-3 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)]">
          <ul>
            {folders.map((f) => (
              <li
                key={f.path}
                className="flex items-center justify-between border-b border-neutral-100 last:border-none"
              >
                <Link
                  href={`/memory/${params.slug}/folder/${encodeURIComponent(
                    f.name,
                  )}`}
                  className="flex flex-1 items-center gap-2 py-2 text-neutral-800 hover:text-black"
                >
                  <span className="text-xs text-neutral-400">📁</span>
                  <span>{friendlyFolderNames[f.name] ?? f.name}</span>
                </Link>
                <span className="text-[11px] uppercase tracking-wide text-neutral-400">
                  folder
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">Recent files</h2>
        <div className="rounded-2xl border border-[#e7e5e4] bg-white px-4 py-3 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)]">
          <ul className="space-y-1.5">
            {recentFiles.map((name) => (
              <li key={name} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
