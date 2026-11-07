import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyProgress, migrateProgress, recordActivity, consecutiveDays, mergeProgress } from './src/progress';

test('a new learner starts with zero experience and no fabricated days', () => {
  const progress = createEmptyProgress();
  assert.equal(progress.xp, 0);
  assert.equal(progress.streak, 0);
  assert.deepEqual(progress.activityDays, []);
});

test('legacy progress keeps results but does not trust fabricated streak', () => {
  const previous = { xp: 225, streak: 3, lastActiveDate: '2026-11-03T12:00:00Z',
    completedChapters: ['ritmus'], completedSubchapters: [], quizScores: {ritmus: 70},
    flashcardsMastered: ['f1'], matchingCompleted: [] };
  const migrated = migrateProgress(previous);
  assert.equal(migrated.xp, 225);
  assert.equal(migrated.streak, 0);
  assert.deepEqual(migrated.completedChapters, ['ritmus']);
  assert.deepEqual(migrated.flashcardsMastered, ['f1']);
});

test('activity only counts a study day once', () => {
  const once = recordActivity(createEmptyProgress(), 15, '2026-11-03');
  const twice = recordActivity(once, 0, '2026-11-03');
  assert.equal(twice.activityDays?.length, 1);
  assert.equal(twice.xp, 15);
});

test('streak includes today or yesterday but resets after a gap', () => {
  assert.equal(consecutiveDays(['2026-11-01','2026-11-02','2026-11-03'], '2026-11-04'), 3);
  assert.equal(consecutiveDays(['2026-11-01','2026-11-02','2026-11-03','2026-11-04'], '2026-11-04'), 4);
  assert.equal(consecutiveDays(['2026-11-01'], '2026-11-04'), 0);
});

test('guest import merges achievements instead of overwriting another account', () => {
  const account = createEmptyProgress();
  account.completedChapters = ['ritmus'];
  account.quizScores = {ritmus: 88};
  account.xp = 100;
  const guest = createEmptyProgress();
  guest.completedChapters = ['hangok-kulcsok'];
  guest.quizScores = {ritmus: 60, 'hangok-kulcsok': 95};
  guest.xp = 70;
  const merged = mergeProgress(account, guest);
  assert.deepEqual(merged.completedChapters, ['ritmus', 'hangok-kulcsok']);
  assert.equal(merged.quizScores.ritmus, 88);
  assert.equal(merged.quizScores['hangok-kulcsok'], 95);
  assert.equal(merged.xp, 100);
});

test('matching and subchapter completions survive a legacy-compatible progress merge',()=>{
 const server = createEmptyProgress();
 server.completedSubchapters=['ritmus-1'];
 server.matchingCompleted=['pair-a'];
 server.xp=80;
 const concurrent = createEmptyProgress();
 concurrent.completedSubchapters=['ritmus-2'];
 concurrent.matchingCompleted=['pair-b'];
 concurrent.xp=65;
 const merged=mergeProgress(server,concurrent);
 assert.deepEqual(merged.completedSubchapters,['ritmus-1','ritmus-2']);
 assert.deepEqual(merged.matchingCompleted,['pair-a','pair-b']);
 assert.equal(merged.xp,80);
});
