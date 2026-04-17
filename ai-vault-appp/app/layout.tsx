// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Portable AI Vault',
  description: 'Keep the important things you repeat to AI in files you own.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f7f7f5] text-[#1f1f1f]">
        <div className="flex h-screen flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b border-[#e7e5e4] bg-[#fbfbfa] px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-black" />
              <span className="text-sm font-semibold">Portable AI Vault</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <button className="rounded-md bg-white px-3 py-1 text-xs shadow-sm border border-neutral-200">
                Sign in with GitHub (coming soon)
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden w-56 flex-none border-r border-[#e7e5e4] bg-[#faf9f7] px-4 py-4 text-sm md:block">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Memories
                </span>
              </div>
              <button className="mb-4 w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-left text-xs font-medium text-neutral-900 hover:bg-neutral-50">
                + New AI Memory
              </button>

              <nav className="space-y-1 text-sm">
                <Link href="/memory/personal" className="block w-full py-1.5 text-neutral-700 hover:text-black">🧠 Personal</Link>
                <Link href="/memory/founder-os" className="block w-full py-1.5 text-neutral-700 hover:text-black">🚀 Founder OS</Link>
                <Link href="/memory/team-vault" className="block w-full py-1.5 text-neutral-700 hover:text-black">👥 Team Vault</Link>
              </nav>

              <div className="mt-6 space-y-1 text-xs text-neutral-500">
                <div className="mt-2 font-semibold uppercase tracking-wide">
                  Templates
                </div>
                <button className="block w-full text-left hover:text-black">
                  Personal
                </button>
                <button className="block w-full text-left hover:text-black">
                  Founder
                </button>
                <button className="block w-full text-left hover:text-black">
                  Team
                </button>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
