// app/page.tsx
import Link from 'next/link';
import DownloadAllButton from '@/app/components/DownloadAllButton';

const memories = [
  {
    icon: '🧠',
    name: 'Personal',
    slug: 'personal',
    description: 'My reusable personal AI memory',
  },
  {
    icon: '🚀',
    name: 'Founder OS',
    slug: 'founder-os',
    description: 'Company context and projects',
  },
  {
    icon: '👥',
    name: 'Team Vault',
    slug: 'team-vault',
    description: 'Shared context for a small team',
  },
];

export default function HomePage() {
  const vaultList = memories.map((m) => ({ name: m.name, slug: m.slug }));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-50">
            + New AI Memory
          </button>
        </div>
        <p className="text-sm text-neutral-600">
          Create simple spaces that store the important things you repeat to AI:
          your preferences, company context, and active projects.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">Your spaces</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {memories.map((m) => (
            <Link
              key={m.slug}
              href={`/memory/${m.slug}`}
              className="flex flex-col justify-between rounded-2xl border border-[#e7e5e4] bg-white px-4 py-4 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)] hover:border-neutral-300 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="font-medium">{m.name}</span>
                </div>
                <p className="text-xs text-neutral-600">{m.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">Export all data</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Copy or download your entire AI vault as a single Markdown file.
            </p>
          </div>
          <DownloadAllButton vaults={vaultList} />
        </div>
      </section>
    </div>
  );
}
