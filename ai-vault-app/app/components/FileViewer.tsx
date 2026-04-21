'use client';
import { useState } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import CopyButton from '@/app/components/CopyButton';
import FileActionsMenu from '@/app/components/FileActionsMenu';

interface FileViewerProps {
  filePath: string;
  repo: string;
  fileName: string;
  displayTitle: string;
  initialContent: string;
}

export default function FileViewer({ filePath, repo, fileName, displayTitle, initialContent }: FileViewerProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header: breadcrumb + title on left, buttons on right — all on one row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="text-xs text-neutral-400">
            <Link href={`/memory/${repo}`} className="hover:text-neutral-700">
              {repo}
            </Link>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 truncate">
            {displayTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <FileActionsMenu
            filePath={filePath}
            repo={repo}
            initialContent={content}
            fileName={fileName}
            onSave={setContent}
          />
          <CopyButton content={content} fileName={fileName} />
        </div>
      </div>

      {/* Content card */}
      <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
        {content
          ? <MarkdownRenderer content={content} />
          : <p className="text-sm text-neutral-400">No content yet.</p>
        }
      </div>
    </div>
  );
}