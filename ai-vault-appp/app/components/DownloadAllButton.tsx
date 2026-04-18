'use client';
import { useState } from 'react';

// The home-page "export everything" button.
// Receives a list of vaults (name + slug), fetches all folders
// in each vault, then all files, and either copies or downloads.

interface VaultInfo {
  name: string;   // display name e.g. "Founder OS"
  slug: string;   // URL slug  e.g. "founder-os"
}

interface DownloadAllButtonProps {
  vaults: VaultInfo[];
}

async function buildAllContent(vaults: VaultInfo[]): Promise<string> {
  const vaultBlocks: string[] = [];

  for (const vault of vaults) {
    // 1. List top-level folders for this vault (the memory sub-dirs)
    const listRes = await fetch(`/api/folder-files?path=${encodeURIComponent(`memory`)}`);
    // Actually memory root lists all vault-level dirs, not per-vault.
    // Since vaults ARE the top-level dirs under memory/, we list per vault:
    // path = memory (the whole root), then filter by vault... 
    // Better: we just list memory/<slug> or use /api/vault-folders.
    // For now, list memory/ once and pick sub-folders matching the vault.
    // Simplest: use /api/folder-files on the memory root to get all sub-dirs
    // then for each sub-dir that matches the vault structure, get files.
    // But /api/folder-files only returns .md files, not dirs.
    // We need a general directory listing. Let's use /api/list-dir instead.
    //
    // Given what we have: we know the vault folder structure is
    //   memory/<vaultFolder>/<subFolder>/<file>.md
    // Each vault's folders are passed at the folder level. Here we don't 
    // have that, but we can call /api/vault-folders?slug=<slug>
    // which we need to create... OR we can just hit /api/folder-files
    // for the known folder paths.
    //
    // Since the vault page DOES know folder paths, the home page needs
    // an endpoint. Use /api/vault-folders?slug=<slug> which lists
    // dirs inside memory/ that belong to the vault.
    // For now: we call /api/vault-folders which we already have as
    // /api/folder-files but for directories. We need /api/list-dirs.
    //
    // PRAGMATIC: call /api/vault-folders?slug=founder-os → returns folders

    const foldersRes = await fetch(`/api/vault-folders?slug=${encodeURIComponent(vault.slug)}`);
    if (!foldersRes.ok) continue;
    const { folders } = await foldersRes.json() as {
      folders: { name: string; path: string }[];
    };
    if (!folders || folders.length === 0) continue;

    const sectionBlocks: string[] = [];

    for (const folder of folders) {
      const filesRes = await fetch(`/api/folder-files?path=${encodeURIComponent(folder.path)}`);
      if (!filesRes.ok) continue;
      const { files } = await filesRes.json() as { files: { name: string; path: string }[] };
      if (!files || files.length === 0) continue;

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

    if (sectionBlocks.length > 0) {
      vaultBlocks.push(`# ${vault.name}\n\n${sectionBlocks.join('\n\n===\n\n')}`);
    }
  }

  if (vaultBlocks.length === 0) throw new Error('No content found');
  return `# My AI Vault — Complete Export\n\n${vaultBlocks.join('\n\n' + '='.repeat(60) + '\n\n')}`;
}

export default function DownloadAllButton({ vaults }: DownloadAllButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [dlStatus, setDlStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleCopy() {
    setCopyStatus('loading');
    try {
      const text = await buildAllContent(vaults);
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
      const text = await buildAllContent(vaults);
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-vault-export-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
      setDlStatus('done');
      setTimeout(() => setDlStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setDlStatus('error');
      setTimeout(() => setDlStatus('idle'), 3000);
    }
  }

  const copyLabel =
    copyStatus === 'loading' ? 'Copying all...' :
    copyStatus === 'done' ? '\u2713 Copied!' :
    copyStatus === 'error' ? 'Error' :
    '\u2398 Copy all data';

  const dlLabel =
    dlStatus === 'loading' ? 'Exporting...' :
    dlStatus === 'done' ? '\u2713 Downloaded' :
    dlStatus === 'error' ? 'Error' :
    '\u2913 Download all data';

  const btnBase = 'rounded-lg border px-4 py-2 text-xs font-medium transition-colors disabled:opacity-60';
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
