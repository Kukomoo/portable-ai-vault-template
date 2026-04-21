'use client';

import { useState } from 'react';
import { BTN_BASE, btnVariant } from '@/app/lib/ui';
import { downloadBlob } from '@/app/lib/download';
import { IconCheck, IconDownload } from '@/app/components/CopyButton';

interface FileItem {
  name: string;
  path: string;
}

interface FolderItem {
  name: string;
  friendlyName: string;
  files: FileItem[];
}

interface ExportButtonProps {
  folders: FolderItem[];
  spaceName: string;
}

export default function ExportButton({ folders, spaceName }: ExportButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleExport() {
    setStatus('loading');
    try {
      const allFetches = folders.flatMap((folder) =>
        folder.files.map(async (file) => {
          const res = await fetch(`/api/file-content?path=${encodeURIComponent(file.path)}`);
          if (!res.ok) throw new Error(`Failed to fetch ${file.path}`);
          const data = (await res.json()) as { content: string };
          return {
            folder: folder.friendlyName,
            filename: file.name,
            content: data.content,
          };
        })
      );

      const results = await Promise.all(allFetches);

      let output = `# ${spaceName} — AI Memory Export\n`;
      output += `Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}\n`;
      output += `\n---\n\n`;

      let currentFolder = '';
      for (const item of results) {
        if (item.folder !== currentFolder) {
          currentFolder = item.folder;
          output += `\n## ${item.folder}\n\n`;
        }
        const displayName = item.filename.replace('.md', '');
        output += `### ${displayName}\n`;
        output += item.content.trim();
        output += `\n\n---\n\n`;
      }

      downloadBlob(
        new Blob([output], { type: 'text/plain;charset=utf-8' }),
        `${spaceName.toLowerCase().replace(/\s+/g, '-')}-ai-memory.txt`
      );

      setStatus('done');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={status === 'loading'}
      className={`${BTN_BASE} ${btnVariant(status)}`}
    >
      {status === 'done' ? IconCheck : IconDownload}
      {status === 'loading'
        ? 'Preparing...'
        : status === 'done'
        ? 'Downloaded'
        : status === 'error'
        ? 'Error'
        : 'Export all'}
    </button>
  );
}