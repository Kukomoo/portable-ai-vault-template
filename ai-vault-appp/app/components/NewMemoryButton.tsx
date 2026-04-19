import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft, ChevronRight, X, Brain, Rocket, Users, Briefcase, Book, Target,
  Lightbulb, Microscope, Globe, Bot, Wrench, FileText, Palette, Flame, Zap,
  Sprout, Trophy, Sparkles, PieChart, Puzzle, Folder, BarChart, Key, Laptop,
  Smartphone, Cpu, Wifi, Database, Settings, Terminal, Layers, Ruler, Search,
  Heart, Star, Camera, Brush, Feather, Compass, Home, Film, Music, Clock,
  Lock, Cloud, Milestone, GraduationCap, Map as MapIcon, Gift, Anchor, Infinity, Activity,
  Dumbbell, HeartPulse, Utensils, Palmtree, Headphones, Gamepad2, Timer, Leaf, Moon, Sun
} from 'lucide-react';
import { on } from 'events';

type MemoryIcon = {
  id: string;
  label: string;
  svg: React.ReactNode;
};

type IconPage = {
  id: string;
  label: string;
  icons: MemoryIcon[];
};

type NewMemoryButtonProps = {
  onCreate?: (payload: { name: string; description: string; icon: string }) => Promise<{ slug?: string } | void> | { slug?: string } | void;
  triggerLabel?: string;
  className?: string;
};

const router = useRouter();

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

