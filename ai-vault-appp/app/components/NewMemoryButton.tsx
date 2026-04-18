'use client';
// app/components/NewMemoryButton.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ICON_OPTIONS = [
  '🧠', '🚀', '👥', '💼', '📚', '🎯', '💡', '🔬', '🌍', '🏗️',
  '🤖', '🛠️', '📝', '🎨', '🔥', '⚡', '🌱', '🏆', '🔮', '💎',
  '🦁', '🐉', '🌊', '🎸', '🍀', '✨', '🧩', '🗂️', '📊', '🔑',
];

interface NewMemoryButtonProps {
  variant?: 'home' | 'sidebar';
}

export default function NewMemoryButton({ variant = 'home' }: NewMemoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🧠');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  function toSlug(val: string) {
    return val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleCreate() {
    const slug = toSlug(name);
    if (!slug) return;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/memory-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: name.trim(), icon, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create memory');
      }
      setOpen(false);
      setName('');
      setDescription('');
      setIcon('🧠');
      setStatus('idle');
      router.push(`/memory/${slug}`);
      router.refresh();
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }

  const slug = toSlug(name);

  const triggerButton = variant === 'sidebar' ? (
    <button
      onClick={() => setOpen(true)}
      className="mb-4 w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-left text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
    >
      + New AI Memory
    </button>
  ) : (
    <button
      onClick={() => setOpen(true)}
      className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm"
    >
      + New AI Memory
    </button>
  );

  return (
    <>
      {triggerButton}

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '0.875rem',
              padding: '1.75rem', width: '100%', maxWidth: '30rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              display: 'flex', flexDirection: 'column', gap: '1.25rem',
            }}
          >
            {/* Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>New AI Memory</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#78716c' }}>✕</button>
            </div>

            {/* Icon picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#44403c' }}>Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {ICON_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setIcon(emoji)}
                    style={{
                      width: '2.25rem', height: '2.25rem',
                      borderRadius: '0.5rem',
                      border: icon === emoji ? '2px solid #1c1917' : '1px solid #e7e5e4',
                      background: icon === emoji ? '#f5f5f4' : 'white',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.1s',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#44403c' }}>Name</label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                placeholder="e.g. Work Projects"
                style={{
                  border: '1px solid #e7e5e4', borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem', fontSize: '0.875rem',
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
              {slug && (
                <p style={{ fontSize: '0.7rem', color: '#a8a29e', margin: 0 }}>
                  Slug: <code style={{ background: '#f5f5f4', padding: '0 4px', borderRadius: 3 }}>{slug}</code>
                </p>
              )}
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#44403c' }}>
                Description <span style={{ color: '#a8a29e', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is this memory space for?"
                style={{
                  border: '1px solid #e7e5e4', borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem', fontSize: '0.875rem',
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>

            {error && <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0 }}>{error}</p>}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '0.5rem',
                  border: '1px solid #e7e5e4', background: 'white',
                  fontSize: '0.875rem', cursor: 'pointer', color: '#44403c',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!slug || status === 'loading'}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '0.5rem',
                  border: 'none',
                  background: !slug || status === 'loading' ? '#d6d3d1' : '#1c1917',
                  color: 'white', fontSize: '0.875rem',
                  cursor: !slug || status === 'loading' ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                }}
              >
                {status === 'loading' ? 'Creating...' : 'Create memory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
