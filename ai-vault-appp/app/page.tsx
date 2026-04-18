'use client';
// app/page.tsx
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DownloadAllButton from '@/app/components/DownloadAllButton';
import NewMemoryButton from '@/app/components/NewMemoryButton';

interface Vault {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export default function HomePage() {
  const [vaults, setVaults] = useState<Vault[]>([]);

  const loadVaults = () => {
    fetch('/api/vaults')
      .then((r) => r.json())
      .then((data) => { if (data.vaults) setVaults(data.vaults); })
      .catch(() => {});
  };

  useEffect(() => { loadVaults(); }, []);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <NewMemoryButton variant="home" onCreated={loadVaults} />
        </div>
        <p className="text-sm text-neutral-600">
          Create simple spaces that store the important things you repeat to AI:
          your preferences, company context, and active projects.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">Your spaces</h2>
        {vaults.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center">
            <p className="text-sm text-neutral-400">No memory spaces yet.</p>
            <p className="mt-1 text-xs text-neutral-400">Click &quot;+ New AI Memory&quot; to create your first one.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {vaults.map((m) => (
              <Link
                key={m.slug}
                href={`/memory/${m.slug}`}
                className="flex flex-col gap-2 rounded-xl border border-[#e7e5e4] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{m.icon}</span>
                <p className="font-medium text-neutral-900">{m.name}</p>
                <p className="text-xs text-neutral-500 line-clamp-2">{m.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">Export all data</h2>
        <p className="text-sm text-neutral-600">
          Copy or download your entire AI vault as a single Markdown file.
        </p>
        <DownloadAllButton />
      </section>
    </div>
  );
}