// Custom Scene Icons for Page 4 & 5 (Retained from user's latest update)
function PersonDeskIcon() {
  return (
    <SvgWrap>
      <circle cx="17" cy="12" r="4" {...sceneStroke} />
      <path d="M12 22c2-4 8-4 10 0l2 5" {...sceneStroke} />
      <path d="M24 18h10v10H22" {...sceneStroke} />
      <path d="M8 30h30" {...sceneStroke} />
      <path d="M14 30v6M30 30v6" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonBeanbagIcon() {
  return (
    <SvgWrap>
      <circle cx="18" cy="12" r="4" {...sceneStroke} />
      <path d="M10 24c2-2 6-2 8 0" {...sceneStroke} />
      <path d="M6 32c4 4 16 4 20 0l6-4" {...sceneStroke} />
      <path d="M12 28h12" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonWritingIcon() {
  return (
    <SvgWrap>
      <circle cx="15" cy="12" r="4" {...sceneStroke} />
      <path d="M10 24c2-2 6-2 8 0" {...sceneStroke} />
      <path d="M22 18h12v14H20" {...sceneStroke} />
      <path d="M28 22l4 4" {...sceneStroke} />
    </SvgWrap>
  );
}

function TwoPeopleTalkingIcon() {
  return (
    <SvgWrap>
      <circle cx="14" cy="12" r="4" {...sceneStroke} />
      <path d="M8 24c2-2 6-2 8 0" {...sceneStroke} />
      <circle cx="34" cy="12" r="4" {...sceneStroke} />
      <path d="M28 24c2-2 6-2 8 0" {...sceneStroke} />
      <path d="M20 16h8" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonStretchingIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="10" r="4" {...sceneStroke} />
      <path d="M12 24l12-4 12 4" {...sceneStroke} />
      <path d="M24 20v10l-6 8M24 30l6 8" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonWalkingIcon() {
  return (
    <SvgWrap>
      <circle cx="26" cy="10" r="4" {...sceneStroke} />
      <path d="M20 20l6-2 4 6" {...sceneStroke} />
      <path d="M26 18v10l-4 8M26 28l6 6" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonCookingIcon() {
  return (
    <SvgWrap>
      <circle cx="16" cy="12" r="4" {...sceneStroke} />
      <path d="M10 24c2-2 6-2 8 0" {...sceneStroke} />
      <path d="M22 22h12v4H20" {...sceneStroke} />
      <path d="M24 18v4M32 18v4" {...sceneStroke} />
      <path d="M20 30h16" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonReadingIcon() {
  return (
    <SvgWrap>
      <circle cx="16" cy="12" r="4" {...sceneStroke} />
      <path d="M10 24c2-2 6-2 8 0" {...sceneStroke} />
      <path d="M22 22l6-4 6 4-6 4z" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonPhoneIcon() {
  return (
    <SvgWrap>
      <circle cx="18" cy="12" r="4" {...sceneStroke} />
      <path d="M12 24c2-2 6-2 8 0" {...sceneStroke} />
      <path d="M26 14h4v10h-4z" {...sceneStroke} />
      <path d="M28 24v4" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonCyclingIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="12" r="4" {...sceneStroke} />
      <path d="M18 24l6-2 6 4" {...sceneStroke} />
      <circle cx="16" cy="34" r="6" {...sceneStroke} />
      <circle cx="32" cy="34" r="6" {...sceneStroke} />
      <path d="M16 34h16" {...sceneStroke} />
    </SvgWrap>
  );
}

function PersonMeditatingIcon() {
  return (
    <SvgWrap>
      <circle cx="24" cy="12" r="4" {...sceneStroke} />
      <path d="M14 34c4-4 16-4 20 0" {...sceneStroke} />
      <path d="M12 24l6 4M36 24l-6 4" {...sceneStroke} />
    </SvgWrap>
  );
}

function CoffeeCupIcon() {
  return (
    <SvgWrap>
      <path d="M12 14h20v14a10 10 0 0 1-20 0V14z" {...sceneStroke} />
      <path d="M32 18h4a4 4 0 0 1 0 8h-4" {...sceneStroke} />
      <path d="M18 8c0-2 2-2 2 0s2 2 2 0 2-2 2 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function CitySkylineIcon() {
  return (
    <SvgWrap>
      <path d="M4 36h40" {...sceneStroke} />
      <path d="M8 36V16h8v20M20 36V8h8v28M32 36V20h8v16" {...sceneStroke} />
    </SvgWrap>
  );
}

function HouseGardenIcon() {
  return (
    <SvgWrap>
      <path d="M8 36V20l12-8 12 8v16H8z" {...sceneStroke} />
      <path d="M16 36V26h8v10" {...sceneStroke} />
      <path d="M36 36h4M38 32v4" {...sceneStroke} />
    </SvgWrap>
  );
}

function BearNatureIcon() {
  return (
    <SvgWrap>
      <circle cx="16" cy="16" r="8" {...sceneStroke} />
      <circle cx="8" cy="8" r="3" {...sceneStroke} />
      <circle cx="24" cy="8" r="3" {...sceneStroke} />
      <path d="M12 32c2-2 6-2 8 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function TreeSunIcon() {
  return (
    <SvgWrap>
      <circle cx="36" cy="12" r="6" {...sceneStroke} />
      <path d="M12 36V4 36V24l8 12h-8z" {...sceneStroke} />
    </SvgWrap>
  );
}

function OceanWaveSceneIcon() {
  return (
    <SvgWrap>
      <path d="M4 24c4-4 8-4 12 0s8 4 12 0 8-4 12 0" {...sceneStroke} />
      <path d="M4 32c4-4 8-4 12 0s8 4 12 0 8-4 12 0" {...sceneStroke} />
    </SvgWrap>
  );
}

function ForestPathIcon() {
  return (
    <SvgWrap>
      <path d="M12 36l12-24 12 24" {...sceneStroke} />
      <path d="M4 36h40" {...sceneStroke} />
      <path d="M20 24h8" {...sceneStroke} />
    </SvgWrap>
  );
}



const page1: IconPage = {
  id: 'knowledge-work',
  label: 'Knowledge & Work',
  icons: [
    { id: 'brain', label: 'Brain', svg: <Brain {...sceneStroke} /> },
    { id: 'rocket', label: 'Rocket', svg: <Rocket {...sceneStroke} /> },
    { id: 'people', label: 'People', svg: <Users {...sceneStroke} /> },
    { id: 'briefcase', label: 'Work', svg: <Briefcase {...sceneStroke} /> },
    { id: 'books', label: 'Library', svg: <Book {...sceneStroke} /> },
    { id: 'target', label: 'Goals', svg: <Target {...sceneStroke} /> },
    { id: 'idea', label: 'Idea', svg: <Lightbulb {...sceneStroke} /> },
    { id: 'microscope', label: 'Research', svg: <Microscope {...sceneStroke} /> },
    { id: 'globe', label: 'World', svg: <Globe {...sceneStroke} /> },
    { id: 'robot', label: 'AI', svg: <Bot {...sceneStroke} /> },
    { id: 'tools', label: 'Tools', svg: <Wrench {...sceneStroke} /> },
    { id: 'memo', label: 'Notes', svg: <FileText {...sceneStroke} /> },
  ],
};

const page2: IconPage = {
  id: 'tech-learning-productivity',
  label: 'Tech & Learning',
  icons: [
    { id: 'laptop', label: 'Laptop', svg: <Laptop {...sceneStroke} /> },
    { id: 'phone', label: 'Mobile', svg: <Smartphone {...sceneStroke} /> },
    { id: 'chip', label: 'Chip', svg: <Cpu {...sceneStroke} /> },
    { id: 'wifi', label: 'Network', svg: <Wifi {...sceneStroke} /> },
    { id: 'database', label: 'Storage', svg: <Database {...sceneStroke} /> },
    { id: 'gear', label: 'Settings', svg: <Settings {...sceneStroke} /> },
    { id: 'terminal', label: 'Code', svg: <Terminal {...sceneStroke} /> },
    { id: 'layers', label: 'Stack', svg: <Layers {...sceneStroke} /> },
    { id: 'ruler', label: 'Precision', svg: <Ruler {...sceneStroke} /> },
    { id: 'search', label: 'Search', svg: <Search {...sceneStroke} /> },
  ],
};

const page3: IconPage = {
  id: 'life-goals-creative',
  label: 'Life & Creative',
  icons: [
    { id: 'heart', label: 'Life', svg: <Heart {...sceneStroke} /> },
    { id: 'star', label: 'Vision', svg: <Star {...sceneStroke} /> },
    { id: 'camera', label: 'Memory', svg: <Camera {...sceneStroke} /> },
    { id: 'brush', label: 'Art', svg: <Brush {...sceneStroke} /> },
    { id: 'feather', label: 'Write', svg: <Feather {...sceneStroke} /> },
    { id: 'compass', label: 'Travel', svg: <Compass {...sceneStroke} /> },
    { id: 'home-icon', label: 'Home', svg: <Home {...sceneStroke} /> },
    { id: 'film', label: 'Film', svg: <Film {...sceneStroke} /> },
    { id: 'music', label: 'Music', svg: <Music {...sceneStroke} /> },
    { id: 'clock', label: 'Time', svg: <Clock {...sceneStroke} /> },
    { id: 'lock', label: 'Private', svg: <Lock {...sceneStroke} /> },
    { id: 'cloud', label: 'Cloud', svg: <Cloud {...sceneStroke} /> },
    { id: 'milestone', label: 'Milestone', svg: <Milestone {...sceneStroke} /> },
    { id: 'graduate', label: 'Graduate', svg: <GraduationCap {...sceneStroke} /> },
  ],
};

const page4: IconPage = {
  id: 'people-everyday-life',
  label: 'People & Scenes',
  icons: [
    { id: 'person-desk', label: 'At desk', svg: <PersonDeskIcon /> },
    { id: 'person-beanbag', label: 'On beanbag', svg: <PersonBeanbagIcon /> },
    { id: 'person-writing', label: 'Writing', svg: <PersonWritingIcon /> },
    { id: 'two-people-talking', label: 'Talking', svg: <TwoPeopleTalkingIcon /> },
    { id: 'person-stretching', label: 'Stretching', svg: <PersonStretchingIcon /> },
    { id: 'person-walking', label: 'Walking', svg: <PersonWalkingIcon /> },
    { id: 'person-cooking', label: 'Cooking', svg: <PersonCookingIcon /> },
    { id: 'person-reading', label: 'Reading', svg: <PersonReadingIcon /> },
    { id: 'person-phone', label: 'On phone', svg: <PersonPhoneIcon /> },
    { id: 'person-cycling', label: 'Cycling', svg: <PersonCyclingIcon /> },
    { id: 'person-meditating', label: 'Meditating', svg: <PersonMeditatingIcon /> },
    { id: 'coffee-cup', label: 'Coffee', svg: <CoffeeCupIcon /> },
    { id: 'city-skyline', label: 'City', svg: <CitySkylineIcon /> },
    { id: 'house-garden', label: 'Home', svg: <HouseGardenIcon /> },
  ],
};

const page5: IconPage = {
  id: 'nature-outdoors',
  label: 'Nature & Scenes',
  icons: [
    { id: 'bear-nature', label: 'Bear', svg: <BearNatureIcon /> },
    { id: 'tree-sun', label: 'Nature', svg: <TreeSunIcon /> },
    { id: 'ocean-wave-scene', label: 'Ocean', svg: <OceanWaveSceneIcon /> },
    { id: 'forest-path', label: 'Forest', svg: <ForestPathIcon /> },
  ],
};

const ICON_PAGES: IconPage[] = [page1, page2, page3, page4, page5];
const DEFAULT_ICON_ID = page1.icons[0]?.id ?? 'work';

function IconRenderer({ icon }: { icon: MemoryIcon }) {
  return <>{icon.svg}</>;
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
    const found = pages.findIndex((page) =>
      page.icons.some((icon) => icon.id === selectedIconId)
    );
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">Icon</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">{currentPage.label}</span>
          <div className="flex gap-1">
            <button
              onClick={() => canGoLeft && setPageIndex((prev) => prev - 1)}
              disabled={!canGoLeft}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => canGoRight && setPageIndex((prev) => prev + 1)}
              disabled={!canGoRight}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {currentPage.icons.map((icon) => {
          const selected = icon.id === selectedIconId;
          return (
            <button
              key={icon.id}
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

      <div className="flex justify-center gap-1.5 pt-1">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => setPageIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === pageIndex
                ? 'w-6 bg-neutral-900'
                : 'w-2 bg-neutral-300 hover:bg-neutral-400'
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
  const [errorMessage, setErrorMessage] = useState('');
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
    setErrorMessage('');
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    if (!name.trim() || !selectedIcon) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const payload = {
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon.id,
      };

      let createdSlug: string | null = null;

      if (onCreate) {
        const result = await onCreate(payload);
        createdSlug = result?.slug ?? null;
      } else {
        const res = await fetch('/api/memory-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to create memory');
        }

        createdSlug = data?.slug ?? null;
      }

      closeModal();

      if (createdSlug) {
        router.push(`/memory/${createdSlug}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to create memory', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create memory');
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
        onClick={() => setIsOpen(true)}
        className={
          className ||
          'inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800'
        }
      >
        {triggerLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 sm:py-10">
          <div className="w-full max-w-lg mx-4 my-8 rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-neutral-900">New AI Memory</h2>
              <button
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="memory-name" className="text-sm font-medium text-neutral-500">
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
                <label htmlFor="memory-description" className="text-sm font-medium text-neutral-500">
                  Description <span className="text-neutral-300 font-normal">(optional)</span>
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

              <IconPicker
                pages={ICON_PAGES}
                selectedIconId={selectedIconId}
                onSelect={setSelectedIconId}
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-neutral-200 bg-white px-7 py-4 text-lg font-medium text-neutral-600 transition hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!name.trim() || isSubmitting}
                  className="rounded-2xl bg-neutral-900 px-7 py-4 text-lg font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
