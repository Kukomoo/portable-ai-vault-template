// app/memory/[slug]/folder/[folder]/file/[filename]/page.tsx
import Link from 'next/link';
import { getFileContent } from '@/lib/github';
import CopyButton from '@/app/components/CopyButton';

const friendlyFolderNames: Record<string, string> = {
  '01-identity': 'Identity',
  '02-projects': 'Projects',
  '03-policies': 'Policies',
  '04-prompts': 'Prompts',
};

export default async function FilePage({
  params,
}: {
  params: Promise<{ slug: string; folder: string; filename: string }>;
}) {
  const { slug, folder, filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  const filePath = `memory/${folder}/${decodedFilename}`;
  const content = await getFileContent(filePath);
  const friendlyFolderName = friendlyFolderNames[folder] ?? folder;
  const displayName = decodedFilename.replace('.md', '');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/memory/${slug}`}
          className="hover:text-black transition-colors capitalize"
        >
          {slug.replace('-', ' ')}
        </Link>
        <span>/</span>
        <Link
          href={`/memory/${slug}/folder/${folder}`}
          className="hover:text-black transition-colors"
        >
          {friendlyFolderName}
        </Link>
        <span>/</span>
        <span className="text-neutral-800 font-medium">{displayName}</span>
      </nav>

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            📄 {displayName}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">{decodedFilename}</p>
        </div>
        <div className="flex gap-2">
          <CopyButton content={content} />
        </div>
      </header>

      {/* Content */}
      <section>
        <div className="rounded-2xl border border-[#e7e5e4] bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
            <span className="text-xs text-neutral-500 font-medium">Content</span>
            <span className="text-xs text-neutral-400">.md</span>
          </div>
          <pre className="p-6 text-sm text-neutral-800 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-[70vh]">
            {content}
          </pre>
        </div>
      </section>
    </div>
  );
}
