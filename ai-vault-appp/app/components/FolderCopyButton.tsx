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

async function fetchFileContent(file: FileItem): Promise<{ name: string; content: string }> {
  const res = await fetch(`/api/file-content?path=${encodeURIComponent(file.path)}`);
  if (!res.ok) throw new Error(`Failed to fetch ${file.name}`);
  const { content } = await res.json();
  return { name: file.name, content };
}

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FolderCopyButton({ files, folderName }: FolderCopyButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [dlStatus, setDlStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleCopy() {
    setCopyStatus('loading');
    try {
      const results = await Promise.all(files.map(fetchFileContent));
      const combined = results
        .map((f) => `## ${f.name.replace(/\.md$/i, '')}\n\n${f.content}`)
        .join('\n\n---\n\n');
      const text = `# ${folderName} \u2014 Full Context\n\n${combined}`;
      await navigator.clipboard.writeText(text);
      setCopyStatus('done');
      setTimeout(() => setCopyStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  }

  async function handleDownload() {
    setDlStatus('loading');
    try {
      // Download each file individually with a small delay between each
      for (const file of files) {
        const { content } = await fetchFileContent(file);
        triggerDownload(file.name, content);
        // Small delay so the browser processes each download
        await new Promise((r) => setTimeout(r, 300));
      }
      setDlStatus('done');
      setTimeout(() => setDlStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setDlStatus('error');
      setTimeout(() => setDlStatus('idle'), 3000);
    }
  }

  const copyLabel =
    copyStatus === 'loading' ? 'Copying...' :
    copyStatus === 'done' ? '\u2713 Copied!' :
    copyStatus === 'error' ? 'Error' :
    'Copy all';

  const dlLabel =
    dlStatus === 'loading' ? 'Downloading...' :
    dlStatus === 'done' ? `\u2713 ${files.length} file${files.length !== 1 ? 's' : ''} saved` :
    dlStatus === 'error' ? 'Error' :
    '\u2913 Download files';

  const btnBase = 'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60';
  const neutral = 'border-[#e7e5e4] bg-white text-neutral-700 hover:bg-neutral-50';
  const green = 'border-green-300 bg-green-50 text-green-700';
  const red = 'border-red-300 bg-red-50 text-red-700';

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        disabled={copyStatus === 'loading'}
        className={`${btnBase} ${
          copyStatus === 'done' ? green : copyStatus === 'error' ? red : neutral
        }`}
      >
        {copyLabel}
      </button>
      <button
        onClick={handleDownload}
        disabled={dlStatus === 'loading'}
        className={`${btnBase} ${
          dlStatus === 'done' ? green : dlStatus === 'error' ? red : neutral
        }`}
      >
        {dlLabel}
      </button>
    </div>
  );
}
