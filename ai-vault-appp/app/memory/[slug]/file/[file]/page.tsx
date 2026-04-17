// app/memory/[slug]/page.tsx
import Link from 'next/link';

const mockFolders = [
  { name: '01-identity', label: 'Identity' },
  { name: '02-projects', label: 'Projects' },
  { name: '03-policies', label: 'Policies' },
  { name: '04-prompts', label: 'Prompts' },
];

export default function MemoryPage({
  params,
}: {
  params: { slug: string };
}) {
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
            This space stores reusable context for this memory.
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
                {mockFolders.map((f) => (
                    <li
                    key={f.name}
                    className="flex items-center justify-between border-b border-neutral-100 last:border-none"
                    >
                    <Link
                        href="#"
                        className="flex flex-1 items-center gap-2 py-2 text-neutral-800 hover:text-black"
                    >
                        <span className="text-xs text-neutral-400">📁</span>
                        <span>{f.label}</span>
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