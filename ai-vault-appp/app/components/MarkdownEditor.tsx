'use client';
import { useState, useCallback } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import CopyButton from './CopyButton';

interface MarkdownEditorProps {
  initialContent: string;
  filePath: string;
  filename: string;
}

export default function MarkdownEditor({ initialContent, filePath, filename }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [content, setContent] = useState(initialContent);
  const [draft, setDraft] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleEdit = useCallback(() => {
    setDraft(content);
    setMode('edit');
  }, [content]);

  const handleCancel = useCallback(() => {
    setDraft(content);
    setMode('view');
  }, [content]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/file-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: filePath,
          content: draft,
          message: `Update ${filename}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }
      setContent(draft);
      setSaveStatus('saved');
      setMode('view');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [draft, filePath, filename]);

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between border-b border-[#e7e5e4] bg-white px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('view')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'view'
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Preview
          </button>
          <button
            onClick={handleEdit}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'edit'
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Edit
          </button>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={content} label="Copy" />
          {mode === 'edit' && (
            <>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  saveStatus === 'saved'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : saveStatus === 'error'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-neutral-900 text-white hover:bg-neutral-700'
                }`}
              >
                {saveStatus === 'saving'
                  ? 'Saving...'
                  : saveStatus === 'saved'
                  ? '✓ Saved'
                  : saveStatus === 'error'
                  ? 'Error saving'
                  : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
      {mode === 'view' ? (
        <div className="p-6">
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-[#e7e5e4] min-h-[500px]">
          <div className="flex flex-col">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 bg-neutral-50 border-b border-[#e7e5e4]">
              Markdown
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              spellCheck={false}
              className="flex-1 resize-none p-4 font-mono text-xs text-neutral-800 focus:outline-none bg-white leading-relaxed"
              placeholder="Write markdown here..."
            />
          </div>
          <div className="flex flex-col overflow-auto">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 bg-neutral-50 border-b border-[#e7e5e4]">
              Preview
            </div>
            <div className="p-4 overflow-auto">
              <MarkdownRenderer content={draft} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
