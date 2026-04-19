import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type MemoryIcon = {
  id: string;
  label: string;
  emoji?: string;
  svg?: React.ReactNode;
};

type IconPage = {
  id: string;
  label: string;
  icons: MemoryIcon[];
};

type NewMemoryButtonProps = {
  onCreate?: (payload: { name: string; description: string; icon: string }) => void | Promise<void>;
  triggerLabel?: string;
  className?: string;
};

const iconButtonBase =
  'flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-200 bg-white text-2xl transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300';

const sceneStroke = {
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

function SvgWrap({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8 text-neutral-800" aria-hidden="true">
      {children}
    </svg>
  );
}

function PersonDeskIcon() {
  return (
    <SvgWrap>
      <circle cx="17" cy="12" r="4" {...sceneStroke} />
      <path d="M12 22c2-4 8-4 10 0l2 5" {...sceneStroke} />
      <path d="M24 18h10v10H22" {...sceneStroke} />
      <path d="M8 30h30" {...sceneStroke} />
      <path d="M14 30v6M30 30v6" {...sceneStroke} />
      <path d="M27 14l4 3" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonBeanbagIcon() {
  return (
    <SvgWrap>
      <circle cx="18" cy="12" r="4" {...sceneStroke} />
      <path d="M10 31c2-7 8-12 17-11 5 1 10 5 11 11-5 4-23 5-28 0Z" {...sceneStroke} />
      <path d="M17 18l4 5 6 1" {...sceneStroke} />
      <path d="M20 24l-3 5" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonWritingIcon() {
  return (
    <SvgWrap>
      <circle cx="17" cy="12" r="4" {...sceneStroke} />
      <path d="M12 23c3-3 8-4 11 0l2 3" {...sceneStroke} />
      <path d="M24 20h12v12H24" {...sceneStroke} />
      <path d="M12 32h26" {...sceneStroke} />
      <path d="M25 25l5 4" {...sceneStroke} />
      <path d="M31 29l4-6" {...sceneStroke} />
    </SvgWrap>
  );
}

function TwoPeopleTalkingIcon() {
  return (
    <SvgWrap>
      <circle cx="15" cy="14" r="4" {...sceneStroke} />
      <circle cx="33" cy="14" r="4" {...sceneStroke} />
      <path d="M10 26c2-4 8-5 11-1" {...sceneStroke} />
      <path d="M27 25c3-4 9-3 11 1" {...sceneStroke} />
      <path d="M11 30h9l-2 5-4-2-3 2Z" {...sceneStroke} />
      <path d="M28 30h9l-3 5-3-2-3 2Z" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonStretchingIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="10" r="4" {...sceneStroke} />
      <path d="M24 14v11" {...sceneStroke} />
      <path d="M24 18l-11-6" {...sceneStroke} />
      <path d="M24 18l11-6" {...sceneStroke} />
      <path d="M24 25l-8 11" {...sceneStroke} />
      <path d="M24 25l8 11" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonWalkingIcon() {
  return (
    <SvgWrap>
      <circle cx="20" cy="10" r="4" {...sceneStroke} />
      <path d="M20 14l5 7 7 1" {...sceneStroke} />
      <path d="M25 21l-3 7" {...sceneStroke} />
      <path d="M22 28l-8 8" {...sceneStroke} />
      <path d="M25 23l8 13" {...sceneStroke} />
      <path d="M16 21l5-2" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonCookingIcon() {
  return (
    <SvgWrap>
      <circle cx="15" cy="11" r="4" {...sceneStroke} />
      <path d="M10 21c2-3 8-4 11 0l1 3" {...sceneStroke} />
      <path d="M21 21h14a4 4 0 0 1 0 8H22" {...sceneStroke} />
      <path d="M8 30h28" {...sceneStroke} />
      <path d="M32 21v-3" {...sceneStroke} />
      <path d="M26 17c0-2 2-2 2-4" {...sceneStroke} />
      <path d="M30 17c0-2 2-2 2-4" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonReadingIcon() {
  return (
    <SvgWrap>
      <circle cx="18" cy="11" r="4" {...sceneStroke} />
      <path d="M12 23c2-4 8-4 11 0l1 3" {...sceneStroke} />
      <path d="M21 20c3-2 6-2 9 0v12c-3-2-6-2-9 0Z" {...sceneStroke} />
      <path d="M21 20c-3-2-6-2-9 0v12c3-2 6-2 9 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonPhoneIcon() {
  return (
    <SvgWrap>
      <circle cx="18" cy="11" r="4" {...sceneStroke} />
      <path d="M13 23c2-4 8-4 11 0l1 6" {...sceneStroke} />
      <rect x="26" y="15" width="8" height="14" rx="2" {...sceneStroke} />
      <path d="M29 18h2" {...sceneStroke} />
      <path d="M16 30l-2 6" {...sceneStroke} />
      <path d="M24 29l3 7" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonCyclingIcon() {
  return (
    <SvgWrap>
      <circle cx="14" cy="31" r="6" {...sceneStroke} />
      <circle cx="34" cy="31" r="6" {...sceneStroke} />
      <circle cx="24" cy="11" r="4" {...sceneStroke} />
      <path d="M24 15l4 7h6" {...sceneStroke} />
      <path d="M18 23h10l-6 8" {...sceneStroke} />
      <path d="M20 21l-6 10" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonMeditatingIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="10" r="4" {...sceneStroke} />
      <path d="M18 22c2-4 10-4 12 0" {...sceneStroke} />
      <path d="M24 18v8" {...sceneStroke} />
      <path d="M16 30c2-3 5-4 8-4s6 1 8 4" {...sceneStroke} />
      <path d="M11 34c4-4 8-6 13-6s9 2 13 6" {...sceneStroke} />
    </SvgWrap>
  );
}

function CoffeeCupIcon() {
  return (
    <SvgWrap>
      <path d="M12 18h16v9a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z" {...sceneStroke} />
      <path d="M28 20h4a4 4 0 0 1 0 8h-3" {...sceneStroke} />
      <path d="M15 36h18" {...sceneStroke} />
      <path d="M18 12c0-2 2-2 2-4" {...sceneStroke} />
      <path d="M23 12c0-2 2-2 2-4" {...sceneStroke} />
    </SvgWrap>
  );
}

function RamenBowlIcon() {
  return (
    <SvgWrap>
      <path d="M10 21h28c-1 10-7 15-14 15s-13-5-14-15Z" {...sceneStroke} />
      <path d="M15 18c2-2 4-2 6 0" {...sceneStroke} />
      <path d="M22 18c2-2 4-2 6 0" {...sceneStroke} />
      <path d="M29 14l8-4" {...sceneStroke} />
      <path d="M31 18l8-1" {...sceneStroke} />
      <path d="M18 24h12" {...sceneStroke} />
    </SvgWrap>
  );
}

function BreakfastPlateIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="24" r="14" {...sceneStroke} />
      <circle cx="19" cy="22" r="4" {...sceneStroke} />
      <path d="M27 19c4 0 7 3 7 6s-3 5-7 5-7-2-7-5 3-6 7-6Z" {...sceneStroke} />
      <path d="M12 13l-2-3" {...sceneStroke} />
    </SvgWrap>
  );
}

function CitySkylineIcon() {
  return (
    <SvgWrap>
      <path d="M8 36h32" {...sceneStroke} />
      <path d="M11 36V20h6v16" {...sceneStroke} />
      <path d="M17 36V14h7v22" {...sceneStroke} />
      <path d="M24 36V18h6v18" {...sceneStroke} />
      <path d="M30 36V24h7v12" {...sceneStroke} />
      <path d="M20 10h1" {...sceneStroke} />
      <path d="M20 7v3" {...sceneStroke} />
    </SvgWrap>
  );
}

function HouseGardenIcon() {
  return (
    <SvgWrap>
      <path d="M10 23l14-11 14 11" {...sceneStroke} />
      <path d="M14 21v15h20V21" {...sceneStroke} />
      <path d="M21 36V27h6v9" {...sceneStroke} />
      <path d="M10 36h28" {...sceneStroke} />
      <path d="M8 30c2-2 4-2 6 0" {...sceneStroke} />
      <path d="M36 30c-2-2-4-2-6 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function HandshakeIcon() {
  return (
    <SvgWrap>
      <path d="M10 26l6-6 5 4 5-4 6 6" {...sceneStroke} />
      <path d="M16 20l-4-4" {...sceneStroke} />
      <path d="M32 20l4-4" {...sceneStroke} />
      <path d="M18 28l3 3" {...sceneStroke} />
      <path d="M22 26l4 4" {...sceneStroke} />
      <path d="M27 24l3 3" {...sceneStroke} />
    </SvgWrap>
  );
}

function GroupMeetingIcon() {
  return (
    <SvgWrap>
      <circle cx="14" cy="15" r="3" {...sceneStroke} />
      <circle cx="24" cy="12" r="3" {...sceneStroke} />
      <circle cx="34" cy="15" r="3" {...sceneStroke} />
      <path d="M10 28c1-4 7-5 9-1" {...sceneStroke} />
      <path d="M19 25c2-5 8-5 10 0" {...sceneStroke} />
      <path d="M29 27c2-4 8-3 9 1" {...sceneStroke} />
      <path d="M12 34h24" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonPresentingIcon() {
  return (
    <SvgWrap>
      <circle cx="14" cy="14" r="4" {...sceneStroke} />
      <path d="M10 26c2-4 8-4 10 0v8" {...sceneStroke} />
      <path d="M23 12h15v11H23Z" {...sceneStroke} />
      <path d="M30.5 23v5" {...sceneStroke} />
      <path d="M27 28h7" {...sceneStroke} />
      <path d="M18 20l7-3" {...sceneStroke} />
    </SvgWrap>
  );
}

function SoloHikerIcon() {
  return (
    <SvgWrap>
      <circle cx="20" cy="10" r="4" {...sceneStroke} />
      <path d="M20 14l5 8 5 3" {...sceneStroke} />
      <path d="M25 22l-4 7" {...sceneStroke} />
      <path d="M21 29l-7 7" {...sceneStroke} />
      <path d="M28 25l3 11" {...sceneStroke} />
      <path d="M32 17v16" {...sceneStroke} />
      <path d="M8 36h28" {...sceneStroke} />
    </SvgWrap>
  );
}

function CampfireIcon() {
  return (
    <SvgWrap>
      <path d="M18 36l6-10 6 10" {...sceneStroke} />
      <path d="M16 28h16" {...sceneStroke} />
      <path d="M15 36l18-14" {...sceneStroke} />
      <path d="M33 36L15 22" {...sceneStroke} />
      <path d="M24 14c4 4 4 8 0 12-4-2-5-7 0-12Z" {...sceneStroke} />
    </SvgWrap>
  );
}

function BicycleIcon() {
  return (
    <SvgWrap>
      <circle cx="14" cy="30" r="7" {...sceneStroke} />
      <circle cx="34" cy="30" r="7" {...sceneStroke} />
      <path d="M14 30l8-11 5 11" {...sceneStroke} />
      <path d="M22 19h7" {...sceneStroke} />
      <path d="M20 23h10" {...sceneStroke} />
      <path d="M28 19l6 11" {...sceneStroke} />
    </SvgWrap>
  );
}

function JournalOpenIcon() {
  return (
    <SvgWrap>
      <path d="M10 14c4-2 8-2 12 0v20c-4-2-8-2-12 0Z" {...sceneStroke} />
      <path d="M22 14c4-2 8-2 12 0v20c-4-2-8-2-12 0" {...sceneStroke} />
      <path d="M16 19h3" {...sceneStroke} />
      <path d="M26 19h6" {...sceneStroke} />
      <path d="M26 24h6" {...sceneStroke} />
    </SvgWrap>
  );
}

function HeadphonesPersonIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="18" r="6" {...sceneStroke} />
      <path d="M16 20h-3v5h3" {...sceneStroke} />
      <path d="M32 20h3v5h-3" {...sceneStroke} />
      <path d="M14 20a10 10 0 0 1 20 0" {...sceneStroke} />
      <path d="M18 31c2-3 10-3 12 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonCodingIcon() {
  return (
    <SvgWrap>
      <circle cx="16" cy="12" r="4" {...sceneStroke} />
      <path d="M11 23c2-4 8-4 10 0l2 5" {...sceneStroke} />
      <rect x="23" y="14" width="15" height="11" rx="2" {...sceneStroke} />
      <path d="M28 18l-2 2 2 2" {...sceneStroke} />
      <path d="M33 18l2 2-2 2" {...sceneStroke} />
      <path d="M8 31h30" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonDogIcon() {
  return (
    <SvgWrap>
      <circle cx="15" cy="12" r="4" {...sceneStroke} />
      <path d="M10 23c2-4 8-4 10 0v7" {...sceneStroke} />
      <path d="M26 30c0-4 3-7 7-7 3 0 5 2 5 5 0 4-3 7-7 7h-5Z" {...sceneStroke} />
      <path d="M33 22l2-4 3 2" {...sceneStroke} />
      <path d="M25 30h-5" {...sceneStroke} />
    </SvgWrap>
  );
}

function SunriseSceneIcon() {
  return (
    <SvgWrap>
      <path d="M9 31h30" {...sceneStroke} />
      <path d="M15 31a9 9 0 0 1 18 0" {...sceneStroke} />
      <path d="M24 16v5" {...sceneStroke} />
      <path d="M16 21l3 2" {...sceneStroke} />
      <path d="M32 21l-3 2" {...sceneStroke} />
      <path d="M12 36h24" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonDancingIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="10" r="4" {...sceneStroke} />
      <path d="M24 14l4 7" {...sceneStroke} />
      <path d="M28 21l8 3" {...sceneStroke} />
      <path d="M24 17l-8 8" {...sceneStroke} />
      <path d="M24 24l-6 12" {...sceneStroke} />
      <path d="M28 24l8 10" {...sceneStroke} />
      <path d="M11 15l3-2" {...sceneStroke} />
    </SvgWrap>
  );
}

function StargazingIcon() {
  return (
    <SvgWrap>
      <path d="M8 33c4-5 8-7 14-7s10 2 18 7" {...sceneStroke} />
      <circle cx="18" cy="18" r="3" {...sceneStroke} />
      <path d="M15 24l4 3 4-1" {...sceneStroke} />
      <path d="M32 11l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" {...sceneStroke} />
      <path d="M24 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" {...sceneStroke} />
    </SvgWrap>
  );
}

function MountainViewIcon() {
  return (
    <SvgWrap>
      <path d="M8 35l10-14 6 8 5-6 11 12" {...sceneStroke} />
      <path d="M15 18l3-4 3 4" {...sceneStroke} />
      <path d="M34 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" {...sceneStroke} />
      <path d="M8 35h32" {...sceneStroke} />
    </SvgWrap>
  );
}

function BearNatureIcon() {
  return (
    <SvgWrap>
      <circle cx="20" cy="20" r="7" {...sceneStroke} />
      <circle cx="16" cy="15" r="2" {...sceneStroke} />
      <circle cx="24" cy="15" r="2" {...sceneStroke} />
      <path d="M17 22c2 2 4 2 6 0" {...sceneStroke} />
      <path d="M30 33l3-11 5 5" {...sceneStroke} />
      <path d="M12 34h24" {...sceneStroke} />
    </SvgWrap>
  );
}

function DeerForestIcon() {
  return (
    <SvgWrap>
      <path d="M18 14l-3-5" {...sceneStroke} />
      <path d="M18 14l-5-2" {...sceneStroke} />
      <path d="M30 14l3-5" {...sceneStroke} />
      <path d="M30 14l5-2" {...sceneStroke} />
      <path d="M18 14h12l3 6-4 8H19l-4-8Z" {...sceneStroke} />
      <path d="M22 28v8M28 28v8" {...sceneStroke} />
      <path d="M10 36h28" {...sceneStroke} />
    </SvgWrap>
  );
}

function BirdFlyingIcon() {
  return (
    <SvgWrap>
      <path d="M9 24c6-1 8-7 11-10 1 5 4 8 10 8 4 0 7-2 9-4-1 8-7 13-15 13-5 0-10-2-15-7Z" {...sceneStroke} />
    </SvgWrap>
  );
}

function TreeSunIcon() {
  return (
    <SvgWrap>
      <circle cx="34" cy="12" r="5" {...sceneStroke} />
      <path d="M20 34V23" {...sceneStroke} />
      <path d="M12 24c0-5 4-9 8-9s8 4 8 9" {...sceneStroke} />
      <path d="M10 28c0-4 3-7 7-7h6c4 0 7 3 7 7" {...sceneStroke} />
      <path d="M12 34h16" {...sceneStroke} />
    </SvgWrap>
  );
}

function MountainBirdsIcon() {
  return (
    <SvgWrap>
      <path d="M8 35l10-14 6 8 6-10 10 16" {...sceneStroke} />
      <path d="M30 10l3 2 3-2" {...sceneStroke} />
      <path d="M24 14l2 1 2-1" {...sceneStroke} />
      <path d="M8 35h32" {...sceneStroke} />
    </SvgWrap>
  );
}

function OceanWaveSceneIcon() {
  return (
    <SvgWrap>
      <path d="M8 28c4-5 8-7 12-7 5 0 8 3 9 8 2-2 4-3 7-3 2 0 4 1 4 3 0 4-4 7-12 7H8" {...sceneStroke} />
      <path d="M14 36h22" {...sceneStroke} />
    </SvgWrap>
  );
}

function ForestPathIcon() {
  return (
    <SvgWrap>
      <path d="M8 36c6-8 10-11 16-11s10 3 16 11" {...sceneStroke} />
      <path d="M12 28l4-8 4 8" {...sceneStroke} />
      <path d="M28 28l4-8 4 8" {...sceneStroke} />
      <path d="M22 36v-8" {...sceneStroke} />
      <path d="M26 36v-8" {...sceneStroke} />
    </SvgWrap>
  );
}

function FlowerFieldIcon() {
  return (
    <SvgWrap>
      <path d="M10 36h28" {...sceneStroke} />
      <path d="M16 36v-8M24 36v-10M32 36v-7" {...sceneStroke} />
      <circle cx="16" cy="24" r="3" {...sceneStroke} />
      <circle cx="24" cy="22" r="3" {...sceneStroke} />
      <circle cx="32" cy="25" r="3" {...sceneStroke} />
    </SvgWrap>
  );
}

function FoxIcon() {
  return (
    <SvgWrap>
      <path d="M14 18l5-7 5 4 5-4 5 7-3 12H17Z" {...sceneStroke} />
      <path d="M20 23h0M28 23h0" {...sceneStroke} />
      <path d="M22 28c2 1 4 1 6 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function WolfIcon() {
  return (
    <SvgWrap>
      <path d="M14 30l3-14 6 4 6-8 5 18" {...sceneStroke} />
      <path d="M20 30h10" {...sceneStroke} />
      <path d="M22 22h0M28 22h0" {...sceneStroke} />
      <path d="M24 26c2 1 2 1 4 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function EagleIcon() {
  return (
    <SvgWrap>
      <path d="M10 24c5-1 8-4 12-10 2 4 6 7 16 8-4 5-9 9-15 9-5 0-9-2-13-7Z" {...sceneStroke} />
      <path d="M22 16l3 3" {...sceneStroke} />
    </SvgWrap>
  );
}

function WhaleIcon() {
  return (
    <SvgWrap>
      <path d="M10 28c0-6 6-10 14-10 5 0 9 2 12 6 2 0 4 2 4 4 0 3-2 5-5 5h-8c-2 2-5 3-9 3-5 0-8-3-8-8Z" {...sceneStroke} />
      <path d="M20 17c0-2 1-4 3-5" {...sceneStroke} />
    </SvgWrap>
  );
}

function TurtleIcon() {
  return (
    <SvgWrap>
      <path d="M16 26c0-5 4-9 8-9s8 4 8 9-4 8-8 8-8-3-8-8Z" {...sceneStroke} />
      <path d="M16 24l-4 2M16 29l-4 2M32 24l4 2M32 29l4 2" {...sceneStroke} />
      <path d="M24 17v-3" {...sceneStroke} />
    </SvgWrap>
  );
}

function ButterflyGardenIcon() {
  return (
    <SvgWrap>
      <path d="M24 19v10" {...sceneStroke} />
      <path d="M24 22c-2-5-8-7-11-3s-2 9 4 10c2 0 5-2 7-7Z" {...sceneStroke} />
      <path d="M24 22c2-5 8-7 11-3s2 9-4 10c-2 0-5-2-7-7Z" {...sceneStroke} />
      <path d="M10 36h28" {...sceneStroke} />
      <path d="M16 36v-5M32 36v-5" {...sceneStroke} />
    </SvgWrap>
  );
}

function RiverRocksIcon() {
  return (
    <SvgWrap>
      <path d="M9 18c6 0 8 4 8 8s-2 8-8 8" {...sceneStroke} />
      <path d="M17 19c8 0 13 5 13 9s-5 8-13 8" {...sceneStroke} />
      <path d="M30 20c5 0 9 3 9 7s-4 7-9 7" {...sceneStroke} />
      <path d="M14 35h4M25 36h5" {...sceneStroke} />
    </SvgWrap>
  );
}

function SnowyPeakIcon() {
  return (
    <SvgWrap>
      <path d="M8 35l11-16 6 8 5-6 10 14" {...sceneStroke} />
      <path d="M18 20l2-3 2 3" {...sceneStroke} />
      <path d="M29 23l2-2 2 2" {...sceneStroke} />
      <path d="M8 35h32" {...sceneStroke} />
    </SvgWrap>
  );
}

function CactusDesertIcon() {
  return (
    <SvgWrap>
      <path d="M24 36V16" {...sceneStroke} />
      <path d="M19 24h-3c-2 0-3-2-3-4v-2" {...sceneStroke} />
      <path d="M29 20h3c2 0 3 2 3 4v2" {...sceneStroke} />
      <path d="M12 36h24" {...sceneStroke} />
      <path d="M34 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" {...sceneStroke} />
    </SvgWrap>
  );
}

function TropicalPalmIcon() {
  return (
    <SvgWrap>
      <path d="M24 36V19" {...sceneStroke} />
      <path d="M24 19c-4-5-9-6-14-4 2 4 6 6 11 6" {...sceneStroke} />
      <path d="M24 19c4-5 9-6 14-4-2 4-6 6-11 6" {...sceneStroke} />
      <path d="M24 22c-3-3-7-4-11-3" {...sceneStroke} />
      <path d="M12 36h24" {...sceneStroke} />
    </SvgWrap>
  );
}

function AutumnLeavesIcon() {
  return (
    <SvgWrap>
      <path d="M18 14c4 0 7 3 7 7 0 8-7 13-11 13-2-3-3-6-3-9 0-6 3-11 7-11Z" {...sceneStroke} />
      <path d="M30 16c4 1 7 5 6 10-1 7-7 10-12 10-1-3-1-6 0-9 2-6 4-11 6-11Z" {...sceneStroke} />
      <path d="M24 13v24" {...sceneStroke} />
    </SvgWrap>
  );
}

function RainyWindowIcon() {
  return (
    <SvgWrap>
      <rect x="11" y="10" width="26" height="26" rx="2" {...sceneStroke} />
      <path d="M24 10v26M11 23h26" {...sceneStroke} />
      <path d="M16 15l-1 3M21 18l-1 3M31 15l-1 3M28 24l-1 3" {...sceneStroke} />
    </SvgWrap>
  );
}

function NorthernLightsIcon() {
  return (
    <SvgWrap>
      <path d="M8 30c4-10 10-14 16-14s10 4 16 14" {...sceneStroke} />
      <path d="M12 26c4-6 8-8 12-8s8 2 12 8" {...sceneStroke} />
      <path d="M10 36h28" {...sceneStroke} />
      <path d="M16 36l2-4M30 36l-2-4" {...sceneStroke} />
    </SvgWrap>
  );
}

function WaterfallIcon() {
  return (
    <SvgWrap>
      <path d="M12 12h24" {...sceneStroke} />
      <path d="M20 12v12" {...sceneStroke} />
      <path d="M24 12v16" {...sceneStroke} />
      <path d="M28 12v12" {...sceneStroke} />
      <path d="M14 31c3 0 5 2 7 5" {...sceneStroke} />
      <path d="M23 31c3 0 5 2 7 5" {...sceneStroke} />
    </SvgWrap>
  );
}

function MushroomIcon() {
  return (
    <SvgWrap>
      <path d="M12 24c0-7 5-11 12-11s12 4 12 11Z" {...sceneStroke} />
      <path d="M20 24v6c0 3 2 6 4 6s4-3 4-6v-6" {...sceneStroke} />
      <path d="M18 20h0M30 20h0" {...sceneStroke} />
    </SvgWrap>
  );
}

function PineForestIcon() {
  return (
    <SvgWrap>
      <path d="M14 36V28M24 36V22M34 36V28" {...sceneStroke} />
      <path d="M9 28l5-10 5 10" {...sceneStroke} />
      <path d="M17 22l7-13 7 13" {...sceneStroke} />
      <path d="M29 28l5-10 5 10" {...sceneStroke} />
      <path d="M8 36h32" {...sceneStroke} />
    </SvgWrap>
  );
}

function LotusIcon() {
  return (
    <SvgWrap>
      <path d="M24 18c3 3 4 7 4 11-4-1-6-4-8-8-2 4-4 7-8 8 0-4 1-8 4-11 2 1 3 2 4 4 1-2 2-3 4-4Z" {...sceneStroke} />
      <path d="M12 34h24" {...sceneStroke} />
    </SvgWrap>
  );
}

function BeeFlowerIcon() {
  return (
    <SvgWrap>
      <circle cx="31" cy="17" r="4" {...sceneStroke} />
      <path d="M27 17h8" {...sceneStroke} />
      <path d="M30 13l-2-3M32 13l2-3" {...sceneStroke} />
      <circle cx="17" cy="28" r="3" {...sceneStroke} />
      <path d="M17 20v16M9 28h16" {...sceneStroke} />
    </SvgWrap>
  );
}

function RabbitGrassIcon() {
  return (
    <SvgWrap>
      <path d="M18 17l-2-8M24 17l1-8" {...sceneStroke} />
      <path d="M16 18c0-3 2-5 5-5h1c6 0 10 4 10 10 0 7-5 11-11 11S16 29 16 24Z" {...sceneStroke} />
      <path d="M12 36h24" {...sceneStroke} />
    </SvgWrap>
  );
}

function OwlBranchIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="20" r="8" {...sceneStroke} />
      <circle cx="20" cy="20" r="2" {...sceneStroke} />
      <circle cx="28" cy="20" r="2" {...sceneStroke} />
      <path d="M22 25c1 1 3 1 4 0" {...sceneStroke} />
      <path d="M10 31h28" {...sceneStroke} />
      <path d="M18 31l-3 5M30 31l3 5" {...sceneStroke} />
    </SvgWrap>
  );
}

function FishUnderwaterIcon() {
  return (
    <SvgWrap>
      <path d="M11 24c4-5 9-7 15-7 6 0 9 2 11 7-2 5-5 7-11 7-6 0-11-2-15-7Z" {...sceneStroke} />
      <path d="M31 24l6-5v10Z" {...sceneStroke} />
      <path d="M16 24h0" {...sceneStroke} />
      <path d="M9 34c3-1 4-3 5-5" {...sceneStroke} />
    </SvgWrap>
  );
}

function StarrySkyIcon() {
  return (
    <SvgWrap>
      <path d="M10 34c5-4 9-6 14-6s9 2 14 6" {...sceneStroke} />
      <path d="M14 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" {...sceneStroke} />
      <path d="M24 9l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" {...sceneStroke} />
      <path d="M33 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" {...sceneStroke} />
    </SvgWrap>
  );
}

const page1: IconPage = {
  id: 'knowledge-work',
  label: 'Knowledge & Work',
  icons: [
    { id: 'brain', label: 'Brain', emoji: '🧠' },
    { id: 'rocket', label: 'Rocket', emoji: '🚀' },
    { id: 'people', label: 'People', emoji: '👥' },
    { id: 'briefcase', label: 'Briefcase', emoji: '💼' },
    { id: 'books', label: 'Books', emoji: '📚' },
    { id: 'target', label: 'Target', emoji: '🎯' },
    { id: 'idea', label: 'Idea', emoji: '💡' },
    { id: 'microscope', label: 'Microscope', emoji: '🔬' },
    { id: 'globe', label: 'Globe', emoji: '🌍' },
    { id: 'robot', label: 'Robot', emoji: '🤖' },
    { id: 'tools', label: 'Tools', emoji: '🛠️' },
    { id: 'memo', label: 'Memo', emoji: '📝' },
    { id: 'palette', label: 'Palette', emoji: '🎨' },
    { id: 'fire', label: 'Fire', emoji: '🔥' },
    { id: 'lightning', label: 'Lightning', emoji: '⚡' },
    { id: 'seedling', label: 'Seedling', emoji: '🌱' },
    { id: 'trophy', label: 'Trophy', emoji: '🏆' },
    { id: 'crystal', label: 'Crystal Ball', emoji: '🔮' },
    { id: 'chart', label: 'Chart', emoji: '📈' },
    { id: 'lion', label: 'Lion', emoji: '🦁' },
    { id: 'dragon', label: 'Dragon', emoji: '🐉' },
    { id: 'wave', label: 'Wave', emoji: '🌊' },
    { id: 'guitar', label: 'Guitar', emoji: '🎸' },
    { id: 'clover', label: 'Clover', emoji: '🍀' },
    { id: 'sparkles', label: 'Sparkles', emoji: '✨' },
    { id: 'puzzle', label: 'Puzzle', emoji: '🧩' },
    { id: 'folder', label: 'Folder', emoji: '🗂️' },
    { id: 'bars', label: 'Bar Chart', emoji: '📊' },
    { id: 'key', label: 'Key', emoji: '🔑' },
  ],
};

const page2: IconPage = {
  id: 'tech-learning-productivity',
  label: 'Tech, Learning & Productivity',
  icons: [
    { id: 'laptop', label: 'Laptop', emoji: '💻' },
    { id: 'phone', label: 'Phone', emoji: '📱' },
    { id: 'desktop', label: 'Desktop', emoji: '🖥️' },
    { id: 'keyboard', label: 'Keyboard', emoji: '⌨️' },
    { id: 'mouse', label: 'Mouse', emoji: '🖱️' },
    { id: 'battery', label: 'Battery', emoji: '🔋' },
    { id: 'satellite', label: 'Satellite', emoji: '🛰️' },
    { id: 'signal', label: 'Signal', emoji: '📡' },
    { id: 'ai', label: 'AI', emoji: '🤖' },
    { id: 'mind', label: 'Mind', emoji: '🧠' },
    { id: 'bulb', label: 'Bulb', emoji: '💡' },
    { id: 'science', label: 'Science', emoji: '🧪' },
    { id: 'research', label: 'Research', emoji: '🔬' },
    { id: 'kpi', label: 'KPI', emoji: '📊' },
    { id: 'growth', label: 'Growth', emoji: '📈' },
    { id: 'board', label: 'Board', emoji: '📋' },
    { id: 'calendar', label: 'Calendar', emoji: '🗓️' },
    { id: 'clock', label: 'Clock', emoji: '⏰' },
    { id: 'bell', label: 'Bell', emoji: '🔔' },
    { id: 'pin', label: 'Pin', emoji: '📌' },
    { id: 'link', label: 'Link', emoji: '🔗' },
    { id: 'chat', label: 'Chat', emoji: '💬' },
    { id: 'mail', label: 'Mail', emoji: '📨' },
    { id: 'ballot', label: 'Vote', emoji: '🗳️' },
    { id: 'build', label: 'Build', emoji: '🏗️' },
    { id: 'gear', label: 'Settings', emoji: '⚙️' },
    { id: 'file-cabinet', label: 'Organize', emoji: '🗂️' },
  ],
};

const page3: IconPage = {
  id: 'life-goals-creative',
  label: 'Life, Goals & Creative',
  icons: [
    { id: 'goal', label: 'Goal', emoji: '🎯' },
    { id: 'win', label: 'Win', emoji: '🏆' },
    { id: 'grow', label: 'Grow', emoji: '🌱' },
    { id: 'world', label: 'World', emoji: '🌍' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'home', label: 'Home', emoji: '🏡' },
    { id: 'community', label: 'Community', emoji: '👥' },
    { id: 'collab', label: 'Collaboration', emoji: '🤝' },
    { id: 'strength', label: 'Strength', emoji: '💪' },
    { id: 'calm', label: 'Calm', emoji: '🧘' },
    { id: 'study', label: 'Study', emoji: '📚' },
    { id: 'graduate', label: 'Graduate', emoji: '🎓' },
    { id: 'art', label: 'Art', emoji: '🎨' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'film', label: 'Film', emoji: '🎬' },
    { id: 'camera', label: 'Camera', emoji: '📷' },
    { id: 'write', label: 'Write', emoji: '✏️' },
    { id: 'notes', label: 'Notes', emoji: '🗒️' },
    { id: 'thought', label: 'Thought', emoji: '💭' },
    { id: 'star', label: 'Star', emoji: '🌟' },
    { id: 'unlock', label: 'Key', emoji: '🔑' },
    { id: 'solve', label: 'Solve', emoji: '🧩' },
    { id: 'flow', label: 'Flow', emoji: '🌊' },
    { id: 'brave', label: 'Brave', emoji: '🦁' },
    { id: 'launch', label: 'Launch', emoji: '🚀' },
    { id: 'strategy', label: 'Strategy', emoji: '♟️' },
    { id: 'night', label: 'Night', emoji: '🌙' },
  ],
};

const page4: IconPage = {
  id: 'people-everyday-life',
  label: 'People & Everyday Life',
  icons: [
    { id: 'person-desk', label: 'Person at desk', svg: <PersonDeskIcon /> },
    { id: 'person-beanbag', label: 'Person on beanbag', svg: <PersonBeanbagIcon /> },
    { id: 'person-writing', label: 'Person writing', svg: <PersonWritingIcon /> },
    { id: 'two-people-talking', label: 'Two people talking', svg: <TwoPeopleTalkingIcon /> },
    { id: 'person-stretching', label: 'Person stretching', svg: <PersonStretchingIcon /> },
    { id: 'person-walking', label: 'Person walking', svg: <PersonWalkingIcon /> },
    { id: 'person-cooking', label: 'Person cooking', svg: <PersonCookingIcon /> },
    { id: 'person-reading', label: 'Person reading', svg: <PersonReadingIcon /> },
    { id: 'person-phone', label: 'Person on phone', svg: <PersonPhoneIcon /> },
    { id: 'person-cycling', label: 'Person cycling', svg: <PersonCyclingIcon /> },
    { id: 'person-meditating', label: 'Person meditating', svg: <PersonMeditatingIcon /> },
    { id: 'coffee-cup', label: 'Coffee cup', svg: <CoffeeCupIcon /> },
    { id: 'ramen-bowl', label: 'Ramen bowl', svg: <RamenBowlIcon /> },
    { id: 'breakfast-plate', label: 'Breakfast plate', svg: <BreakfastPlateIcon /> },
    { id: 'city-skyline', label: 'City skyline', svg: <CitySkylineIcon /> },
    { id: 'house-garden', label: 'House with garden', svg: <HouseGardenIcon /> },
    { id: 'handshake-scene', label: 'Handshake', svg: <HandshakeIcon /> },
    { id: 'group-meeting', label: 'Group meeting', svg: <GroupMeetingIcon /> },
    { id: 'person-presenting', label: 'Person presenting', svg: <PersonPresentingIcon /> },
    { id: 'solo-hiker', label: 'Solo hiker', svg: <SoloHikerIcon /> },
    { id: 'campfire', label: 'Campfire', svg: <CampfireIcon /> },
    { id: 'bicycle-scene', label: 'Bicycle', svg: <BicycleIcon /> },
    { id: 'journal-open', label: 'Journal open', svg: <JournalOpenIcon /> },
    { id: 'headphones-person', label: 'Headphones person', svg: <HeadphonesPersonIcon /> },
    { id: 'person-coding', label: 'Person coding', svg: <PersonCodingIcon /> },
    { id: 'person-dog', label: 'Person with dog', svg: <PersonDogIcon /> },
    { id: 'sunrise-scene', label: 'Sunrise scene', svg: <SunriseSceneIcon /> },
    { id: 'person-dancing', label: 'Person dancing', svg: <PersonDancingIcon /> },
    { id: 'star-gazing', label: 'Star gazing', svg: <StargazingIcon /> },
    { id: 'mountain-view', label: 'Mountain view', svg: <MountainViewIcon /> },
  ],
};

const page5: IconPage = {
  id: 'nature-outdoors',
  label: 'Nature & Outdoors',
  icons: [
    { id: 'bear-nature', label: 'Bear in nature', svg: <BearNatureIcon /> },
    { id: 'deer-forest', label: 'Deer in forest', svg: <DeerForestIcon /> },
    { id: 'bird-flying', label: 'Bird flying', svg: <BirdFlyingIcon /> },
    { id: 'tree-sun', label: 'Tree and sun', svg: <TreeSunIcon /> },
    { id: 'mountain-birds', label: 'Mountain and birds', svg: <MountainBirdsIcon /> },
    { id: 'ocean-wave-scene', label: 'Ocean wave scene', svg: <OceanWaveSceneIcon /> },
    { id: 'forest-path', label: 'Forest path', svg: <ForestPathIcon /> },
    { id: 'flower-field', label: 'Flower field', svg: <FlowerFieldIcon /> },
    { id: 'fox', label: 'Fox', svg: <FoxIcon /> },
    { id: 'wolf', label: 'Wolf', svg: <WolfIcon /> },
    { id: 'eagle', label: 'Eagle', svg: <EagleIcon /> },
    { id: 'whale', label: 'Whale', svg: <WhaleIcon /> },
    { id: 'turtle', label: 'Turtle', svg: <TurtleIcon /> },
    { id: 'butterfly-garden', label: 'Butterfly garden', svg: <ButterflyGardenIcon /> },
    { id: 'river-rocks', label: 'River and rocks', svg: <RiverRocksIcon /> },
    { id: 'snowy-peak', label: 'Snowy peak', svg: <SnowyPeakIcon /> },
    { id: 'cactus-desert', label: 'Cactus desert', svg: <CactusDesertIcon /> },
    { id: 'tropical-palm', label: 'Tropical palm', svg: <TropicalPalmIcon /> },
    { id: 'autumn-leaves', label: 'Autumn leaves', svg: <AutumnLeavesIcon /> },
    { id: 'rainy-window', label: 'Rainy window', svg: <RainyWindowIcon /> },
    { id: 'northern-lights', label: 'Northern lights', svg: <NorthernLightsIcon /> },
    { id: 'waterfall', label: 'Waterfall', svg: <WaterfallIcon /> },
    { id: 'mushroom', label: 'Mushroom', svg: <MushroomIcon /> },
    { id: 'pine-forest', label: 'Pine forest', svg: <PineForestIcon /> },
    { id: 'lotus', label: 'Lotus', svg: <LotusIcon /> },
    { id: 'bee-flower', label: 'Bee and flower', svg: <BeeFlowerIcon /> },
    { id: 'rabbit-grass', label: 'Rabbit in grass', svg: <RabbitGrassIcon /> },
    { id: 'owl-branch', label: 'Owl on branch', svg: <OwlBranchIcon /> },
    { id: 'fish-underwater', label: 'Fish underwater', svg: <FishUnderwaterIcon /> },
    { id: 'starry-sky', label: 'Starry sky', svg: <StarrySkyIcon /> },
  ],
};

const ICON_PAGES: IconPage[] = [page1, page2, page3, page4, page5];
const DEFAULT_ICON_ID = page1.icons[0]?.id ?? 'brain';

function getIconValue(icon: MemoryIcon) {
  return icon.emoji ?? icon.id;
}

function IconRenderer({ icon }: { icon: MemoryIcon }) {
  if (icon.svg) return <span className="flex items-center justify-center">{icon.svg}</span>;
  return <span aria-hidden="true">{icon.emoji}</span>;
}

function IconPicker({
  pages,
  selectedIconId,
  onSelect,
}: {
  pages: IconPage[];
  selectedIconId: string;
  onSelect: (iconId: string) => void;
}) {
  const selectedPageIndex = useMemo(() => {
    const found = pages.findIndex((page) => page.icons.some((icon) => icon.id === selectedIconId));
    return found >= 0 ? found : 0;
  }, [pages, selectedIconId]);

  const [pageIndex, setPageIndex] = useState(selectedPageIndex);

  useEffect(() => {
    setPageIndex(selectedPageIndex);
  }, [selectedPageIndex]);

  const currentPage = pages[pageIndex];
  const canGoLeft = pageIndex > 0;
  const canGoRight = pageIndex < pages.length - 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-900">Icon</p>
          <p className="text-xs text-neutral-500">{currentPage.label}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous icon page"
            onClick={() => canGoLeft && setPageIndex((prev) => prev - 1)}
            disabled={!canGoLeft}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next icon page"
            onClick={() => canGoRight && setPageIndex((prev) => prev + 1)}
            disabled={!canGoRight}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
        {currentPage.icons.map((icon) => {
          const selected = icon.id === selectedIconId;
          return (
            <button
              key={icon.id}
              type="button"
              aria-label={icon.label}
              title={icon.label}
              onClick={() => onSelect(icon.id)}
              className={`${iconButtonBase} ${
                selected ? 'border-neutral-900 ring-2 ring-neutral-900/10' : ''
              } ${icon.svg ? 'text-base' : ''}`}
            >
              <IconRenderer icon={icon} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-1">
        {pages.map((page, index) => (
          <button
            key={page.id}
            type="button"
            aria-label={`Go to ${page.label}`}
            onClick={() => setPageIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === pageIndex ? 'w-6 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function NewMemoryButton({
  onCreate,
  triggerLabel = 'New memory',
  className = '',
}: NewMemoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIconId, setSelectedIconId] = useState(DEFAULT_ICON_ID);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconMap = useMemo(() => {
    const map = new Map<string, MemoryIcon>();
    ICON_PAGES.forEach((page) => {
      page.icons.forEach((icon) => map.set(icon.id, icon));
    });
    return map;
  }, []);

  const selectedIcon = iconMap.get(selectedIconId) ?? iconMap.get(DEFAULT_ICON_ID)!;

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedIconId(DEFAULT_ICON_ID);
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    if (!name.trim() || !selectedIcon) return;

    try {
      setIsSubmitting(true);
      await onCreate?.({
        name: name.trim(),
        description: description.trim(),
        icon: getIconValue(selectedIcon),
      });
      closeModal();
    } catch (error) {
      console.error('Failed to create memory', error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || 'inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800'}
      >
        {triggerLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-3xl rounded-[28px] bg-[#f6f6f4] p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">New AI Memory</h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-black/5 hover:text-neutral-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-7">
              <IconPicker pages={ICON_PAGES} selectedIconId={selectedIconId} onSelect={setSelectedIconId} />

              <div className="space-y-2">
                <label htmlFor="memory-name" className="block text-lg font-medium text-neutral-900">
                  Name
                </label>
                <input
                  id="memory-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Work Projects"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-lg text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="memory-description" className="block text-lg font-medium text-neutral-900">
                  Description <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  id="memory-description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this memory space for?"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-lg text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-neutral-200 bg-white px-7 py-4 text-lg font-medium text-neutral-800 transition hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!name.trim() || isSubmitting}
                  className="rounded-2xl bg-neutral-500 px-7 py-4 text-lg font-medium text-white transition hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating...' : 'Create memory'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
