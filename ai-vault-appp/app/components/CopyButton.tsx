'use client';

import { useState } from 'react';

interface CopyButtonProps {
  content: string;
  label?: string;
}

export default function CopyButton({ content, label = 'Copy for AI' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors"
    >
      {copied ? '✓ Copied!' : label}
    </button>
  );
}
