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

test('quiz attempt history survives migration and device merge without duplication', () => {
  const account = createEmptyProgress();
  account.quizScores.ritmus = 90;
  account.quizAttempts = [{id:'a1',chapterId:'ritmus',score:90,correct:9,total:10,at:'2026-11-07T10:00:00.000Z'}];
  const guest = createEmptyProgress();
  guest.quizAttempts = [
    {id:'a1',chapterId:'ritmus',score:90,correct:9,total:10,at:'2026-11-07T10:00:00.000Z'},
    {id:'a2',chapterId:'ritmus',score:80,correct:8,total:10,at:'2026-11-07T11:00:00.000Z'}
  ];
  const merged = mergeProgress(account, guest);
  assert.deepEqual(merged.quizAttempts?.map(a=>a.id), ['a1','a2']);
  assert.equal(merged.quizScores.ritmus,90);
  assert.deepEqual(migrateProgress(JSON.parse(JSON.stringify(merged))).quizAttempts,merged.quizAttempts);
});
test('invalid and overlong quiz history cannot break legacy progress',()=>{
  const progress=createEmptyProgress();
  const raw={...progress, quizAttempts:[
    {id:'invalid',chapterId:'ritmus',score:200,correct:1,total:10,at:'not-a-date'},
    ...Array.from({length:150},(_,n)=>({id:'t'+n,chapterId:'ritmus',score:60,correct:6,total:10,at:'2026-11-07T12:00:00.000Z'}))
  ]};
  const restored=migrateProgress(raw);
  assert.equal(restored.quizAttempts?.length,100);
  assert.ok(restored.quizAttempts?.every(a=>a.score<=100));
});

test('quiz mistake IDs survive account merge, while oversized diagnostics are discarded',()=>{
 const server=createEmptyProgress();
 const attempt={id:'quiz-a',chapterId:'ritmus',score:50,correct:1,total:2,at:'2026-11-07T10:00:00Z',wrongQuestionIds:['q-2']};
 server.quizAttempts=[attempt];
 const guest=createEmptyProgress();
 guest.quizAttempts=[attempt];
 const merged=mergeProgress(server,guest);
 assert.equal(merged.quizAttempts?.length,1);
 assert.deepEqual(migrateProgress(merged).quizAttempts?.[0]?.wrongQuestionIds,['q-2']);
 const bad={...server,quizAttempts:[{...attempt,wrongQuestionIds:Array.from({length:13},(_,i)=>'q-'+i)}]};
 assert.deepEqual(migrateProgress(bad).quizAttempts,[]);
});
