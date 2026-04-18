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

// Minimal ZIP builder — no external dependencies
function buildZip(files: { name: string; content: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const localHeaders: Uint8Array[] = [];
  const centralDirs: Uint8Array[] = [];
  let offset = 0;

  function u16(n: number) {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, n, true);
    return b;
  }
  function u32(n: number) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n, true);
    return b;
  }

  // Simple CRC-32
  function crc32(data: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc & 1) ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  for (const file of files) {
    const nameBytes = enc.encode(file.name);
    const data = enc.encode(file.content);
    const crc = crc32(data);
    const localHeader = concat([
      new Uint8Array([0x50, 0x4b, 0x03, 0x04]), // local file sig
      u16(20), u16(0), u16(0),                  // version, flags, compression
      u16(0), u16(0),                            // mod time, mod date
      u32(crc),                                  // CRC-32
      u32(data.length), u32(data.length),        // compressed, uncompressed size
      u16(nameBytes.length), u16(0),             // filename len, extra len
      nameBytes,
      data,
    ]);
    localHeaders.push(localHeader);

    const central = concat([
      new Uint8Array([0x50, 0x4b, 0x01, 0x02]), // central dir sig
      u16(20), u16(20), u16(0), u16(0),         // version made, needed, flags, compression
      u16(0), u16(0),                            // mod time, date
      u32(crc),
      u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0), u16(0),    // name len, extra, comment
      u16(0), u16(0),                            // disk start, internal attr
      u32(0),                                    // external attr
      u32(offset),                               // local header offset
      nameBytes,
    ]);
    centralDirs.push(central);
    offset += localHeader.length;
  }

  const centralDirOffset = offset;
  const centralDirSize = centralDirs.reduce((s, c) => s + c.length, 0);
  const eocd = concat([
    new Uint8Array([0x50, 0x4b, 0x05, 0x06]), // end of central dir sig
    u16(0), u16(0),                             // disk number, disk with CD start
    u16(files.length), u16(files.length),       // entries on disk, total entries
    u32(centralDirSize),                         // size of central dir
    u32(centralDirOffset),                       // offset of central dir
    u16(0),                                      // comment length
  ]);

  return concat([...localHeaders, ...centralDirs, eocd]);
}

function concat(arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const result = new Uint8Array(total);
  let pos = 0;
  for (const a of arrays) { result.set(a, pos); pos += a.length; }
  return result;
}

export default function FolderCopyButton({ files, folderName }: FolderCopyButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [dlStatus, setDlStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleCopy() {
    setCopyStatus('loading');
    try {
      const fetched = await Promise.all(files.map(fetchFileContent));
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
      const fetched = await Promise.all(files.map(fetchFileContent));
      if (fetched.length === 0) throw new Error('No files');
      if (fetched.length === 1) {
        // Single file — download directly
        const f = fetched[0];
        const blob = new Blob([f.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.name.endsWith('.md') ? f.name : `${f.name}.md`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Multiple files — zip them
        const zipData = buildZip(
          fetched.map((f) => ({ name: f.name.endsWith('.md') ? f.name : `${f.name}.md`, content: f.content }))
        );
        const blob = new Blob([zipData], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${folderName.toLowerCase().replace(/\s+/g, '-')}.zip`;
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
    copyStatus === 'loading' ? 'Copying...' :
    copyStatus === 'done' ? 'Copied!' :
    copyStatus === 'error' ? 'Error' :
    'Copy all';

  const dlLabel =
    dlStatus === 'loading' ? 'Downloading...' :
    dlStatus === 'done' ? 'Downloaded' :
    dlStatus === 'error' ? 'Error' :
    files.length === 1 ? 'Download file' : 'Download .zip';

  const btnBase = 'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60';
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
        {copyStatus === 'done' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        )}
        {copyLabel}
      </button>
      <button
        onClick={handleDownload}
        disabled={dlStatus === 'loading'}
        className={`${btnBase} ${
          dlStatus === 'done' ? green : dlStatus === 'error' ? red : neutral
        }`}
      >
        {dlStatus === 'done' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        )}
        {dlLabel}
      </button>
    </div>
  );
}
