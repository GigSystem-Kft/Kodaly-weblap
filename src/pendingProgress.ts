import type { UserProgress } from './types';
import { migrateProgress, mergeConcurrentProgress } from './progress';

// Local offline recovery is scoped to an account id; never import another
// account's unsaved data. This is device-local recovery, not server backup.
const PREFIX = 'kodaly_pending_progress_';
const MAX_BYTES = 1_000_000;
type Pending = { version: 1; ownerId: string; base: UserProgress; local: UserProgress };

export function pendingProgressKey(userId: string): string {
  return PREFIX + encodeURIComponent(userId);
}

export function loadPendingProgress(storage: Pick<Storage,'getItem'>, userId: string): Pending | null {
  try {
    const raw = storage.getItem(pendingProgressKey(userId));
    if (!raw || raw.length > MAX_BYTES) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const data = value as Partial<Pending>;
    if (data.version !== 1 || data.ownerId !== userId ||
        !data.base || !data.local || typeof data.base !== 'object' ||
        typeof data.local !== 'object') return null;
    return {
      version: 1, ownerId: userId,
      base: migrateProgress(data.base), local: migrateProgress(data.local)
    };
  } catch {
    return null;
  }
}

export function recoverPendingProgress(
  server: UserProgress, pending: Pending | null
): UserProgress {
  if (!pending) return server;
  return mergeConcurrentProgress(server, pending.local, pending.base);
}

export function savePendingProgress(
  storage: Pick<Storage,'setItem'>,
  userId: string, base: UserProgress, local: UserProgress
): void {
  const data: Pending = {version: 1, ownerId: userId, base, local};
  const serialized = JSON.stringify(data);
  if (serialized.length > MAX_BYTES) throw new Error('A függőben lévő tanulási mentés túl nagy a helyi tároláshoz.');
  storage.setItem(pendingProgressKey(userId), serialized);
}

export function clearSavedPendingProgress(
  storage: Pick<Storage,'getItem'|'removeItem'>,
  userId: string, saved: UserProgress
): void {
  const pending = loadPendingProgress(storage, userId);
  // Do not drop newer changes made while an asynchronous PUT was in flight.
  if (pending && JSON.stringify(pending.local) === JSON.stringify(saved)) {
    storage.removeItem(pendingProgressKey(userId));
  }
}
