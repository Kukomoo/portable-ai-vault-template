'use client';

import { useState } from 'react';

interface FileItem {
  name: string;
  path: string;
}

interface FolderCopyButtonProps {
  files: FileItem[];
  folderName: string;
}

export default function FolderCopyButton({ files, folderName }: FolderCopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'copied' | 'error'>('idle');

  async function handleCopyForAI() {
    setStatus('loading');
    try {
      // Fetch all file contents in parallel
      const results = await Promise.all(
        files.map(async (file) => {
          const res = await fetch(`/api/file-content?path=${encodeURIComponent(file.path)}`);
          if (!res.ok) throw new Error(`Failed to fetch ${file.name}`);
          const { content } = await res.json();
          return { name: file.name, content };
        })
      );

      // Concatenate with filename headers
      const combined = results
        .map((f) => `## ${f.name.replace('.md', '')}\n\n${f.content}`)
        .join('\n\n---\n\n');

      const preamble = `# ${folderName} — Full Context\n\n`;
      await navigator.clipboard.writeText(preamble + combined);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  const label =
    status === 'loading'
      ? 'Loading...'
      : status === 'copied'
      ? '✓ Copied!'
      : status === 'error'
      ? 'Error'
      : 'Copy for AI';

  return (
    <button
      onClick={handleCopyForAI}
      disabled={status === 'loading'}
      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
        status === 'copied'
          ? 'border-green-300 bg-green-50 text-green-700'
          : status === 'error'
          ? 'border-red-300 bg-red-50 text-red-700'
          : 'border-[#e7e5e4] bg-white hover:bg-neutral-50'
      }`}
    >
      {label}
    </button>
  );
}
