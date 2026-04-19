import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Brain, Rocket, Users, Briefcase, Book, Target, Lightbulb, Microscope, Globe, Bot, Wrench, FileText, Palette, Flame, Zap, Sprout, Trophy, Sparkles, PieChart, Puzzle, Folder, BarChart, Key, Laptop, Smartphone, Cpu, Wifi, Database, Settings, Terminal, Layers, Ruler, Search, Heart, Star, Camera, Brush, Feather, Compass, Home, Film, Music, Clock, Lock, Cloud, Milestone, GraduationCap, Map, Gift, Anchor, Infinity, Activity } from 'lucide-react';

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

// Custom Scene Icons for Page 4 & 5 (Retained from user's latest update)
function PersonDeskIcon() { return <SvgWrap><circle cx="17" cy="12" r="4" {...sceneStroke} /><path d="M12 22c2-4 8-4 10 0l2 5" {...sceneStroke} /><path d="M24 18h10v10H22" {...sceneStroke} /><path d="M8 30h30" {...sceneStroke} /><path d="M14 30v6M30 30v6" {...sceneStroke} /></SvgWrap>; }
function PersonBeanbagIcon() { return <SvgWrap><circle cx="18" cy="12" r="4" {...sceneStroke} /><path d="M10 31c2-7 8-12 17-11 5 1 10 5 11 11-5 4-23 5-28 0Z" {...sceneStroke} /><path d="M17 18l4 5 6 1" {...sceneStroke} /></SvgWrap>; }
function PersonWritingIcon() { return <SvgWrap><circle cx="17" cy="12" r="4" {...sceneStroke} /><path d="M12 23c3-3 8-4 11 0l2 3" {...sceneStroke} /><path d="M24 20h12v12H24" {...sceneStroke} /><path d="M12 32h26" {...sceneStroke} /></SvgWrap>; }
function TwoPeopleTalkingIcon() { return <SvgWrap><circle cx="15" cy="14" r="4" {...sceneStroke} /><circle cx="33" cy="14" r="4" {...sceneStroke} /><path d="M10 26c2-4 8-5 11-1" {...sceneStroke} /><path d="M27 25c3-4 9-3 11 1" {...sceneStroke} /></SvgWrap>; }
function PersonStretchingIcon() { return <SvgWrap><circle cx="24" cy="10" r="4" {...sceneStroke} /><path d="M24 14v11M24 18l-11-6M24 18l11-6M24 25l-8 11M24 25l8 11" {...sceneStroke} /></SvgWrap>; }
function PersonWalkingIcon() { return <SvgWrap><circle cx="20" cy="10" r="4" {...sceneStroke} /><path d="M20 14l5 7 7 1M25 21l-3 7M22 28l-8 8" {...sceneStroke} /></SvgWrap>; }
function PersonCookingIcon() { return <SvgWrap><circle cx="15" cy="11" r="4" {...sceneStroke} /><path d="M10 21c2-3 8-4 11 0l1 3M21 21h14a4 4 0 0 1 0 8H22" {...sceneStroke} /></SvgWrap>; }
function PersonReadingIcon() { return <SvgWrap><circle cx="18" cy="11" r="4" {...sceneStroke} /><path d="M12 23c2-4 8-4 11 0l1 3M21 20c3-2 6-2 9 0v12c-3-2-6-2-9 0Z" {...sceneStroke} /></SvgWrap>; }
function PersonPhoneIcon() { return <SvgWrap><circle cx="18" cy="11" r="4" {...sceneStroke} /><path d="M13 23c2-4 8-4 11 0l1 6" {...sceneStroke} /><rect x="26" y="15" width="8" height="14" rx="2" {...sceneStroke} /></SvgWrap>; }
function PersonCyclingIcon() { return <SvgWrap><circle cx="14" cy="31" r="6" {...sceneStroke} /><circle cx="34" cy="31" r="6" {...sceneStroke} /><circle cx="24" cy="11" r="4" {...sceneStroke} /><path d="M24 15l4 7h6M18 23h10l-6 8" {...sceneStroke} /></SvgWrap>; }
function PersonMeditatingIcon() { return <SvgWrap><circle cx="24" cy="10" r="4" {...sceneStroke} /><path d="M18 22c2-4 10-4 12 0M24 18v8M16 30c2-3 5-4 8-4s6 1 8 4" {...sceneStroke} /></SvgWrap>; }
function CoffeeCupIcon() { return <SvgWrap><path d="M12 18h16v9a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z" {...sceneStroke} /><path d="M28 20h4a4 4 0 0 1 0 8h-3" {...sceneStroke} /></SvgWrap>; }
function CitySkylineIcon() { return <SvgWrap><path d="M8 36h32M11 36V20h6v16M17 36V14h7v22M24 36V18h6v18M30 36V24h7v12" {...sceneStroke} /></SvgWrap>; }
function HouseGardenIcon() { return <SvgWrap><path d="M10 23l14-11 14 11M14 21v15h20V21M21 36V27h6v9" {...sceneStroke} /></SvgWrap>; }
function BearNatureIcon() { return <SvgWrap><circle cx="20" cy="20" r="7" {...sceneStroke} /><path d="M17 22c2 2 4 2 6 0M30 33l3-11 5 5M12 34h24" {...sceneStroke} /></SvgWrap>; }
function TreeSunIcon() { return <SvgWrap><circle cx="34" cy="12" r="5" {...sceneStroke} /><path d="M20 34V23M12 24c0-5 4-9 8-9s8 4 8 9M10 28c0-4 3-7 7-7h6c4 0 7 3 7 7" {...sceneStroke} /></SvgWrap>; }
function OceanWaveSceneIcon() { return <SvgWrap><path d="M8 28c4-5 8-7 12-7 5 0 8 3 9 8 2-2 4-3 7-3 2 0 4 1 4 3 0 4-4 7-12 7H8M14 36h22" {...sceneStroke} /></SvgWrap>; }
function ForestPathIcon() { return <SvgWrap><path d="M8 36c6-8 10-11 16-11s10 3 16 11M12 28l4-8 4 8M28 28l4-8 4 8" {...sceneStroke} /></SvgWrap>; }

