// app/lib/download.ts
import { buildZip } from '@/app/lib/zip';

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export function downloadText(content: string, filename: string): void {
  downloadBlob(new Blob([content], { type: 'text/markdown' }), filename);
}

export function downloadZip(
  files: { name: string; content: string }[],
  zipName: string
): void {
  downloadBlob(
    new Blob([buildZip(files)], { type: 'application/zip' }),
    zipName
  );
}

/** Handles the single-file-vs-zip decision automatically */
export function downloadFilesOrZip(
  files: { name: string; content: string }[],
  zipName: string
): void {
  if (files.length === 0) {
    throw new Error('No files to download');
  }

  if (files.length === 1) {
    const file = files[0];
    downloadText(
      file.content,
      file.name.endsWith('.md') ? file.name : `${file.name}.md`
    );
    return;
  }

  downloadZip(files, zipName);
}