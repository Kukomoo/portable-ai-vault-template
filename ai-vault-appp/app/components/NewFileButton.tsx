'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BTN_BASE, BTN_NEUTRAL, IconPlus } from '@/app/components/CopyButton';

interface NewFileButtonProps {
  repo: string;   // e.g. "hobbies"
  folder: string; // e.g. "" for root, or "01-identity" for subfolder
}

export default function NewFileButton({ repo, folder }: NewFileButtonProps) {
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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

  async function handleCreate() {
    const name = filename.trim();
    if (!name) return;
    const safeName = name.endsWith('.md') ? name : `${name}.md`;
    const path = folder ? `${folder}/${safeName}` : safeName;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/file-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo, path, content, message: `Create ${safeName}` }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create file');
      }
      setOpen(false);
      setFilename('');
      setContent('');
      setStatus('idle');
      router.push(`/memory/${repo}/file/${encodeURIComponent(path)}`);
      router.refresh();
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${BTN_BASE} ${BTN_NEUTRAL}`}>
        {IconPlus}
        New file
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', width: '100%', maxWidth: '28rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>New file</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#44403c' }}>File name</label>
              <input
                ref={inputRef}
                type="text"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                placeholder="e.g. my-goals or travel-plans"
                style={{ border: '1px solid #e7e5e4', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#44403c' }}>
                Content <span style={{ color: '#a8a29e', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's on your mind? You can always edit this later..."
                rows={5}
                style={{ border: '1px solid #e7e5e4', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {error && <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setOpen(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e7e5e4', background: 'white', fontSize: '0.875rem', cursor: 'pointer', color: '#44403c' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!filename.trim() || status === 'loading'}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: !filename.trim() || status === 'loading' ? '#d6d3d1' : '#1c1917', color: 'white', fontSize: '0.875rem', fontWeight: 500, cursor: !filename.trim() || status === 'loading' ? 'not-allowed' : 'pointer' }}
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