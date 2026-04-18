'use client';
// app/components/NewFileButton.tsx
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NewFileButtonProps {
  folderPath: string; // e.g. "memory/01-identity"
  slug: string;       // e.g. "personal"
  folder: string;     // e.g. "01-identity"
}

export default function NewFileButton({ folderPath, slug, folder }: NewFileButtonProps) {
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  async function handleCreate() {
    const name = filename.trim();
    if (!name) return;
    const safeName = name.endsWith('.md') ? name : `${name}.md`;
    const path = `${folderPath}/${safeName}`;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/file-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          content,
          message: `Create ${safeName}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create file');
      }
      setStatus('success');
      setOpen(false);
      setFilename('');
      setContent('');
      setStatus('idle');
      // Navigate to the new file
      router.push(`/memory/${slug}/folder/${folder}/file/${encodeURIComponent(safeName)}`);
      router.refresh();
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '0.375rem 0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid #e7e5e4',
          background: 'white',
          color: '#1c1917',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f4')}
        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
        New file
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '28rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>New file</h2>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#78716c' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#44403c' }}>Filename</label>
              <input
                ref={inputRef}
                type="text"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                placeholder="e.g. about-me or about-me.md"
                style={{
                  border: '1px solid #e7e5e4',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '0.7rem', color: '#a8a29e', margin: 0 }}>.md will be added automatically if not included</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#44403c' }}>Initial content <span style={{ color: '#a8a29e', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing markdown..."
                rows={5}
                style={{
                  border: '1px solid #e7e5e4',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0 }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e7e5e4',
                  background: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: '#44403c',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!filename.trim() || status === 'loading'}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: !filename.trim() || status === 'loading' ? '#d6d3d1' : '#1c1917',
                  color: 'white',
                  fontSize: '0.875rem',
                  cursor: !filename.trim() || status === 'loading' ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                }}
              >
                {status === 'loading' ? 'Creating...' : 'Create file'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
