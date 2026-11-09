import type { UserProgress } from './types';

const DAY_MS = 86_400_000;
export const PROGRESS_KEY = 'kodaly_progress';

/** Recheck pending saves when a stale in-flight request releases the writer lock. */
export function shouldRescheduleProgressSync(
  completedSaveNeedsFollowup: boolean,
  requestGeneration: number,
  activeGeneration: number
): boolean {
  return completedSaveNeedsFollowup || requestGeneration !== activeGeneration;
}

export function localDay(date: Date = new Date()): string {
  const year = date.getFullYear();
  return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
/** A calendar date must exist; the regex alone accepts 2026-02-30. */
export function validStudyDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number(value.slice(0, 4)) < 1) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function dayNumber(value: string): number {
  return Date.parse(value + 'T12:00:00Z') / DAY_MS;
}
export function consecutiveDays(days: string[], now = localDay()): number {
  const set = new Set(days.filter(validStudyDay));
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
    quizAttempts: [],
    flashcardsMastered: [],
    matchingCompleted: [],
    favoriteExpressions: [],
    earTrainingDailyXp: {},
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
  const quizAttempts = Array.isArray(value.quizAttempts)
    ? value.quizAttempts.filter((item): item is NonNullable<UserProgress['quizAttempts']>[number] =>
        !!item && typeof item === 'object' &&
        typeof item.id === 'string' && item.id.length <= 120 &&
        typeof item.chapterId === 'string' && item.chapterId.length <= 120 &&
        typeof item.score === 'number' && Number.isFinite(item.score) && item.score >= 0 && item.score <= 100 &&
        Number.isInteger(item.correct) && Number.isInteger(item.total) &&
        item.total > 0 && item.total <= 1000 && item.correct >= 0 && item.correct <= item.total &&
        typeof item.at === 'string' && !Number.isNaN(Date.parse(item.at)) &&
        Math.abs(item.score - Math.round(item.correct / item.total * 100)) <= 1 &&
        (item.wrongQuestionIds === undefined || (Array.isArray(item.wrongQuestionIds) && item.wrongQuestionIds.length <= 15 && item.wrongQuestionIds.every((id:unknown)=>typeof id === 'string' && id.length <= 120))) &&
        (item.durationSeconds === undefined || (Number.isInteger(item.durationSeconds) && item.durationSeconds >= 0 && item.durationSeconds <= 36_000))
      ).slice(-100)
    : [];
  const earTrainingDailyXp = value.earTrainingDailyXp &&
    typeof value.earTrainingDailyXp === 'object' && !Array.isArray(value.earTrainingDailyXp)
    ? Object.fromEntries(Object.entries(value.earTrainingDailyXp)
        .filter(([day, points]) => validStudyDay(day) &&
          Number.isInteger(points) && (points as number) >= 0 && (points as number) <= 100)
        .sort(([a],[b])=>a.localeCompare(b)).slice(-366))
    : {};
  const activityDays = strings(value.activityDays).filter(validStudyDay).sort();
  return {
    completedChapters: strings(value.completedChapters),
    completedSubchapters: strings(value.completedSubchapters),
    quizScores: scores,
    quizAttempts,
    flashcardsMastered: strings(value.flashcardsMastered),
    matchingCompleted: strings(value.matchingCompleted),
    favoriteExpressions: strings(value.favoriteExpressions).slice(0, 1800),
    earTrainingDailyXp,
    // Historical XP cannot be reconstructed; keep the saved value, but never grant the old default 100 to new users.
    xp: typeof value.xp === 'number' && Number.isFinite(value.xp) ? Math.min(100_000_000, Math.max(0, Math.floor(value.xp))) : 0,
    streak: consecutiveDays(activityDays),
    lastActiveDate: activityDays.at(-1) ?? '',
    activityDays
  };
}
export function recordActivity(progress: UserProgress, amount: number, date = localDay()): UserProgress {
  // A malformed date must never produce a diary entry or an XP reward that
  // would later be rejected by the server's strict calendar validator.
  if (!validStudyDay(date)) return progress;
  const days = [...new Set([...(progress.activityDays ?? []).filter(validStudyDay), date])].sort();
  const previousXp = Number.isFinite(progress.xp) ? Math.max(0, Math.floor(progress.xp)) : 0;
  const earned = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  return {
    ...progress,
    xp: Math.min(100_000_000, previousXp + earned),
    activityDays: days,
    streak: consecutiveDays(days, date),
    lastActiveDate: date
  };
}
/** Prevent unlimited XP farming from replaying the same ear-training challenges. */
export function recordEarTrainingActivity(
  progress: UserProgress,
  amount: number,
  date = localDay()
): UserProgress {
  if (!validStudyDay(date)) return progress;
  const previous = progress.earTrainingDailyXp?.[date] ?? 0;
  const current = Number.isInteger(previous) && previous >= 0 && previous <= 100 ? previous : 0;
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  const earned = Math.min(100 - current, safeAmount);
  const updated = Object.fromEntries(
    Object.entries({ ...(progress.earTrainingDailyXp ?? {}), [date]: current + earned })
      .sort(([a],[b])=>a.localeCompare(b)).slice(-366)
  );
  return recordActivity({ ...progress, earTrainingDailyXp: updated }, earned, date);
}

