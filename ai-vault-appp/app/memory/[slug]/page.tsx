// app/memory/[slug]/page.tsx
import Link from 'next/link';
import { listDirectory } from '../../lib/github';

const friendlyFolderNames: Record<string, string> = {
  '01-identity': 'Identity',
  '02-projects': 'Projects',
  '03-policies': 'Policies',
  '04-prompts': 'Prompts',
};

const memoryMeta: Record<string, { icon: string; title: string; description: string }> = {
  personal: {
    icon: '🧠',
    title: 'Personal',
    description: 'Your reusable personal AI memory — preferences, identity, and saved prompts.',
  },
  'founder-os': {
    icon: '🚀',
    title: 'Founder OS',
    description: 'Company context, product strategy, ICP, and hiring policies.',
  },
  'team-vault': {
    icon: '👥',
    title: 'Team Vault',
    description: 'Shared knowledge, working agreements, and client context for small teams.',
  },
};

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = memoryMeta[slug] ?? {
    icon: '📁',
    title: slug,
    description: 'Your AI memory space.',
  };

  const memoryItems = await listDirectory('memory');
  const folders = memoryItems.filter((item) => item.type === 'dir');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {meta.icon} {meta.title}
          </h1>
          <p className="text-xs text-neutral-600">{meta.description}</p>
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
                  href={`/memory/${slug}/folder/${encodeURIComponent(f.name)}`}
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
    </div>
  );
}
