'use client';
// app/components/SidebarNav.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewMemoryButton from '@/app/components/NewMemoryButton';
import MemoryIcon from './MemoryIcon';

interface Vault {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

const PINS_KEY = 'sidebar_pinned_vaults';

export default function SidebarNav() {
  const pathname = usePathname();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/vaults')
      .then((r) => r.json())
      .then((data) => {
        if (data.vaults) setVaults(data.vaults);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PINS_KEY);
      if (stored) setPinned(JSON.parse(stored));
    } catch {}
  }, []);

  const togglePin = (slug: string) => {
    setPinned((prev) => {
      let next: string[];
      if (prev.includes(slug)) {
        next = prev.filter((s) => s !== slug);
      } else if (prev.length < 3) {
        next = [...prev, slug];
      } else {
        next = prev; // max 3 pins
      }
      localStorage.setItem(PINS_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Sort: pinned first (in pin order), then rest by name
  const pinnedVaults = pinned
    .map((slug) => vaults.find((v) => v.slug === slug))
    .filter(Boolean) as Vault[];
  const unpinnedVaults = vaults.filter((v) => !pinned.includes(v.slug));

  // Top 3 visible when collapsed: pinned first, then fill with unpinned
  const topVisible = [...pinnedVaults, ...unpinnedVaults].slice(0, 3);
  const remaining = [...pinnedVaults, ...unpinnedVaults].slice(3);
  const visibleVaults = expanded ? [...pinnedVaults, ...unpinnedVaults] : topVisible;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Memories
        </span>
      </div>
      <NewMemoryButton variant="sidebar" onCreated={() => {
        fetch('/api/vaults').then(r => r.json()).then(data => {
          if (data.vaults) setVaults(data.vaults);
        }).catch(() => {});
      }} />
      <nav className="mt-2 space-y-0.5 text-sm">
        {vaults.length === 0 && (
          <p className="text-xs text-neutral-400 px-2 py-1">No memories yet</p>
        )}
        {visibleVaults.map((item) => {
          const href = `/memory/${item.slug}`;
          const isActive = pathname === href || pathname.startsWith(href + '/');
          const isPinned = pinned.includes(item.slug);
          return (
            <div key={item.slug} className="group flex items-center">
              <Link
                href={href}
                className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-black font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <MemoryIcon icon={item.icon} size={16} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-black" />
                )}
              </Link>
              <button
                onClick={() => togglePin(item.slug)}
                title={isPinned ? 'Unpin' : 'Pin to top'}
                className={`ml-1 rounded p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                  isPinned ? 'text-black' : 'text-neutral-400'
                }`}
              >
                {isPinned ? '📌' : '📍'}
              </button>
            </div>
          );
        })}
        {remaining.length > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 flex w-full items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <span>{expanded ? '▲' : '▼'}</span>
            <span>{expanded ? 'Show less' : `+${remaining.length} more`}</span>
          </button>
        )}
      </nav>
      {/* Divider */}
      <div className="my-4 border-t border-[#e7e5e4]" />
      {/* Tools */}
      <div className="mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Tools
        </span>
      </div>
      <nav className="space-y-0.5 text-sm">
        <Link
          href="/search"
          className={`flex items-center gap-2 w-full rounded-md px-2 py-1.5 transition-colors ${
            pathname === '/search'
              ? 'bg-neutral-100 text-black font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
          }`}
        >
          <span>🔍</span>
          <span>Search</span>
          {pathname === '/search' && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-black" />
          )}
        </Link>
      </nav>
    </>
  );
}
