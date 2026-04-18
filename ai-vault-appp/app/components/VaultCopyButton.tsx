'use client';
import { useState } from 'react';

interface FolderItem {
  name: string;
  path: string;
}

interface VaultCopyButtonProps {
  // folders is the list of sub-folders inside this memory vault
  // e.g. [{ name: '01-identity', path: 'memory/01-identity' }, ...]
  folders: FolderItem[];
  vaultName: string;
}

export default function VaultCopyButton({ folders, vaultName }: VaultCopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'copied' | 'error'>('idle');

  async function handleCopyAll() {
    setStatus('loading');
    try {
      // For each folder, list its files via /api/file-content isn't enough —
      // we need a directory listing first. We'll use /api/folder-files to get
      // all .md files in a folder, then fetch each file's content.
      // Since we don't have a folder-list endpoint, we fetch each folder's
      // files via /api/file-content with the folder path pattern.
      //
      // Strategy: call /api/folder-files?folder=<folderName> for each folder,
      // then fetch each file. We'll build that endpoint inline by using
      // a dedicated route. But since we already have /api/file-content for
      // single files, we'll use /api/folder-files (we create it) OR we can
      // use the existing approach: call /api/file-content with each known folder
      // and filename — but we don't know the filenames at the client level.
      //
      // Best approach: add a query param to /api/file-content that returns
      // all files in a folder when ?folder= is provided. But instead we'll
      // leverage /api/folder-files route that we'll create.
      //
      // Simplest working approach with existing routes:
      // Use /api/folder-files?path=memory/<folderName> to list files,
      // then /api/file-content?path=<filePath> for each file.

      const sectionBlocks: string[] = [];

      for (const folder of folders) {
        // List all .md files in this folder
        const listRes = await fetch(`/api/folder-files?path=${encodeURIComponent(folder.path)}`);
        if (!listRes.ok) continue;
        const { files } = await listRes.json() as { files: { name: string; path: string }[] };
        if (!files || files.length === 0) continue;

        // Fetch all file contents in parallel
        const fileContents = await Promise.all(
          files.map(async (file) => {
            const res = await fetch(`/api/file-content?path=${encodeURIComponent(file.path)}`);
            if (!res.ok) return null;
            const { content } = await res.json();
            return { name: file.name, content: content as string };
          })
        );

        const validFiles = fileContents.filter(Boolean) as { name: string; content: string }[];
        if (validFiles.length === 0) continue;

        const folderBlock = validFiles
          .map((f) => `### ${f.name.replace(/\.md$/i, '')}\n\n${f.content}`)
          .join('\n\n---\n\n');

        sectionBlocks.push(`## ${folder.name}\n\n${folderBlock}`);
      }

      if (sectionBlocks.length === 0) {
        throw new Error('No content found');
      }

      const fullContext = `# ${vaultName} — Full Vault Context\n\n${sectionBlocks.join('\n\n===\n\n')}`;
      await navigator.clipboard.writeText(fullContext);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  const label =
    status === 'loading'
      ? 'Loading...'
      : status === 'copied'
      ? '\u2713 Copied!'
      : status === 'error'
      ? 'Error'
      : '\u2756 Export all for AI';

  return (
    <button
      onClick={handleCopyAll}
      disabled={status === 'loading'}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
        status === 'copied'
          ? 'border-green-300 bg-green-50 text-green-700'
          : status === 'error'
          ? 'border-red-300 bg-red-50 text-red-700'
          : 'border-[#e7e5e4] bg-white text-neutral-700 hover:bg-neutral-50'
      }`}
    >
      {label}
    </button>
  );
}