export function readProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return migrateProgress(saved ? JSON.parse(saved) : null);
  } catch {
    return createEmptyProgress();
  }
}

/** Import guest achievements without deleting achievements already stored in the account. */
export function mergeProgress(account: UserProgress, guest: UserProgress): UserProgress {
  const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];
  const quizScores: Record<string, number> = { ...account.quizScores };
  for (const [chapter, score] of Object.entries(guest.quizScores)) {
    quizScores[chapter] = Math.max(score, quizScores[chapter] ?? 0);
  }
  const days = union(account.activityDays ?? [], guest.activityDays ?? []).sort();
  return {
    ...account,
    completedChapters: union(account.completedChapters, guest.completedChapters),
    completedSubchapters: union(account.completedSubchapters, guest.completedSubchapters),
    quizScores,
    quizAttempts: [...new Map(
      [...(account.quizAttempts ?? []), ...(guest.quizAttempts ?? [])].map(item => [item.id, item])
    ).values()].sort((a, b) => a.at.localeCompare(b.at)).slice(-100),
    flashcardsMastered: union(account.flashcardsMastered, guest.flashcardsMastered),
    matchingCompleted: union(account.matchingCompleted, guest.matchingCompleted),
    favoriteExpressions: union(account.favoriteExpressions ?? [], guest.favoriteExpressions ?? []).slice(0,1800),
    earTrainingDailyXp: Object.fromEntries(
      [...new Set([...Object.keys(account.earTrainingDailyXp ?? {}), ...Object.keys(guest.earTrainingDailyXp ?? {})])]
        .sort().slice(-366)
        .map(day => [day, Math.max(account.earTrainingDailyXp?.[day] ?? 0, guest.earTrainingDailyXp?.[day] ?? 0)])
    ),
    xp: Math.max(account.xp, guest.xp),
    activityDays: days,
    lastActiveDate: days.at(-1) ?? '',
    streak: consecutiveDays(days)
  };
}

/**
 * Three-way conflict resolution for a concurrent account sync.
 * Achievement collections only grow, but glossary favorites can be removed.
 * Preserve additions made by another device while respecting removals made
 * on this device since the last confirmed server snapshot.
 */
export function mergeConcurrentProgress(
  server: UserProgress,
  local: UserProgress,
  base: UserProgress
): UserProgress {
  const merged = mergeProgress(server, local);
  const original = new Set(base.favoriteExpressions ?? []);
  const locallySelected = new Set(local.favoriteExpressions ?? []);
  const locallyRemoved = new Set([...original].filter(id => !locallySelected.has(id)));
  const locallyAdded = [...locallySelected].filter(id => !original.has(id));
  merged.favoriteExpressions = [
    ...new Set([...(server.favoriteExpressions ?? []), ...locallyAdded])
  ].filter(id => !locallyRemoved.has(id)).slice(0, 1800);
  return merged;
}
