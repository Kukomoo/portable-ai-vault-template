'use client';
import { useState } from 'react';

interface CopyButtonProps {
  content: string;
  filename?: string; // e.g. "about-me.md" — used for download
}

export default function CopyButton({ content, filename = 'file.md' }: CopyButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'done'>('idle');
  const [dlStatus, setDlStatus] = useState<'idle' | 'done'>('idle');

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopyStatus('done');
    setTimeout(() => setCopyStatus('idle'), 2000);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setDlStatus('done');
    setTimeout(() => setDlStatus('idle'), 2000);
  }

  const btnBase =
    'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60';
  const neutral = 'border-[#e7e5e4] bg-white text-neutral-700 hover:bg-neutral-50';
  const green = 'border-green-300 bg-green-50 text-green-700';

  return (
    <div className="flex gap-2">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={`${btnBase} ${copyStatus === 'done' ? green : neutral}`}
      >
        {copyStatus === 'done' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        )}
        {copyStatus === 'done' ? 'Copied!' : 'Copy'}
      </button>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className={`${btnBase} ${dlStatus === 'done' ? green : neutral}`}
      >
        {dlStatus === 'done' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        )}
        {dlStatus === 'done' ? 'Downloaded' : 'Download'}
      </button>
    </div>
  );
}
