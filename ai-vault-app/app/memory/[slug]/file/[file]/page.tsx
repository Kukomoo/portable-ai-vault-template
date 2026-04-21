import Link from 'next/link';
import { getFileContent } from '@/lib/github';
import FileViewer from '@/app/components/FileViewer';

export default async function FileViewerPage({
  params,
}: {
  params: Promise<{ slug: string; file: string }>;
}) {
  const { slug, file } = await params;
  const decodedFile = decodeURIComponent(file);
  const filePath = decodedFile;

  let content = '';
  try {
    content = await getFileContent(filePath, slug);
  } catch (e) {
    console.error(e);
  }

  const parts = decodedFile.split('/');
  const fileName = parts[parts.length - 1];
  const displayTitle = fileName.replace(/\.md$/i, '');

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <FileViewer
        filePath={filePath}
        repo={slug}
        fileName={fileName}
        displayTitle={displayTitle}
        initialContent={content}
      />
    </div>
  );
}