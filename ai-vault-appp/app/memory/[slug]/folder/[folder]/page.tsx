// app/memory/[slug]/folder/[folder]/page.tsx
import Link from 'next/link';
import { listDirectory } from '@/lib/github';
import FolderCopyButton from '@/app/components/FolderCopyButton';
import NewFileButton from '@/app/components/NewFileButton';

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

  const fileList = files.map((f) => ({ name: f.name, path: f.path }));

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
        <div className="flex items-center gap-2">
          <NewFileButton folderPath={folderPath} slug={slug} folder={folder} />
          <FolderCopyButton files={fileList} folderName={friendlyName} />
        </div>
      </header>

      {/* File list */}
      <div className="flex flex-col gap-1">
        {files.length === 0 ? (
          <p className="text-sm text-neutral-400 py-8 text-center">
            No files yet in this folder.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {files.map((file) => (
              <li key={file.path} className="relative">
                {/* Main clickable card */}
                <Link
                  href={`/memory/${slug}/folder/${folder}/file/${encodeURIComponent(file.name)}`}
                  className="flex items-center justify-between rounded-xl border border-[#e7e5e4] bg-white px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">📄</span>
                    <div>
                      <span className="text-sm font-medium text-neutral-800">
                        {file.name.replace('.md', '')}
                      </span>
                      <span className="text-xs text-neutral-400 ml-1">.md</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    {/* Spacer so the absolute GitHub link has room */}
                    <span className="w-16" />
                  </div>
                </Link>
                {/* GitHub link sits on top of the card — no onClick needed */}
                <a
                  href={file.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 transition-colors z-10"
                >
                  GitHub ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
