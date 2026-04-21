'use client';

const ICON_SVG_MAP: Record<string, string> = {
  brain: `<circle cx="12" cy="10" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 10c-2.5 0-4 1.5-4 3s1.5 3 4 3M16 10c2.5 0 4 1.5 4 3s-1.5 3-4 3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 16v2a2 2 0 0 0 4 0v-2M12 18a2 2 0 0 0 4 0v-2" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  rocket: `<path d="M12 2s4 3 4 9v1l2 3h-3v2a3 3 0 0 1-6 0v-2H6l2-3v-1c0-6 4-9 4-9z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="11" r="1.5" fill="currentColor"/>`,
  people: `<circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="15" cy="7" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 19c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  briefcase: `<rect x="2" y="8" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.5"/>`,
  books: `<path d="M4 19V6a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1zM9 5h4a1 1 0 0 1 1 1v13H9V5zM14 7h4a1 1 0 0 1 1 1v11h-5V7z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  target: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>`,
  bulb: `<path d="M9 21h6M12 3a6 6 0 0 1 4 10.5V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-3.5A6 6 0 0 1 12 3z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  microscope: `<circle cx="12" cy="10" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6 21h12M9 21v-4M15 21v-4M8 17h8M12 3v3" stroke="currentColor" stroke-width="1.5"/>`,
  globe: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 3c0 0-4 3-4 9s4 9 4 9 4-3 4-9-4-9-4-9z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 12h18" stroke="currentColor" stroke-width="1.5"/>`,
  robot: `<rect x="5" y="8" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M9 16h6M12 8V5M9 5h6M3 12h2M19 12h2" stroke="currentColor" stroke-width="1.5"/>`,
  tools: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a6 6 0 0 1-7.5 7.5l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.5-7.5z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  memo: `<rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.5"/>`,
  palette: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="9.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="14.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/>`,
  fire: `<path d="M12 2c0 0 2 4 0 7 2-1 4 0 4 3a4 4 0 0 1-8 0c0-2 1-3.5 2-4-1 3 2 4 2 4V2z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  lightning: `<path d="M13 2L4 14h7l-1 8 9-12h-7z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  sprout: `<path d="M12 22V12M12 12C12 7 8 4 3 4c0 5 3 8 9 8zM12 12c0-5 4-8 9-8 0 5-3 8-9 8z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  trophy: `<path d="M7 3h10v7a5 5 0 0 1-10 0V3zM7 7H4a2 2 0 0 0 0 4h3M17 7h3a2 2 0 0 0 0 4h-3M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  crystal: `<path d="M12 2l4 6H8l4-6zM8 8l-5 9h18L16 8H8zM7 17l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  chart: `<path d="M3 3v18h18" stroke="currentColor" stroke-width="1.5"/><path d="M7 16l4-6 4 3 4-7" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  lion: `<circle cx="12" cy="13" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M10 12h.5M13.5 12h.5M10 14.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" stroke="currentColor" stroke-width="1.5"/><path d="M9 10c-1-2-3-3-4-2s0 3 2 4M15 10c1-2 3-3 4-2s0 3-2 4" stroke="currentColor" stroke-width="1.5"/>`,
  wave: `<path d="M2 10c2-4 4-4 6 0s4 4 6 0 4-4 6 0M2 16c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  guitar: `<path d="M9 3l-1 3M15 3l1 3M8 6c0 2 1 3 2 4l-5 7a2 2 0 0 0 3 3l7-5c1 1 2 2 4 2a4 4 0 0 0 0-8c-2 0-3 1-4 2" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  clover: `<path d="M12 12c0-2-2-4-4-4s-4 2-4 4 2 2 4 2M12 12c0-2 2-4 4-4s4 2 4 4-2 2-4 2M12 12c-2 0-4 2-4 4s2 4 4 4 4-2 4-4M12 12c2 0 4-2 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  sparkle: `<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" stroke-width="1.5"/>`,
  puzzle: `<path d="M20 7h-1a2 2 0 0 1 0-4h1V2h-4v1a2 2 0 0 1-4 0V2H8v4h1a2 2 0 0 1 0 4H8v4h1a2 2 0 0 1 0 4H8v2h4v-1a2 2 0 0 1 4 0v1h4v-3h-1a2 2 0 0 1 0-4h1V7z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  box: `<path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5M21 8l-9 5M12 13v9" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  barChart: `<path d="M3 3v18h18" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="10" width="3" height="8" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="11" y="6" width="3" height="12" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="16" y="13" width="3" height="5" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  key: `<circle cx="8" cy="12" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 12h8M18 12v3M15 12v2" stroke="currentColor" stroke-width="1.5"/>`,
};

function isEmojiOrText(value: string): boolean {
  return !/^[a-zA-Z0-9_-]+$/.test(value);
}

interface MemoryIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export default function MemoryIcon({ icon, size = 20, className = '' }: MemoryIconProps) {
  if (!icon || icon === '📊') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: ICON_SVG_MAP['barChart'] }}
      />
    );
  }

  if (isEmojiOrText(icon)) {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{ fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
      >
        {icon}
      </span>
    );
  }

  const svgContent = ICON_SVG_MAP[icon];
  if (svgContent) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  return (
    <span className={className} style={{ fontSize: size * 0.7 }}>
      {icon}
    </span>
  );
}