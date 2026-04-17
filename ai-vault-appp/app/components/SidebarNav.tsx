'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const memories = [
  { href: '/memory/personal', icon: '🧠', label: 'Personal' },
  { href: '/memory/founder-os', icon: '🚀', label: 'Founder OS' },
  { href: '/memory/team-vault', icon: '👥', label: 'Team Vault' },
];

const templates = [
  { href: '/memory/personal', label: 'Personal' },
  { href: '/memory/founder-os', label: 'Founder' },
  { href: '/memory/team-vault', label: 'Team' },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Memories
        </span>
      </div>

      <button className="mb-4 w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-left text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors">
        + New AI Memory
      </button>

      <nav className="space-y-0.5 text-sm">
        {memories.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 w-full rounded-md px-2 py-1.5 transition-colors ${
                isActive
                  ? 'bg-neutral-100 text-black font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-black" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 space-y-0.5 text-xs text-neutral-500">
        <div className="mb-1 font-semibold uppercase tracking-wide text-neutral-400">
          Templates
        </div>
        {templates.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block w-full rounded-md px-2 py-1 transition-colors hover:bg-neutral-100 hover:text-black"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </>
  );
}
