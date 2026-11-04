import type { UserProgress } from './types';

const DAY_MS = 86_400_000;
export const PROGRESS_KEY = 'kodaly_progress';

export function localDay(date: Date = new Date()): string {
  const year = date.getFullYear();
  return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function dayNumber(value: string): number {
  return Date.parse(value + 'T12:00:00Z') / DAY_MS;
}
export function consecutiveDays(days: string[], now = localDay()): number {
  const set = new Set(days.filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day)));
  const today = dayNumber(now);
  let cursor = set.has(now) ? today : today - 1;
  let count = 0;
  while (set.has(new Date(cursor * DAY_MS).toISOString().slice(0, 10))) {
    count++;
    cursor--;
  }
  return count;
}
export function createEmptyProgress(): UserProgress {
  return {
    completedChapters: [],
    completedSubchapters: [],
    quizScores: {},
    flashcardsMastered: [],
    matchingCompleted: [],
    xp: 0,
    streak: 0,
    lastActiveDate: '',
    activityDays: []
  };
}
export function migrateProgress(raw: unknown): UserProgress {
  const empty = createEmptyProgress();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return empty;
  const value = raw as Partial<UserProgress>;
  const strings = (input: unknown) => Array.isArray(input) ? [...new Set(input.filter((s): s is string => typeof s === 'string'))] : [];
  const scores = value.quizScores && typeof value.quizScores === 'object' && !Array.isArray(value.quizScores)
    ? Object.fromEntries(Object.entries(value.quizScores).filter(([key, v]) => key.length < 120 && typeof v === 'number' && Number.isFinite(v)).map(([key, v]) => [key, Math.min(100, Math.max(0, v))]))
    : {};
  const activityDays = strings(value.activityDays).filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day));
  return {
    completedChapters: strings(value.completedChapters),
    completedSubchapters: strings(value.completedSubchapters),
    quizScores: scores,
    flashcardsMastered: strings(value.flashcardsMastered),
    matchingCompleted: strings(value.matchingCompleted),
    // Historical XP cannot be reconstructed; keep the saved value, but never grant the old default 100 to new users.
    xp: typeof value.xp === 'number' && Number.isFinite(value.xp) ? Math.max(0, value.xp) : 0,
    streak: consecutiveDays(activityDays),
    lastActiveDate: activityDays.at(-1) ?? '',
    activityDays
  };
}
export function recordActivity(progress: UserProgress, amount: number, date = localDay()): UserProgress {
  const days = [...new Set([...(progress.activityDays ?? []), date])].sort();
  return {
    ...progress,
    xp: progress.xp + Math.max(0, amount),
    activityDays: days,
    streak: consecutiveDays(days, date),
    lastActiveDate: date
  };
}
export function readProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return migrateProgress(saved ? JSON.parse(saved) : null);
  } catch {
    return createEmptyProgress();
  }
}
