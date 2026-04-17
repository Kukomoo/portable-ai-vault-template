// app/memory/[slug]/folder/[folder]/page.tsx
import Link from 'next/link';
import { listDirectory } from '@/lib/github';

const friendlyFolderNames: Record<string, string> = {
  '01-identity': 'Identity',
  '02-projects': 'Projects',
  '03-policies': 'Policies',
  '04-prompts': 'Prompts',
};

export default async function FolderPage({
  params,
}: {
  params: Promise<{ slug: string; folder: string }>;
}) {
  const { slug, folder } = await params;
  const folderPath = `memory/${folder}`;
  const items = await listDirectory(folderPath);
  const files = items.filter((item) => item.type === 'file' && item.name.endsWith('.md'));

  const friendlyName = friendlyFolderNames[folder] ?? folder;

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
        <span className="text-neutral-800 font-medium">{friendlyName}</span>
      </nav>

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            📁 {friendlyName}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors">
            + New file
          </button>
          <button className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors">
            Copy for AI
          </button>
        </div>
      </header>

      {/* File list */}
      <section>
        <div className="rounded-2xl border border-[#e7e5e4] bg-white text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)] overflow-hidden">
          {files.length === 0 ? (
            <div className="px-6 py-10 text-center text-neutral-400 text-sm">
              No files yet in this folder.
            </div>
          ) : (
            <ul>
              {files.map((file) => (
                <li
                  key={file.path}
                  className="group flex items-center justify-between border-b border-neutral-100 last:border-none px-4 hover:bg-neutral-50 transition-colors"
                >
                  <Link
                    href={`/memory/${slug}/folder/${folder}/file/${encodeURIComponent(file.name)}`}
                    className="flex flex-1 items-center gap-3 py-3 text-neutral-800 hover:text-black"
                  >
                    <span className="text-base">📄</span>
                    <span className="font-medium">{file.name.replace('.md', '')}</span>
                    <span className="text-[11px] text-neutral-400 font-normal">.md</span>
                  </Link>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] text-neutral-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <Link
                      href={file.html_url}
                      target="_blank"
                      className="text-[11px] text-neutral-400 hover:text-black transition-colors"
                    >
                      GitHub ↗
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
