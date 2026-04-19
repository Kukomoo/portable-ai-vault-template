'use client';
// app/components/NewMemoryButton.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type SvgIcon = { id: string; label: string; svg: string };

const PAGE_CATEGORIES = [
  'Knowledge & Work',
  'Tech, Learning & Productivity',
  'Life, Goals & Creative',
];

// Color palette from your UI
// teal: #01696f | amber: #d19900 | red: #c0392b | blue: #006494 | green: #437a22 | purple: #7a39bb

const ICON_PAGES: SvgIcon[][] = [
  // ── Page 1: Knowledge & Work ─────────────────────────────────────────────
  [
    { id: 'brain', label: 'Brain', svg: `<circle cx="12" cy="11" r="5" fill="#e6f0f0" stroke="#01696f"/><path d="M7 11c-2 0-3.5 1-3.5 2.5S5 16 7 16M17 11c2 0 3.5 1 3.5 2.5S19 16 17 16" stroke="#01696f"/><path d="M9 16.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5M12 16v2.5" stroke="#01696f"/><path d="M9 6c-1-1.5-3-2-4-1" stroke="currentColor"/>` },
    { id: 'rocket', label: 'Rocket', svg: `<path d="M12 2c0 0 4 3 4 9v1l2 3h-3v2a3 3 0 0 1-6 0v-2H6l2-3v-1c0-6 4-9 4-9z" fill="#fef3c7" stroke="#d19900"/><circle cx="12" cy="11" r="1.5" fill="#d19900"/>` },
    { id: 'people', label: 'Team', svg: `<circle cx="9" cy="7" r="3" fill="#e6f0f0" stroke="#01696f"/><circle cx="15" cy="7" r="3" fill="#e6f0f0" stroke="#01696f"/><path d="M3 19c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6" stroke="currentColor"/>` },
    { id: 'briefcase', label: 'Work', svg: `<rect x="2" y="8" width="20" height="13" rx="2" fill="#fef9ee" stroke="#d19900"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 13v4M10 15h4" stroke="#d19900"/>` },
    { id: 'books', label: 'Books', svg: `<path d="M4 19V6a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1z" fill="#e6f0f0" stroke="#01696f"/><path d="M9 5h4a1 1 0 0 1 1 1v13H9V5z" fill="#fef3c7" stroke="#d19900"/><path d="M14 7h4a1 1 0 0 1 1 1v11h-5V7z" fill="#fde8e8" stroke="#c0392b"/>` },
    { id: 'target', label: 'Goals', svg: `<circle cx="12" cy="12" r="9" fill="#fde8e8" stroke="#c0392b"/><circle cx="12" cy="12" r="5" fill="#fff" stroke="#c0392b"/><circle cx="12" cy="12" r="1.5" fill="#c0392b"/>` },
    { id: 'bulb', label: 'Idea', svg: `<path d="M9 21h6M12 3a6 6 0 0 1 4 10.5V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-3.5A6 6 0 0 1 12 3z" fill="#fef3c7" stroke="#d19900"/><path d="M10 17v-2.5a3 3 0 0 1 4 0V17" stroke="#d19900"/>` },
    { id: 'microscope', label: 'Research', svg: `<path d="M6 21h12M9 21v-4M15 21v-4M8 17h8" stroke="currentColor"/><circle cx="12" cy="10" r="4" fill="#e6f0f0" stroke="#01696f"/><path d="M12 3v3M10 4l4 2" stroke="#01696f"/>` },
    { id: 'globe', label: 'World', svg: `<circle cx="12" cy="12" r="9" fill="#e8f4fd" stroke="#006494"/><path d="M12 3c0 0-4 3-4 9s4 9 4 9 4-3 4-9-4-9-4-9z" stroke="#006494" fill="none"/><path d="M3 12h18" stroke="#006494"/>` },
    { id: 'build', label: 'Build', svg: `<rect x="3" y="13" width="8" height="8" rx="1" fill="#fef3c7" stroke="#d19900"/><rect x="13" y="3" width="8" height="8" rx="1" fill="#e6f0f0" stroke="#01696f"/><path d="M11 13L13 11" stroke="currentColor"/>` },
    { id: 'robot', label: 'AI', svg: `<rect x="5" y="8" width="14" height="11" rx="2" fill="#e6f0f0" stroke="#01696f"/><circle cx="9" cy="12" r="1.5" fill="#01696f"/><circle cx="15" cy="12" r="1.5" fill="#01696f"/><path d="M9 16h6" stroke="#01696f"/><path d="M12 8V5M9 5h6M3 12h2M19 12h2" stroke="currentColor"/>` },
    { id: 'tools', label: 'Tools', svg: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a6 6 0 0 1-7.5 7.5l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.5-7.5z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'memo', label: 'Notes', svg: `<rect x="4" y="3" width="16" height="18" rx="2" fill="#fafaf9" stroke="currentColor"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#01696f"/>` },
    { id: 'palette', label: 'Design', svg: `<circle cx="12" cy="12" r="9" fill="#fde8e8" stroke="#c0392b"/><circle cx="8.5" cy="9.5" r="1.5" fill="#c0392b"/><circle cx="15.5" cy="9.5" r="1.5" fill="#d19900"/><circle cx="8.5" cy="14.5" r="1.5" fill="#006494"/><circle cx="15.5" cy="14.5" r="1.5" fill="#437a22"/>` },
    { id: 'fire', label: 'Passion', svg: `<path d="M12 2c0 0 2 4 0 7 2-1 4 0 4 3a4 4 0 0 1-8 0c0-2 1-3.5 2-4-1 3 2 4 2 4V2z" fill="#fde8e8" stroke="#c0392b"/>` },
    { id: 'lightning', label: 'Energy', svg: `<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'sprout', label: 'Growth', svg: `<path d="M12 22V12M12 12C12 7 8 4 3 4c0 5 3 8 9 8z" fill="#e8f5e0" stroke="#437a22"/><path d="M12 12c0-5 4-8 9-8 0 5-3 8-9 8z" fill="#d4edcc" stroke="#437a22"/>` },
    { id: 'trophy', label: 'Trophy', svg: `<path d="M7 3h10v7a5 5 0 0 1-10 0V3z" fill="#fef3c7" stroke="#d19900"/><path d="M7 7H4a2 2 0 0 0 0 4h3M17 7h3a2 2 0 0 0 0 4h-3M8 21h8M12 17v4" stroke="#d19900"/>` },
    { id: 'crystal', label: 'Vision', svg: `<path d="M12 2l4 6H8l4-6z" fill="#ede9fe" stroke="#7a39bb"/><path d="M8 8l-5 9h18L16 8H8z" fill="#f5f3ff" stroke="#7a39bb"/><path d="M7 17l5 5 5-5" stroke="#7a39bb" fill="none"/>` },
    { id: 'chart', label: 'Analytics', svg: `<path d="M3 3v18h18" stroke="currentColor"/><path d="M7 16l4-6 4 3 4-7" stroke="#01696f" fill="none"/><circle cx="7" cy="16" r="1.5" fill="#01696f"/><circle cx="11" cy="10" r="1.5" fill="#d19900"/><circle cx="15" cy="13" r="1.5" fill="#006494"/><circle cx="19" cy="6" r="1.5" fill="#c0392b"/>` },
    { id: 'lion', label: 'Courage', svg: `<circle cx="12" cy="13" r="5" fill="#fef3c7" stroke="#d19900"/><path d="M9.5 13.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5M10 12h.5M13.5 12h.5" stroke="#d19900"/><path d="M9 10c-1-2-3-3-4-2s0 3 2 4M15 10c1-2 3-3 4-2s0 3-2 4" stroke="currentColor"/>` },
    { id: 'wave', label: 'Flow', svg: `<path d="M2 10c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="#006494" fill="none"/><path d="M2 16c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="#01696f" fill="none" opacity="0.5"/>` },
    { id: 'puzzle', label: 'Problem', svg: `<path d="M14 3h2a2 2 0 0 1 2 2v2a1 1 0 0 0 1 1 2 2 0 0 1 0 4 1 1 0 0 0-1 1v2a2 2 0 0 1-2 2h-2a1 1 0 0 1-1-1 2 2 0 0 0-4 0 1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1 2 2 0 0 0 0-4 1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h2a1 1 0 0 0 1-1 2 2 0 0 1 4 0 1 1 0 0 0 1 1z" fill="#e6f0f0" stroke="#01696f"/>` },
    { id: 'folder', label: 'Archive', svg: `<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'graph', label: 'Stats', svg: `<rect x="3" y="14" width="4" height="7" rx="1" fill="#fde8e8" stroke="#c0392b"/><rect x="10" y="9" width="4" height="12" rx="1" fill="#fef3c7" stroke="#d19900"/><rect x="17" y="4" width="4" height="17" rx="1" fill="#e6f0f0" stroke="#01696f"/>` },
    { id: 'key', label: 'Access', svg: `<circle cx="8" cy="13" r="5" fill="#fef3c7" stroke="#d19900"/><circle cx="8" cy="13" r="2" fill="#d19900"/><path d="M13 13h7M17 11v4" stroke="currentColor"/>` },
    { id: 'compass', label: 'Direction', svg: `<circle cx="12" cy="12" r="9" fill="#e8f4fd" stroke="#006494"/><path d="M16 8l-3 4.5L9 16l3-4.5L16 8z" fill="#006494"/><circle cx="12" cy="12" r="1.5" fill="#fff"/>` },
    { id: 'diamond', label: 'Value', svg: `<path d="M6 3h12l4 6-10 12L2 9z" fill="#ede9fe" stroke="#7a39bb"/><path d="M2 9h20M6 3l4 6M18 3l-4 6" stroke="#7a39bb" fill="none"/>` },
    { id: 'map', label: 'Plan', svg: `<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" fill="#e8f5e0" stroke="#437a22"/><path d="M9 3v15M15 6v15" stroke="#437a22"/>` },
    { id: 'stamp', label: 'Publish', svg: `<rect x="4" y="13" width="16" height="3" rx="1" fill="#e6f0f0" stroke="#01696f"/><rect x="7" y="5" width="10" height="8" rx="2" fill="#fafaf9" stroke="currentColor"/><path d="M6 19h12v2H6z" fill="#01696f" stroke="#01696f"/>` },
    { id: 'map2', label: 'Navigate', svg: `<circle cx="12" cy="10" r="4" fill="#fde8e8" stroke="#c0392b"/><circle cx="12" cy="10" r="1.5" fill="#c0392b"/><path d="M12 14c0 0-6 5-6 9h12c0-4-6-9-6-9z" fill="#fde8e8" stroke="#c0392b"/>` },
  ],
  // ── Page 2: Tech, Learning & Productivity ────────────────────────────────
  [
    { id: 'laptop', label: 'Laptop', svg: `<rect x="2" y="4" width="20" height="13" rx="2" fill="#e6f0f0" stroke="#01696f"/><rect x="5" y="7" width="14" height="7" rx="1" fill="#fff" stroke="#01696f"/><path d="M1 20h22M8 17h8" stroke="currentColor"/>` },
    { id: 'phone', label: 'Mobile', svg: `<rect x="6" y="2" width="12" height="20" rx="3" fill="#e8f4fd" stroke="#006494"/><circle cx="12" cy="17" r="1" fill="#006494"/><path d="M10 6h4" stroke="#006494"/>` },
    { id: 'monitor', label: 'Screen', svg: `<rect x="2" y="3" width="20" height="14" rx="2" fill="#e6f0f0" stroke="#01696f"/><rect x="5" y="6" width="14" height="8" rx="1" fill="#fff" stroke="#01696f"/><path d="M8 21h8M12 17v4" stroke="currentColor"/>` },
    { id: 'chip', label: 'Chip', svg: `<rect x="7" y="7" width="10" height="10" rx="1" fill="#e6f0f0" stroke="#01696f"/><rect x="9" y="9" width="6" height="6" rx="0.5" fill="#01696f"/><path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" stroke="#01696f"/>` },
    { id: 'wifi', label: 'Network', svg: `<path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="#006494" fill="none"/><path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="#006494" opacity="0.4" fill="none"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="#006494" fill="none"/><circle cx="12" cy="20" r="1" fill="#006494"/>` },
    { id: 'satellite', label: 'Signal', svg: `<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l6-6-3-3z" fill="#fef3c7" stroke="#d19900"/><path d="M11 15c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM22 2L11 13" stroke="currentColor" fill="none"/>` },
    { id: 'dna', label: 'Science', svg: `<path d="M5 3c0 0 2 4 7 6s7 9 7 9" stroke="#01696f" fill="none"/><path d="M19 3c0 0-2 4-7 6S5 18 5 18" stroke="#d19900" fill="none"/><path d="M6 6h12M6 18h12" stroke="currentColor"/>` },
    { id: 'flask', label: 'Experiment', svg: `<path d="M9 3h6M9 3v7l-5 9a1 1 0 0 0 .9 1.5h14.2a1 1 0 0 0 .9-1.5L15 10V3" fill="#e6f0f0" stroke="#01696f"/><circle cx="9" cy="17" r="1" fill="#01696f"/><circle cx="13" cy="15" r="0.8" fill="#d19900"/>` },
    { id: 'ruler', label: 'Precision', svg: `<rect x="2" y="10" width="20" height="6" rx="1" fill="#fef3c7" stroke="#d19900" transform="rotate(-45 12 12)"/><path d="M8.5 14.5v-2M11.5 17.5v-2M14.5 11.5v-2" stroke="#d19900"/>` },
    { id: 'calendar', label: 'Schedule', svg: `<rect x="3" y="4" width="18" height="18" rx="2" fill="#fafaf9" stroke="currentColor"/><path d="M3 10h18" stroke="#c0392b"/><rect x="7" y="13" width="2" height="2" rx="0.5" fill="#c0392b"/><rect x="11" y="13" width="2" height="2" rx="0.5" fill="#d19900"/><rect x="15" y="13" width="2" height="2" rx="0.5" fill="#01696f"/><path d="M8 2v4M16 2v4" stroke="currentColor"/>` },
    { id: 'pin', label: 'Focus', svg: `<path d="M12 2a4 4 0 0 1 4 4c0 3-4 8-4 8S8 9 8 6a4 4 0 0 1 4-4z" fill="#fde8e8" stroke="#c0392b"/><circle cx="12" cy="6" r="1.5" fill="#c0392b"/><path d="M12 14v8" stroke="currentColor"/>` },
    { id: 'link', label: 'Connect', svg: `<path d="M10 14a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" stroke="#006494" fill="none"/><path d="M14 10a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" stroke="#01696f" fill="none"/>` },
    { id: 'chat', label: 'Comms', svg: `<path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6l-4 4V6a2 2 0 0 1 2-2z" fill="#e6f0f0" stroke="#01696f"/><path d="M8 10h8M8 14h5" stroke="#01696f"/>` },
    { id: 'inbox', label: 'Inbox', svg: `<path d="M3 12h4l3 5h4l3-5h4" stroke="#006494" fill="none"/><path d="M3 12V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" fill="#e8f4fd" stroke="#006494"/>` },
    { id: 'ballot', label: 'Survey', svg: `<rect x="3" y="3" width="18" height="18" rx="2" fill="#fafaf9" stroke="currentColor"/><path d="M8 9l2 2 4-4" stroke="#437a22" fill="none"/><path d="M8 14h8M8 18h4" stroke="currentColor"/>` },
    { id: 'gear', label: 'Settings', svg: `<circle cx="12" cy="12" r="3" fill="#e6f0f0" stroke="#01696f"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="#01696f"/>` },
    { id: 'wrench', label: 'Debug', svg: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a6 6 0 0 1-7.5 7.5l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.5-7.5z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'disk', label: 'Storage', svg: `<ellipse cx="12" cy="8" rx="8" ry="3" fill="#e6f0f0" stroke="#01696f"/><path d="M4 8v8c0 1.66 3.58 3 8 3s8-1.34 8-3V8" fill="#e6f0f0" stroke="#01696f"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="#01696f" fill="none"/>` },
    { id: 'camera', label: 'Capture', svg: `<rect x="2" y="7" width="20" height="14" rx="2" fill="#fafaf9" stroke="currentColor"/><circle cx="12" cy="14" r="4" fill="#e6f0f0" stroke="#01696f"/><circle cx="12" cy="14" r="1.5" fill="#01696f"/><path d="M8 7l1.5-3h5L16 7" stroke="currentColor"/>` },
    { id: 'mic', label: 'Voice', svg: `<rect x="9" y="2" width="6" height="11" rx="3" fill="#e6f0f0" stroke="#01696f"/><path d="M5 10a7 7 0 0 0 14 0M12 21v-4M8 21h8" stroke="#01696f" fill="none"/>` },
    { id: 'headphones', label: 'Listen', svg: `<path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="#7a39bb" fill="none"/><rect x="3" y="15" width="4" height="5" rx="2" fill="#ede9fe" stroke="#7a39bb"/><rect x="17" y="15" width="4" height="5" rx="2" fill="#ede9fe" stroke="#7a39bb"/>` },
    { id: 'pen', label: 'Write', svg: `<path d="M12 20h9" stroke="currentColor"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'lock', label: 'Private', svg: `<rect x="5" y="11" width="14" height="10" rx="2" fill="#fde8e8" stroke="#c0392b"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#c0392b" fill="none"/><circle cx="12" cy="16" r="1.5" fill="#c0392b"/>` },
    { id: 'cloud', label: 'Cloud', svg: `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#e8f4fd" stroke="#006494"/>` },
    { id: 'terminal', label: 'Code', svg: `<rect x="2" y="3" width="20" height="18" rx="2" fill="#1c1917"/><polyline points="6 9 10 13 6 17" stroke="#01696f" fill="none"/><line x1="12" y1="17" x2="18" y2="17" stroke="#d19900"/>` },
    { id: 'branch', label: 'Version', svg: `<circle cx="6" cy="6" r="2" fill="#e6f0f0" stroke="#01696f"/><circle cx="18" cy="6" r="2" fill="#fef3c7" stroke="#d19900"/><circle cx="6" cy="18" r="2" fill="#fde8e8" stroke="#c0392b"/><path d="M6 8v8M8 6h7a3 3 0 0 1 3 3v1" stroke="currentColor" fill="none"/>` },
    { id: 'api', label: 'API', svg: `<rect x="3" y="6" width="18" height="12" rx="2" fill="#e6f0f0" stroke="#01696f"/><path d="M9 9l-2 3 2 3M15 9l2 3-2 3M11 9l2 6" stroke="#01696f" fill="none"/>` },
    { id: 'db', label: 'Database', svg: `<ellipse cx="12" cy="5" rx="8" ry="3" fill="#fef3c7" stroke="#d19900"/><path d="M4 5v5c0 1.66 3.58 3 8 3s8-1.34 8-3V5" fill="#fef9ee" stroke="#d19900"/><path d="M4 10v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5" fill="#fef9ee" stroke="#d19900"/>` },
    { id: 'deploy', label: 'Deploy', svg: `<path d="M12 2L2 19h20L12 2z" fill="#e6f0f0" stroke="#01696f"/><path d="M12 9v5M12 16v1" stroke="#01696f"/>` },
    { id: 'search', label: 'Search', svg: `<circle cx="10" cy="10" r="7" fill="#fef3c7" stroke="#d19900"/><path d="M15 15l5 5" stroke="currentColor"/>` },
  ],
  // ── Page 3: Life, Goals & Creative ──────────────────────────────────────
  [
    { id: 'grad', label: 'Graduate', svg: `<path d="M12 2L2 8l10 6 10-6-10-6z" fill="#fef3c7" stroke="#d19900"/><path d="M6 11v5c0 2 2.7 4 6 4s6-2 6-4v-5" fill="#fef9ee" stroke="#d19900"/><path d="M20 8v6" stroke="currentColor"/>` },
    { id: 'home2', label: 'Home', svg: `<path d="M3 12L12 3l9 9" stroke="currentColor" fill="none"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V10" fill="#e6f0f0" stroke="#01696f"/>` },
    { id: 'handshake', label: 'Partner', svg: `<path d="M4 14l4-4 3 3 5-5 4 4" stroke="#01696f" fill="none"/><path d="M3 9h3l2-2h8l2 2h3" fill="#e6f0f0" stroke="#01696f"/>` },
    { id: 'muscle', label: 'Strength', svg: `<path d="M6 4c-2 2-2 5-2 5l2-2 1 3-1 3 2 2s2-2 2-5-2-4-4-6z" fill="#fde8e8" stroke="#c0392b"/><path d="M18 4c2 2 2 5 2 5l-2-2-1 3 1 3-2 2s-2-2-2-5 2-4 4-6z" fill="#fde8e8" stroke="#c0392b"/><rect x="8" y="8" width="8" height="8" rx="2" fill="#fde8e8" stroke="#c0392b"/>` },
    { id: 'meditate', label: 'Mindful', svg: `<circle cx="12" cy="5" r="2" fill="#e6f0f0" stroke="#01696f"/><path d="M7 13c0-3 2.2-5 5-5s5 2 5 5" stroke="#01696f" fill="none"/><path d="M5 17c0 0 2-1 7-1s7 1 7 1M7 13l-2 4M17 13l2 4" stroke="currentColor" fill="none"/>` },
    { id: 'plane', label: 'Travel', svg: `<path d="M22 16.5L14 3 3 12l3 1.5 2-1.5 3 6 4-4 1 4 3-3-2.5-6.5L22 16.5z" fill="#e8f4fd" stroke="#006494"/>` },
    { id: 'moon', label: 'Night', svg: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#ede9fe" stroke="#7a39bb"/>` },
    { id: 'sun', label: 'Morning', svg: `<circle cx="12" cy="12" r="4" fill="#fef3c7" stroke="#d19900"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#d19900"/>` },
    { id: 'leaf', label: 'Nature', svg: `<path d="M12 22V11M12 11C12 6 17 2 22 2c0 5-4 9-10 9z" fill="#e8f5e0" stroke="#437a22"/><path d="M12 11c0-5-5-9-10-9 0 5 4 9 10 9z" fill="#d4edcc" stroke="#437a22"/>` },
    { id: 'clapper', label: 'Film', svg: `<rect x="2" y="8" width="20" height="13" rx="2" fill="#1c1917"/><path d="M2 12h20" stroke="#d19900"/><path d="M7 8V4M12 8V4M17 8V4" stroke="currentColor"/><rect x="5" y="4" width="3" height="4" fill="#c0392b" stroke="none"/>` },
    { id: 'music', label: 'Music', svg: `<path d="M9 18V5l12-2v13" stroke="#7a39bb" fill="none"/><circle cx="6" cy="18" r="3" fill="#ede9fe" stroke="#7a39bb"/><circle cx="18" cy="16" r="3" fill="#ede9fe" stroke="#7a39bb"/>` },
    { id: 'brush', label: 'Art', svg: `<path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 0 0-3-3z" fill="#fde8e8" stroke="#c0392b"/><path d="M9 8c-2 3-1.5 6.5 0 8s6 2 8 0" stroke="#c0392b" fill="none"/>` },
    { id: 'pencil2', label: 'Journal', svg: `<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'notebook', label: 'Diary', svg: `<rect x="4" y="2" width="14" height="20" rx="2" fill="#fafaf9" stroke="currentColor"/><path d="M4 8h14M4 13h14M4 18h8" stroke="#01696f"/><rect x="2" y="4" width="2" height="3" rx="0.5" fill="#c0392b"/><rect x="2" y="10" width="2" height="3" rx="0.5" fill="#d19900"/><rect x="2" y="16" width="2" height="3" rx="0.5" fill="#437a22"/>` },
    { id: 'thought', label: 'Reflect', svg: `<path d="M12 21a9 9 0 1 0-9-9" stroke="#7a39bb" fill="#f5f3ff"/><circle cx="7" cy="16" r="1.5" fill="#7a39bb"/><circle cx="5" cy="19" r="1" fill="#7a39bb"/><circle cx="3" cy="21.5" r=".8" fill="#7a39bb"/>` },
    { id: 'star', label: 'Inspire', svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'chess', label: 'Strategy', svg: `<path d="M11 5h2M12 5v6M8 21h8M9 17h6M9 17l-1-6h8l-1 6" fill="#e8f4fd" stroke="#006494"/>` },
    { id: 'medal', label: 'Award', svg: `<circle cx="12" cy="14" r="6" fill="#fef3c7" stroke="#d19900"/><circle cx="12" cy="14" r="3" fill="#d19900"/><path d="M9 2l1.5 4h3L15 2M9 2H7l2 4M15 2h2l-2 4" stroke="currentColor" fill="none"/>` },
    { id: 'hourglass', label: 'Time', svg: `<path d="M5 2h14M5 22h14" stroke="currentColor"/><path d="M6 2l6 10-6 10" fill="#fef3c7" stroke="#d19900"/><path d="M18 2l-6 10 6 10" fill="#e6f0f0" stroke="#01696f"/>` },
    { id: 'seedling', label: 'Begin', svg: `<path d="M12 22V13M12 13c0-5 4-9 9-9 0 5-4 9-9 9z" fill="#e8f5e0" stroke="#437a22"/><path d="M12 13C10 9 6 6 3 7c1 4 5 7 9 6z" fill="#d4edcc" stroke="#437a22"/>` },
    { id: 'flag', label: 'Milestone', svg: `<path d="M4 22V4" stroke="currentColor"/><path d="M4 4l14 4-14 6V4z" fill="#fde8e8" stroke="#c0392b"/>` },
    { id: 'infinity', label: 'Continuous', svg: `<path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" fill="#e6f0f0" stroke="#01696f"/><path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'heartbeat', label: 'Vitals', svg: `<path d="M2 12h4l2-6 4 12 2-8 2 4h6" stroke="#c0392b" fill="none"/>` },
    { id: 'gift', label: 'Share', svg: `<rect x="3" y="9" width="18" height="13" rx="2" fill="#fde8e8" stroke="#c0392b"/><path d="M3 13h18M12 9V22" stroke="#c0392b" fill="none"/><path d="M12 9c0-2 1.5-5 3-5a2 2 0 0 1 0 4l-3 1zM12 9c0-2-1.5-5-3-5a2 2 0 0 0 0 4l3 1z" fill="#fde8e8" stroke="#c0392b"/>` },
    { id: 'crown', label: 'Lead', svg: `<path d="M3 17L5 7l5 4 4-8 4 8 5-4 2 10H3z" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'orbit', label: 'Explore', svg: `<circle cx="12" cy="12" r="3" fill="#e8f4fd" stroke="#006494"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(45 12 12)" stroke="#006494" fill="none"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-45 12 12)" stroke="#7a39bb" fill="none" opacity="0.6"/>` },
    { id: 'anchor', label: 'Stable', svg: `<circle cx="12" cy="6" r="3" fill="#e8f4fd" stroke="#006494"/><path d="M12 9v14M5 16c0 2 3.13 4 7 4s7-2 7-4M5 16l7-4 7 4" stroke="#006494" fill="none"/>` },
    { id: 'feather', label: 'Light', svg: `<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" fill="#ede9fe" stroke="#7a39bb"/><line x1="16" y1="8" x2="2" y2="22" stroke="#7a39bb"/><line x1="17.5" y1="15" x2="9" y2="15" stroke="#7a39bb"/>` },
    { id: 'sparkle', label: 'Magic', svg: `<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#d19900"/><circle cx="12" cy="12" r="3" fill="#fef3c7" stroke="#d19900"/>` },
    { id: 'lantern', label: 'Illuminate', svg: `<path d="M8 4h8l2 14H6L8 4z" fill="#fef3c7" stroke="#d19900"/><path d="M9 2h6M10 2v2M14 2v2M9 10h6M8 14h8" stroke="#d19900"/>` },
  ],
];

function SvgIcon({ svg, size = 18 }: { svg: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

interface NewMemoryButtonProps {
  variant?: 'home' | 'sidebar';
  onCreated?: () => void;
}

export default function NewMemoryButton({ variant = 'home', onCreated }: NewMemoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<SvgIcon>(ICON_PAGES[0][0]);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  function toSlug(val: string) {
    return val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleCreate() {
    const slug = toSlug(name);
    if (!slug) return;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/memory-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: name.trim(), icon: selectedIcon.id, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create memory');
      }
      setOpen(false);
      setName('');
      setDescription('');
      setSelectedIcon(ICON_PAGES[0][0]);
      setPage(0);
      setStatus('idle');
      onCreated?.();
      router.push(`/memory/${slug}`);
      router.refresh();
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }

  const slug = toSlug(name);
  const totalPages = ICON_PAGES.length;

  const triggerButton =
    variant === 'sidebar' ? (
      <button
        onClick={() => setOpen(true)}
        className="mb-4 w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-left text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
      >
        + New AI Memory
      </button>
    ) : (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm"
      >
        + New AI Memory
      </button>
    );

  return (
    <>
      {triggerButton}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '0.875rem', padding: '1.75rem', width: '100%', maxWidth: '30rem', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '0 1rem' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontWeight: 600, fontSize: '1.125rem', margin: 0 }}>New AI Memory</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', display: 'flex', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Icon section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#44403c' }}>Icon </span>
                  <span style={{ fontSize: '0.75rem', color: '#a8a29e', fontWeight: 400 }}>— {PAGE_CATEGORIES[page]}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem', border: '1px solid #e7e5e4', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.3 : 1, color: '#44403c' }}
                    aria-label="Previous"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <span style={{ fontSize: '0.7rem', color: '#a8a29e', minWidth: '2rem', textAlign: 'center' }}>{page + 1}/{totalPages}</span>
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem', border: '1px solid #e7e5e4', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page === totalPages - 1 ? 0.3 : 1, color: '#44403c' }}
                    aria-label="Next"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>

              {/* Icon grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {ICON_PAGES[page].map((icon) => {
                  const active = selectedIcon.id === icon.id;
                  return (
                    <button
                      key={icon.id}
                      type="button"
                      title={icon.label}
                      onClick={() => setSelectedIcon(icon)}
                      style={{
                        width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
                        border: active ? '1.5px solid #1c1917' : '1px solid #e7e5e4',
                        background: active ? '#f5f5f4' : 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.1s',
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#fafaf9'; e.currentTarget.style.borderColor = '#d4d1ca'; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e7e5e4'; } }}
                    >
                      <SvgIcon svg={icon.svg} size={17} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#44403c', display: 'block', marginBottom: '0.5rem' }}>Name</label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                placeholder="e.g. Work Projects"
                style={{ border: '1px solid #e7e5e4', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
              {slug && <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#78716c' }}>Slug: <code>{slug}</code></p>}
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#44403c', display: 'block', marginBottom: '0.5rem' }}>
                Description <span style={{ fontWeight: 400, color: '#a8a29e' }}>(optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this memory space for?"
                style={{ border: '1px solid #e7e5e4', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: 0 }}>{error}</p>}

            {/* Footer */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e7e5e4', background: 'white', fontSize: '0.875rem', cursor: 'pointer', color: '#44403c' }}>
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={status === 'loading' || !slug}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: '#1c1917', color: 'white', fontSize: '0.875rem', cursor: slug ? 'pointer' : 'not-allowed', opacity: slug ? 1 : 0.5 }}
              >
                {status === 'loading' ? 'Creating...' : 'Create memory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}