const page1: IconPage = {
  id: 'knowledge-work',
  label: 'Knowledge & Work',
  icons: [
    { id: 'brain', label: 'Brain', svg: <Brain className="h-8 w-8 text-neutral-800" /> },
    { id: 'rocket', label: 'Rocket', svg: <Rocket className="h-8 w-8 text-neutral-800" /> },
    { id: 'people', label: 'People', svg: <Users className="h-8 w-8 text-neutral-800" /> },
    { id: 'briefcase', label: 'Work', svg: <Briefcase className="h-8 w-8 text-neutral-800" /> },
    { id: 'books', label: 'Library', svg: <Book className="h-8 w-8 text-neutral-800" /> },
    { id: 'target', label: 'Goals', svg: <Target className="h-8 w-8 text-neutral-800" /> },
    { id: 'idea', label: 'Idea', svg: <Lightbulb className="h-8 w-8 text-neutral-800" /> },
    { id: 'microscope', label: 'Research', svg: <Microscope className="h-8 w-8 text-neutral-800" /> },
    { id: 'globe', label: 'World', svg: <Globe className="h-8 w-8 text-neutral-800" /> },
    { id: 'robot', label: 'AI', svg: <Bot className="h-8 w-8 text-neutral-800" /> },
    { id: 'tools', label: 'Tools', svg: <Wrench className="h-8 w-8 text-neutral-800" /> },
    { id: 'memo', label: 'Notes', svg: <FileText className="h-8 w-8 text-neutral-800" /> },
    { id: 'palette', label: 'Design', svg: <Palette className="h-8 w-8 text-neutral-800" /> },
    { id: 'fire', label: 'Passion', svg: <Flame className="h-8 w-8 text-neutral-800" /> },
    { id: 'lightning', label: 'Energy', svg: <Zap className="h-8 w-8 text-neutral-800" /> },
    { id: 'seedling', label: 'Growth', svg: <Sprout className="h-8 w-8 text-neutral-800" /> },
    { id: 'trophy', label: 'Milestone', svg: <Trophy className="h-8 w-8 text-neutral-800" /> },
    { id: 'chart', label: 'Stats', svg: <BarChart className="h-8 w-8 text-neutral-800" /> },
    { id: 'puzzle', label: 'Problem', svg: <Puzzle className="h-8 w-8 text-neutral-800" /> },
    { id: 'folder', label: 'Archive', svg: <Folder className="h-8 w-8 text-neutral-800" /> },
    { id: 'key', label: 'Access', svg: <Key className="h-8 w-8 text-neutral-800" /> },
  ],
};

