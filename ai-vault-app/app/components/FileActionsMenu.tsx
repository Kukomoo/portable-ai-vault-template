'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import { IconDownload } from '@/app/components/CopyButton';

// Edit (pencil) icon
const IconEdit = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// Trash icon
const IconTrash = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

// Three dots icon
const IconDots = (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </svg>
);

interface FileActionsMenuProps {
  filePath: string;
  repo: string;
  initialContent: string;
  fileName: string;
  onSave?: (newContent: string) => void;
}

export default function FileActionsMenu({ filePath, repo, initialContent, fileName, onSave }: FileActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [content, setContent] = useState(initialContent);
  const [tab, setTab] = useState<'raw' | 'preview'>('raw');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeEdit(); closeDelete(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [initialContent]);

  function closeEdit() {
    setEditOpen(false);
    setContent(savedContent); // ← reset to last saved, not original prop
    setTab('raw');
    setSaveStatus('idle');
    setError('');
    }

  function closeDelete() {
    setDeleteOpen(false);
    setDeleteStatus('idle');
    setError('');
  }

  function handleDownload() {
    setMenuOpen(false);
    const blob = new Blob([initialContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

    async function handleSave() {
        setSaveStatus('loading');
        setError('');
        try {
            const res = await fetch('/api/file-update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: filePath, content, repo, message: `Update ${fileName}` }),
            });
            if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to save');
            }
            setSavedContent(content); // ← remember what we just saved
            onSave?.(content);
            closeEdit();
            router.refresh();
        } catch (err) {
            setError(String(err));
            setSaveStatus('error');
        }
    }

  async function handleDelete() {
    setDeleteStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/file-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, repo, message: `Delete ${fileName}` }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      closeDelete();
      router.refresh();
    } catch (err) {
      setError(String(err));
      setDeleteStatus('error');
    }
  }

  const menuItems = [
    { icon: IconEdit, label: 'Edit file', action: () => { setMenuOpen(false); setEditOpen(true); }, danger: false },
    { icon: IconDownload, label: 'Download', action: handleDownload, danger: false },
    { icon: IconTrash, label: 'Delete file', action: () => { setMenuOpen(false); setDeleteOpen(true); }, danger: true },
  ];

  return (
    <>
      <div ref={menuRef} style={{ position: 'relative' }}>
        {/* ••• trigger */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(v => !v); }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px', borderRadius: '0.4rem',
            border: menuOpen ? '1px solid #e7e5e4' : '1px solid transparent',
            background: menuOpen ? '#f5f5f4' : 'none',
            cursor: 'pointer', color: '#78716c', transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f4'; e.currentTarget.style.borderColor = '#e7e5e4'; }}
          onMouseLeave={e => { if (!menuOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; } }}
          title="File actions"
        >
          {IconDots}
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', right: 0, top: '34px', zIndex: 40,
              background: 'white', borderRadius: '0.6rem',
              border: '1px solid #e7e5e4',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              minWidth: '152px', overflow: 'hidden',
            }}
          >
            {menuItems.map(({ icon, label, action, danger }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.5rem 0.875rem',
                  fontSize: '0.8125rem', fontWeight: 400,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: danger ? '#ef4444' : '#1c1917',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = danger ? '#fff5f5' : '#f5f5f4'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                <span style={{ color: danger ? '#ef4444' : '#78716c', display: 'flex' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editOpen && (
        <div onClick={closeEdit} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '0.875rem', padding: '1.5rem', width: '100%', maxWidth: '52rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>Edit file</h2>
                <p style={{ fontSize: '0.7rem', color: '#a8a29e', margin: '0.2rem 0 0' }}>{filePath}</p>
              </div>
              <button onClick={closeEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid #e7e5e4' }}>
              {(['raw', 'preview'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ fontSize: '0.8rem', fontWeight: 500, padding: '0.375rem 0.75rem', border: 'none', borderBottom: tab === t ? '2px solid #1c1917' : '2px solid transparent', background: 'none', cursor: 'pointer', color: tab === t ? '#1c1917' : '#a8a29e', marginBottom: '-1px' }}>
                  {t === 'raw' ? 'Raw' : 'Preview'}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <div style={{ display: tab === 'raw' ? 'block' : 'none' }}>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{ width: '100%', height: '380px', border: '1px solid #e7e5e4', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.8125rem', fontFamily: 'ui-monospace, monospace', lineHeight: 1.65, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#fafaf9' }}
                />
              </div>
              <div style={{ display: tab === 'preview' ? 'block' : 'none', border: '1px solid #e7e5e4', borderRadius: '0.5rem', padding: '1rem 1.25rem', minHeight: '380px', background: 'white' }}>
                {content.trim() ? <MarkdownRenderer content={content} /> : <p style={{ color: '#a8a29e', fontSize: '0.875rem' }}>Nothing to preview yet.</p>}
              </div>
            </div>

            {error && <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={closeEdit} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e7e5e4', background: 'white', fontSize: '0.875rem', cursor: 'pointer', color: '#44403c' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saveStatus === 'loading'} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: saveStatus === 'loading' ? '#d6d3d1' : '#1c1917', color: 'white', fontSize: '0.875rem', fontWeight: 500, cursor: saveStatus === 'loading' ? 'not-allowed' : 'pointer' }}>
                {saveStatus === 'loading' ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteOpen && (
        <div onClick={closeDelete} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '0.875rem', padding: '1.5rem', width: '100%', maxWidth: '26rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>Delete file?</h2>
            <p style={{ fontSize: '0.875rem', color: '#78716c', margin: 0 }}>
              <strong style={{ color: '#1c1917' }}>{fileName}</strong> will be permanently deleted. This cannot be undone.
            </p>
            {error && <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={closeDelete} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e7e5e4', background: 'white', fontSize: '0.875rem', cursor: 'pointer', color: '#44403c' }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteStatus === 'loading'} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: deleteStatus === 'loading' ? '#fca5a5' : '#ef4444', color: 'white', fontSize: '0.875rem', fontWeight: 500, cursor: deleteStatus === 'loading' ? 'not-allowed' : 'pointer' }}>
                {deleteStatus === 'loading' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}