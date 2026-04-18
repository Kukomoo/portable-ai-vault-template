'use client';
// app/components/MobileMenu.tsx
import { useState } from 'react';
import SidebarNav from './SidebarNav';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col justify-center gap-1 rounded-md p-2 hover:bg-neutral-100 transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        <span className={`block h-0.5 w-5 bg-neutral-700 transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-5 bg-neutral-700 transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-5 bg-neutral-700 transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
      </button>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Drawer panel */}
          <div
            className="absolute left-0 top-0 h-full w-72 bg-[#faf9f7] px-4 py-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-black" />
                <span className="text-sm font-semibold">Portable AI Vault</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-neutral-100 transition-colors text-neutral-500"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <SidebarNav />
          </div>
        </div>
      )}
    </>
  );
}
