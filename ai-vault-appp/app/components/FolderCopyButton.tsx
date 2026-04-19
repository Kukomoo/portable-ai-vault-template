'use client';

import { useState } from 'react';
import { BTN_BASE, btnVariant } from '@/app/lib/ui';
import { downloadFilesOrZip } from '@/app/lib/download';
import { IconCheck, IconCopy, IconDownload } from '@/app/components/CopyButton';

interface FileItem {
  name: string;
  path: string;
}

interface FolderCopyButtonProps {
  files: FileItem[];
  folderName: string;
  slug: string; // repo name — passed to /api/file-content?repo=
}

async function fetchFileContent(file: FileItem, slug: string): Promise<{ name: string; content: string }> {
  const res = await fetch(`/api/file-content?repo=${encodeURIComponent(slug)}&path=${encodeURIComponent(file.path)}`);
  if (!res.ok) throw new Error(`Failed to fetch ${file.name}`);
  const { content } = await res.json();
  return { name: file.name, content };
}

export default function FolderCopyButton({ files, folderName, slug }: FolderCopyButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [dlStatus, setDlStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleCopy() {
    setCopyStatus('loading');
    try {
      const fetched = await Promise.all(files.map((f) => fetchFileContent(f, slug)));
      const text = fetched
        .map((f) => `## ${f.name.replace(/\.md$/i, '')}\n\n${f.content}`)
        .join('\n\n---\n\n');

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
      const fetched = await Promise.all(files.map((f) => fetchFileContent(f, slug)));

      downloadFilesOrZip(
        fetched.map((f) => ({
          name: f.name.endsWith('.md') ? f.name : `${f.name}.md`,
          content: f.content,
        })),
        `${folderName.toLowerCase().replace(/\s+/g, '-')}.zip`
      );

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
    copyStatus === 'done' ? 'Copied!' :
    copyStatus === 'error' ? 'Error' : 'Copy all';

  const dlLabel =
    dlStatus === 'loading' ? 'Downloading...' :
    dlStatus === 'done' ? 'Downloaded!' :
    dlStatus === 'error' ? 'Error' :
    files.length === 1 ? 'Download file' : 'Download all files';

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        disabled={copyStatus === 'loading'}
        className={`${BTN_BASE} ${btnVariant(copyStatus)}`}
      >
        {copyStatus === 'done' ? IconCheck : IconCopy}
        {copyLabel}
      </button>
      <button
        onClick={handleDownload}
        disabled={dlStatus === 'loading'}
        className={`${BTN_BASE} ${btnVariant(dlStatus)}`}
      >
        {dlStatus === 'done' ? IconCheck : IconDownload}
        {dlLabel}
      </button>
    </div>
  );
}
