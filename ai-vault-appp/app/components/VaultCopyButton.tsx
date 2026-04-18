'use client';
import { useState } from 'react';

interface FolderItem {
  name: string;
  path: string;
}

interface VaultCopyButtonProps {
  folders: FolderItem[];
  vaultName: string;
}

async function buildVaultContent(
  folders: FolderItem[],
  vaultName: string
): Promise<string> {
  const sectionBlocks: string[] = [];

  for (const folder of folders) {
    const listRes = await fetch(`/api/folder-files?path=${encodeURIComponent(folder.path)}`);
    if (!listRes.ok) continue;
    const { files } = await listRes.json() as { files: { name: string; path: string }[] };
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

  if (sectionBlocks.length === 0) throw new Error('No content found');
  return `# ${vaultName} — Full Vault Context\n\n${sectionBlocks.join('\n\n===\n\n')}`;
}

export default function VaultCopyButton({ folders, vaultName }: VaultCopyButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [dlStatus, setDlStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleCopy() {
    setCopyStatus('loading');
    try {
      const text = await buildVaultContent(folders, vaultName);
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
      const text = await buildVaultContent(folders, vaultName);
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${vaultName.toLowerCase().replace(/\s+/g, '-')}-vault.md`;
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
    copyStatus === 'loading' ? 'Copying...' :
    copyStatus === 'done' ? '\u2713 Copied!' :
    copyStatus === 'error' ? 'Error' :
    'Copy all for AI';

  const dlLabel =
    dlStatus === 'loading' ? 'Downloading...' :
    dlStatus === 'done' ? '\u2713 Downloaded' :
    dlStatus === 'error' ? 'Error' :
    '\u2913 Download all';

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
