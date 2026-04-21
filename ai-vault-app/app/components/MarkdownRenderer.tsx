// app/components/MarkdownRenderer.tsx
// Zero-dependency markdown renderer — no react-markdown needed.
// Handles: headings, bold, italic, code blocks, inline code,
// blockquotes, unordered/ordered lists, horizontal rules, links, paragraphs.

interface MarkdownRendererProps {
  content: string;
}

// ---- inline formatter ----
function renderInline(text: string): React.ReactNode[] {
  // Patterns: **bold**, *italic*, `code`, [label](url)
  const parts: React.ReactNode[] = [];
  const re = /(`[^`]+`)|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(<code key={key++} className="bg-neutral-100 text-neutral-800 rounded px-1 py-0.5 text-xs font-mono">{m[1].slice(1, -1)}</code>);
    } else if (m[2]) {
      parts.push(<strong key={key++} className="font-semibold text-neutral-900">{m[2]}</strong>);
    } else if (m[3]) {
      parts.push(<em key={key++} className="italic">{m[3]}</em>);
    } else if (m[4] && m[5]) {
      parts.push(<a key={key++} href={m[5]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{m[4]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : [text];
}

// ---- block parser ----
function parseBlocks(raw: string): React.ReactNode[] {
  const lines = raw.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <pre key={key++} className="bg-neutral-100 rounded-lg p-3 mb-3 overflow-x-auto">
          <code className={`text-xs font-mono text-neutral-800 block${lang ? ' language-' + lang : ''}` }>
            {codeLines.join('\n')}
          </code>
        </pre>
      );
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = hMatch[2];
      const cls = [
        '',
        'text-xl font-bold mt-6 mb-3 text-neutral-900 border-b border-neutral-200 pb-2',
        'text-lg font-semibold mt-5 mb-2 text-neutral-800',
        'text-base font-semibold mt-4 mb-2 text-neutral-800',
        'text-sm font-semibold mt-3 mb-1 text-neutral-700',
        'text-sm font-medium mt-3 mb-1 text-neutral-600',
        'text-xs font-medium mt-2 mb-1 text-neutral-500',
      ][level];
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      nodes.push(<Tag key={key++} className={cls}>{renderInline(text)}</Tag>);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$|^\*\*\*+$|^___+$/.test(line.trim())) {
      nodes.push(<hr key={key++} className="border-neutral-200 my-4" />);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        bqLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote key={key++} className="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 mb-3">
          {parseBlocks(bqLines.join('\n'))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(<li key={i} className="text-neutral-700">{renderInline(lines[i].slice(2))}</li>);
        i++;
      }
      nodes.push(<ul key={key++} className="list-disc list-inside space-y-1 mb-3 text-neutral-700">{items}</ul>);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const text = lines[i].replace(/^\d+\.\s/, '');
        items.push(<li key={i} className="text-neutral-700">{renderInline(text)}</li>);
        i++;
      }
      nodes.push(<ol key={key++} className="list-decimal list-inside space-y-1 mb-3 text-neutral-700">{items}</ol>);
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('```') &&
      !/^---+$|^\*\*\*+$|^___+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      nodes.push(
        <p key={key++} className="text-neutral-700 mb-3 leading-relaxed">
          {renderInline(paraLines.join(' '))}
        </p>
      );
    }
  }

  return nodes;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="text-sm leading-relaxed">
      {parseBlocks(content)}
    </div>
  );
}
