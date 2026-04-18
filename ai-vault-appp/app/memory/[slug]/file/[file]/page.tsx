// app/memory/[slug]/file/[file]/page.tsx
import Link from 'next/link';
import { getFileContent } from '@/lib/github';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import CopyButton from '@/app/components/CopyButton';

const friendlyFolderNames: Record<string, string> = {
  '01-identity': 'Identity',
  '02-projects': 'Projects',
  '03-policies': 'Policies',
  '04-prompts': 'Prompts',
};

export default async function FileViewerPage({
  params,
}: {
  params: Promise<{ slug: string; file: string }>;
}) {
  const { slug, file } = await params;

  // The file param may be encoded like "01-identity%2Fabout-me.md"
  // or just "about-me.md" — we need to figure out which folder it belongs to
  // Convention: path stored as "folderName/filename.md" encoded in the URL
  const decodedFile = decodeURIComponent(file);

  // decodedFile could be "01-identity/about-me.md" or just "about-me.md"
  // We store full relative path from memory root in the file param
  let filePath: string;
  if (decodedFile.includes('/')) {
    filePath = `memory/${decodedFile}`;
  } else {
    filePath = `memory/${decodedFile}`;
  }

  let content = '';
  let error = '';
  try {
    content = await getFileContent(filePath);
  } catch (e) {
    error = 'Could not load file content.';
    console.error(e);
  }

  // Derive display info
  const parts = decodedFile.split('/');
  const fileName = parts[parts.length - 1];
  const folderName = parts.length > 1 ? (friendlyFolderNames[parts[0]] ?? parts[0]) : '';
  const displayTitle = fileName.replace(/\.md$/i, '');

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Link
              href={`/memory/${slug}`}
              className="hover:text-neutral-700"
            >
              {slug}
            </Link>
            {folderName && (
              <>
                <span>/</span>
                <span>{folderName}</span>
              </>
            )}
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            {displayTitle}
          </h1>
        </div>
        <CopyButton content={content} filename={fileName} />
      </header>
      <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-sm text-neutral-400">No content yet.</p>
        )}
      </div>
    </div>
  );
}
