'use client';
import { useState } from 'react';
import {
  BTN_BASE, BTN_NEUTRAL, BTN_GREEN, BTN_RED,
  IconCheck, IconCopy, IconDownload,
} from '@/app/components/CopyButton';

// The home-page "export everything" button.
// Receives a list of vaults (name + slug), fetches all folders
// in each vault, then all files — copies concatenated or downloads as zip.

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

// Minimal ZIP builder — no external dependencies
function buildZip(files: { name: string; content: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const localHeaders: Uint8Array[] = [];
  const centralDirs: Uint8Array[] = [];
  let offset = 0;
  function u16(n: number) { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, n, true); return b; }
  function u32(n: number) { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, true); return b; }
  function crc32(data: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) { crc ^= data[i]; for (let j = 0; j < 8; j++) { crc = (crc & 1) ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1; } }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function cat(arrays: Uint8Array[]): Uint8Array {
    const total = arrays.reduce((s, a) => s + a.length, 0);
    const r = new Uint8Array(total); let pos = 0;
    for (const a of arrays) { r.set(a, pos); pos += a.length; } return r;
  }
  for (const file of files) {
    const nameBytes = enc.encode(file.name);
    const data = enc.encode(file.content);
    const crc = crc32(data);
    const lh = cat([new Uint8Array([0x50,0x4b,0x03,0x04]),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(nameBytes.length),u16(0),nameBytes,data]);
    localHeaders.push(lh);
    centralDirs.push(cat([new Uint8Array([0x50,0x4b,0x01,0x02]),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(nameBytes.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),nameBytes]));
    offset += lh.length;
  }
  const cdOffset = offset;
  const cdSize = centralDirs.reduce((s,c)=>s+c.length,0);
  const eocd = cat([new Uint8Array([0x50,0x4b,0x05,0x06]),u16(0),u16(0),u16(files.length),u16(files.length),u32(cdSize),u32(cdOffset),u16(0)]);
  return cat([...localHeaders,...centralDirs,eocd]);
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
      const allFiles = await getAllFiles(vaults);
      if (allFiles.length === 0) throw new Error('No files found');
      const date = new Date().toISOString().slice(0, 10);
      if (allFiles.length === 1) {
        const f = allFiles[0];
        const blob = new Blob([f.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.name.endsWith('.md') ? f.name : `${f.name}.md`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const zipData = buildZip(
          allFiles.map((f) => ({
            name: `${f.vaultName}/${f.folderName}/${f.name.endsWith('.md') ? f.name : f.name + '.md'}`,
            content: f.content,
          }))
        );
        const blob = new Blob([zipData], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-vault-export-${date}.zip`;
        a.click();
        URL.revokeObjectURL(url);
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
    copyStatus === 'loading' ? 'Copying all...'  :
    copyStatus === 'done'    ? 'Copied!'          :
    copyStatus === 'error'   ? 'Error'            :
    'Copy all data';
  const dlLabel =
    dlStatus === 'loading' ? 'Zipping...'    :
    dlStatus === 'done'    ? 'Downloaded!'   :
    dlStatus === 'error'   ? 'Error'         :
    'Download .zip';

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        disabled={copyStatus === 'loading'}
        className={`${BTN_BASE} ${
          copyStatus === 'done' ? BTN_GREEN : copyStatus === 'error' ? BTN_RED : BTN_NEUTRAL
        }`}
      >
        {copyStatus === 'done' ? IconCheck : IconCopy}
        {copyLabel}
      </button>
      <button
        onClick={handleDownload}
        disabled={dlStatus === 'loading'}
        className={`${BTN_BASE} ${
          dlStatus === 'done' ? BTN_GREEN : dlStatus === 'error' ? BTN_RED : BTN_NEUTRAL
        }`}
      >
        {dlStatus === 'done' ? IconCheck : IconDownload}
        {dlLabel}
      </button>
    </div>
  );
}