const page2: IconPage = {
  id: 'tech-learning-productivity',
  label: 'Tech & Learning',
  icons: [
    { id: 'laptop', label: 'Laptop', svg: <Laptop className="h-8 w-8 text-neutral-800" /> },
    { id: 'phone', label: 'Mobile', svg: <Smartphone className="h-8 w-8 text-neutral-800" /> },
    { id: 'chip', label: 'Chip', svg: <Cpu className="h-8 w-8 text-neutral-800" /> },
    { id: 'wifi', label: 'Network', svg: <Wifi className="h-8 w-8 text-neutral-800" /> },
    { id: 'database', label: 'Storage', svg: <Database className="h-8 w-8 text-neutral-800" /> },
    { id: 'gear', label: 'Settings', svg: <Settings className="h-8 w-8 text-neutral-800" /> },
    { id: 'terminal', label: 'Code', svg: <Terminal className="h-8 w-8 text-neutral-800" /> },
    { id: 'layers', label: 'Stack', svg: <Layers className="h-8 w-8 text-neutral-800" /> },
    { id: 'ruler', label: 'Precision', svg: <Ruler className="h-8 w-8 text-neutral-800" /> },
    { id: 'search', label: 'Search', svg: <Search className="h-8 w-8 text-neutral-800" /> },
  ],
};

const page3: IconPage = {
  id: 'life-goals-creative',
  label: 'Life & Creative',
  icons: [
    { id: 'heart', label: 'Life', svg: <Heart className="h-8 w-8 text-neutral-800" /> },
    { id: 'star', label: 'Vision', svg: <Star className="h-8 w-8 text-neutral-800" /> },
    { id: 'camera', label: 'Memory', svg: <Camera className="h-8 w-8 text-neutral-800" /> },
    { id: 'brush', label: 'Art', svg: <Brush className="h-8 w-8 text-neutral-800" /> },
    { id: 'feather', label: 'Write', svg: <Feather className="h-8 w-8 text-neutral-800" /> },
    { id: 'compass', label: 'Travel', svg: <Compass className="h-8 w-8 text-neutral-800" /> },
    { id: 'home-icon', label: 'Home', svg: <Home className="h-8 w-8 text-neutral-800" /> },
    { id: 'film', label: 'Film', svg: <Film className="h-8 w-8 text-neutral-800" /> },
    { id: 'music', label: 'Music', svg: <Music className="h-8 w-8 text-neutral-800" /> },
    { id: 'clock', label: 'Time', svg: <Clock className="h-8 w-8 text-neutral-800" /> },
    { id: 'lock', label: 'Private', svg: <Lock className="h-8 w-8 text-neutral-800" /> },
    { id: 'cloud', label: 'Cloud', svg: <Cloud className="h-8 w-8 text-neutral-800" /> },
    { id: 'milestone', label: 'Milestone', svg: <Milestone className="h-8 w-8 text-neutral-800" /> },
    { id: 'graduate', label: 'Graduate', svg: <GraduationCap className="h-8 w-8 text-neutral-800" /> },
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

const page6: IconPage = {
  id: 'wellness-hobbies',
  label: 'Wellness & Hobbies',
  icons: [
    { id: 'activity', label: 'Activity', svg: <Activity className="h-8 w-8 text-neutral-800" /> },
    { id: 'map', label: 'Plan', svg: <Map className="h-8 w-8 text-neutral-800" /> },
    { id: 'gift', label: 'Share', svg: <Gift className="h-8 w-8 text-neutral-800" /> },
    { id: 'anchor', label: 'Stable', svg: <Anchor className="h-8 w-8 text-neutral-800" /> },
    { id: 'infinity', label: 'Continuous', svg: <Infinity className="h-8 w-8 text-neutral-800" /> },
    { id: 'sparkles-hobby', label: 'Magic', svg: <Sparkles className="h-8 w-8 text-neutral-800" /> },
  ],
};

const ICON_PAGES: IconPage[] = [page1, page2, page3, page4, page5, page6];
const DEFAULT_ICON_ID = page1.icons[0]?.id ?? 'brain';

function getIconValue(icon: MemoryIcon) {
  return icon.id;
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
                  className="rounded-2xl bg-neutral-900 px-7 py-4 text-lg font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
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
