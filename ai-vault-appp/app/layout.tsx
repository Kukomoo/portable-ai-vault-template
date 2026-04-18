// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import SidebarNav from './components/SidebarNav';
import MobileMenu from './components/MobileMenu';

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
          <header className="flex items-center justify-between border-b border-[#e7e5e4] bg-[#fbfbfa] px-4 py-3 md:px-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-black" />
              <span className="text-sm font-semibold">Portable AI Vault</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              {/* Mobile menu toggle */}
              <MobileMenu />
              <button className="hidden rounded-md bg-white px-3 py-1 text-xs shadow-sm border border-neutral-200 hover:bg-neutral-50 transition-colors md:block">
                Sign in with GitHub (coming soon)
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar — hidden on mobile, visible on md+ */}
            <aside className="hidden w-56 flex-none border-r border-[#e7e5e4] bg-[#faf9f7] px-4 py-4 text-sm md:block">
              <SidebarNav />
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
