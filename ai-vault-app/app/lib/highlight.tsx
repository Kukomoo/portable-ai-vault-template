export function highlightMatches(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'ig');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === trimmed.toLowerCase();
    return isMatch ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-yellow-200 px-0.5 text-neutral-900"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}