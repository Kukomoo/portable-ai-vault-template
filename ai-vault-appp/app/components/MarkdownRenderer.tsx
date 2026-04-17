'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral max-w-none text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-6 mb-3 text-neutral-900 border-b border-neutral-200 pb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-5 mb-2 text-neutral-800">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-4 mb-2 text-neutral-800">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-neutral-700 mb-3 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-neutral-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-neutral-700">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-neutral-700">{children}</li>
          ),
          code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode; [key: string]: unknown }) =>
            inline ? (
              <code className="bg-neutral-100 text-neutral-800 rounded px-1 py-0.5 text-xs font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-neutral-100 rounded-lg p-3 text-xs font-mono overflow-x-auto text-neutral-800 mb-3" {...props}>
                {children}
              </code>
            ),
          pre: ({ children }) => (
            <pre className="bg-neutral-100 rounded-lg p-3 mb-3 overflow-x-auto">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 mb-3">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-900">{children}</strong>
          ),
          hr: () => <hr className="border-neutral-200 my-4" />,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-neutral-200 rounded text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-neutral-100 px-3 py-2 text-left font-semibold text-neutral-700 border-b border-neutral-200">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-b border-neutral-100 text-neutral-700">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
