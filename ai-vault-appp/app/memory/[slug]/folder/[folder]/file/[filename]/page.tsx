// app/memory/[slug]/folder/[folder]/file/[filename]/page.tsx
import Link from 'next/link';
import { getFileContent } from '@/lib/github';
import MarkdownEditor from '@/app/components/MarkdownEditor';

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
          <Link
            href={`https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/blob/main/${filePath}`}
            target="_blank"
            className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors"
          >
            View on GitHub ↗
          </Link>
        </div>
      </header>

      {/* Editor / Viewer */}
      <section className="rounded-2xl border border-[#e7e5e4] bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)] overflow-hidden">
        <MarkdownEditor
          initialContent={content}
          filePath={filePath}
          filename={decodedFilename}
        />
      </section>
    </div>
  );
}
