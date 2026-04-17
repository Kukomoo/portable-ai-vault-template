// app/page.tsx
const mockMemories = [
  {
    icon: '🧠',
    name: 'Personal',
    description: 'My reusable personal AI memory',
    files: 12,
  },
  {
    icon: '🚀',
    name: 'Founder OS',
    description: 'Company context and projects',
    files: 18,
  },
  {
    icon: '👥',
    name: 'Team Vault',
    description: 'Shared context for a small team',
    files: 9,
  },
];

const recentFiles = [
  'Writing style',
  'Company context',
  'Hiring AI policy',
];

export default function HomePage() {
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
          {mockMemories.map((m) => (
            <div
              key={m.name}
              className="flex flex-col justify-between rounded-2xl border border-[#e7e5e4] bg-white px-4 py-4 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="font-medium">{m.name}</span>
                </div>
                <p className="text-xs text-neutral-600">{m.description}</p>
              </div>
              <div className="mt-4 text-[11px] uppercase tracking-wide text-neutral-400">
                {m.files} files
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">
          Recent files
        </h2>
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