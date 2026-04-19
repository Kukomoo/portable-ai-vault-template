'use client';

import { useState } from 'react';
import { BTN_BASE, BTN_GREEN, BTN_NEUTRAL, BTN_RED } from '@/app/lib/ui';
import { downloadFilesOrZip } from '@/app/lib/download';
import { IconCheck, IconCopy, IconDownload } from '@/app/components/CopyButton';
interface VaultInfo {
  name: string; // display name e.g. "Founder OS"
  slug: string; // URL slug  e.g. "founder-os"
}

interface DownloadAllButtonProps {
  vaults: VaultInfo[];
}

async function buildAllContent(vaults: VaultInfo[]): Promise<string> {
  const vaultBlocks: string[] = [];
  for (const vault of vaults) {
    const foldersRes = await fetch(`/api/vault-folders?slug=${encodeURIComponent(vault.slug)}`);
    if (!foldersRes.ok) continue;
    const { folders } = await foldersRes.json() as { folders: { name: string; path: string }[] };
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

async function getAllFiles(
  vaults: VaultInfo[]
): Promise<{ name: string; content: string; vaultName: string; folderName: string }[]> {
  const allFiles: { name: string; content: string; vaultName: string; folderName: string }[] = [];
  for (const vault of vaults) {
    const foldersRes = await fetch(`/api/vault-folders?slug=${encodeURIComponent(vault.slug)}`);
    if (!foldersRes.ok) continue;
    const { folders } = await foldersRes.json() as { folders: { name: string; path: string }[] };
    if (!folders || folders.length === 0) continue;
    for (const folder of folders) {
      const filesRes = await fetch(`/api/folder-files?path=${encodeURIComponent(folder.path)}`);
      if (!filesRes.ok) continue;
      const { files } = await filesRes.json() as { files: { name: string; path: string }[] };
      if (!files || files.length === 0) continue;
      for (const file of files) {
        const res = await fetch(`/api/file-content?path=${encodeURIComponent(file.path)}`);
        if (!res.ok) continue;
        const { content } = await res.json();
        allFiles.push({ name: file.name, content: content as string, vaultName: vault.name, folderName: folder.name });
      }
    }
  }
  return allFiles;
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

async function handleDownload() {setDlStatus('loading');
  try {
    const allFiles = await getAllFiles(vaults);
    const date = new Date().toISOString().slice(0, 10);

    downloadFilesOrZip(
      allFiles.map((f) => ({
        name: `${f.vaultName}/${f.folderName}/${f.name.endsWith('.md') ? f.name : `${f.name}.md`}`,
        content: f.content,
      })),
      `ai-vault-export-${date}.zip`
    );

    setDlStatus('done');
    setTimeout(() => setDlStatus('idle'), 2500);
  } catch (err) {
    console.error(err);
    setDlStatus('error');
    setTimeout(() => setDlStatus('idle'), 3000);
  }}
  
}
