'use client';

import { useState } from 'react';
import { BTN_BASE, btnVariant } from '@/app/lib/ui';
import { downloadFilesOrZip } from '@/app/lib/download';
import { IconCheck, IconCopy, IconDownload } from '@/app/components/CopyButton';

interface FolderItem {
  name: string;
  path: string;
}

interface VaultCopyButtonProps {
  folders: FolderItem[];
  vaultName: string;
  repo: string; // ← ADD
}

async function buildVaultContent(
  folders: FolderItem[],
  vaultName: string,
  repo: string // ← ADD
): Promise<string> {
  const sectionBlocks: string[] = [];
  for (const folder of folders) {
    // ← Add repo param to both API calls
    const listRes = await fetch(`/api/folder-files?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(folder.path)}`);
    if (!listRes.ok) continue;
    const { files } = await listRes.json() as { files: { name: string; path: string }[] };
    if (!files || files.length === 0) continue;
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const res = await fetch(`/api/file-content?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(file.path)}`);
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

async function getAllVaultFiles(
  folders: FolderItem[],
  repo: string // ← ADD
): Promise<{ name: string; content: string; folderName: string }[]> {
  const allFiles: { name: string; content: string; folderName: string }[] = [];
  for (const folder of folders) {
    const listRes = await fetch(`/api/folder-files?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(folder.path)}`);
    if (!listRes.ok) continue;
    const { files } = await listRes.json() as { files: { name: string; path: string }[] };
    if (!files || files.length === 0) continue;
    for (const file of files) {
      const res = await fetch(`/api/file-content?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(file.path)}`);
      if (!res.ok) continue;
      const { content } = await res.json();
      allFiles.push({ name: file.name, content: content as string, folderName: folder.name });
    }
  }
  return allFiles;
}



export default function VaultCopyButton({ folders, vaultName, repo }: VaultCopyButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [dlStatus,   setDlStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleCopy() {
    setCopyStatus('loading');
    try {
      const text = await buildVaultContent(folders, vaultName, repo);
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
    const allFiles = await getAllVaultFiles(folders, repo);

    downloadFilesOrZip(
      allFiles.map((f) => ({
        name: `${f.folderName}/${f.name.endsWith('.md') ? f.name : `${f.name}.md`}`,
        content: f.content,
      })),
      `${vaultName.toLowerCase().replace(/\s+/g, '-')}.zip`
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
    copyStatus === 'loading' ? 'Copying...'  :
    copyStatus === 'done'    ? 'Copied!'     :
    copyStatus === 'error'   ? 'Error'       : 'Copy all';

  const dlLabel =
    dlStatus === 'loading' ? 'Downloading...' :
    dlStatus === 'done'    ? 'Downloaded!'    :
    dlStatus === 'error'   ? 'Error'          : 'Download all files';

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