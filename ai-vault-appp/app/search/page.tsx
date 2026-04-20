'use client';
// app/search/page.tsx

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { highlightMatches } from '@/app/lib/highlight';

interface SearchResult {
  name: string;
  path: string;
  html_url: string;
  text_matches?: { fragment: string }[];
}

function pathToAppUrl(path: string): string {
  // path is like: memory/01-identity/about-me.md
  // We need: /memory/personal/folder/01-identity/file/about-me.md
  // slug is derived from folder conventions - use 'personal' as fallback
  const parts = path.split('/');
  if (parts.length >= 3 && parts[0] === 'memory') {
    const folder = parts[1];
    const filename = parts[2];
    // Map folder to memory slug
    const slugMap: Record<string, string> = {
      '01-identity': 'personal',
      '02-projects': 'founder-os',
      '03-policies': 'personal',
      '04-prompts': 'personal',
    };
    const slug = slugMap[folder] ?? 'personal';
    return `/memory/${slug}/folder/${folder}/file/${encodeURIComponent(filename)}`;
  }
  return '#';
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results ?? []);
      setStatus('done');
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(val), 500);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {/* Header */}
      <header>
        <h1 className="text-xl font-semibold tracking-tight">🔍 Search</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Full-text search across all .md files in your vault
        </p>
      </header>

      {/* Search input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search your vault..."
          autoFocus
          className="w-full rounded-2xl border border-[#e7e5e4] bg-white pl-9 pr-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
        />
        {status === 'loading' && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
          </div>
        )}
      </div>

      {/* Results */}
      {status === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === 'done' && results.length === 0 && (
        <div className="rounded-2xl border border-[#e7e5e4] bg-white px-6 py-10 text-center text-neutral-400 text-sm">
          No results found for &ldquo;{query}&rdquo;
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-2xl border border-[#e7e5e4] bg-white overflow-hidden shadow-[0_1px_0_rgba(15,23,42,0.03)]">
          <div className="px-4 py-2 border-b border-neutral-100 text-xs text-neutral-500">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
          <ul>
            {results.map((result, i) => {
              const appUrl = pathToAppUrl(result.path);
              const parts = result.path.split('/');
              const folder = parts[1] ?? '';
              const file = parts[2]?.replace('.md', '') ?? result.name;
              const fragment = result.text_matches?.[0]?.fragment ?? '';

              return (
                <li
                  key={i}
                  className="border-b border-neutral-100 last:border-none px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  <Link href={`${appUrl}?q=${encodeURIComponent(query)}`} className="block">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📄</span>
                      <span className="font-medium text-sm text-neutral-900">{highlightMatches(file, query.trim())}</span>
                      <span className="text-[11px] text-neutral-400">{folder}</span>
                    </div>
                    {fragment && (
                      <p className="text-xs text-neutral-500 pl-6 line-clamp-2">
                        ...{highlightMatches(fragment, query)}...
                      </p>
                    )}
                    <p className="text-[11px] text-neutral-400 pl-6 mt-0.5">{highlightMatches(result.path, query.trim())}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {status === 'idle' && query.length === 0 && (
        <div className="text-center text-neutral-400 text-xs mt-4">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  );
}
