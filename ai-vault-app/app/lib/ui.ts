// app/lib/ui.ts
// Shared button design tokens used across all action buttons

export const BTN_BASE =
  'inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60';
export const BTN_NEUTRAL = 'border-[#e7e5e4] bg-white text-neutral-700 hover:bg-neutral-50';
export const BTN_GREEN   = 'border-green-300 bg-green-50 text-green-700';
export const BTN_RED     = 'border-red-300 bg-red-50 text-red-700';

export type ActionStatus = 'idle' | 'loading' | 'done' | 'error';

export function btnVariant(status: ActionStatus): string {
  if (status === 'done')  return BTN_GREEN;
  if (status === 'error') return BTN_RED;
  return BTN_NEUTRAL;
}