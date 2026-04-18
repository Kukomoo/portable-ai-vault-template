'use client';
// app/components/SidebarNav.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NewMemoryButton from '@/app/components/NewMemoryButton';

const memories = [
  { href: '/memory/personal', icon: '🧠', label: 'Personal' },
  { href: '/memory/founder-os', icon: '🚀', label: 'Founder OS' },
  { href: '/memory/team-vault', icon: '👥', label: 'Team Vault' },
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

      <NewMemoryButton variant="sidebar" />

      <nav className="space-y-0.5 text-sm">
        {memories.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
