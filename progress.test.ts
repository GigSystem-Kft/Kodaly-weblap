import { loadPendingProgress, recoverPendingProgress, savePendingProgress, clearSavedPendingProgress } from './src/pendingProgress';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyProgress, migrateProgress, recordActivity, consecutiveDays, mergeProgress, mergeConcurrentProgress, recordEarTrainingActivity, shouldRescheduleProgressSync, validStudyDay } from './src/progress';

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

test('calendar validation removes impossible days and malformed score history before server sync', () => {
  assert.equal(validStudyDay('2024-02-29'), true);
  assert.equal(validStudyDay('2026-02-29'), false);
  assert.equal(validStudyDay('2026-02-30'), false);
  assert.equal(validStudyDay('2026-11-08'), true);
  assert.equal(validStudyDay('2026-13-01'), false);
  assert.equal(validStudyDay('2026-11-8'), false);
  assert.equal(validStudyDay('0000-01-01'), false);
  const initial = createEmptyProgress();
  const converted = migrateProgress({
    ...initial,
    xp: 83.75,
    activityDays: ['2026-11-08','2026-02-30','2026-02-29','2024-02-29'],
    earTrainingDailyXp: {'2026-02-30':50,'2026-11-08':25},
    quizAttempts: [
      {id:'consistent',chapterId:'ritmus',score:90,correct:9,total:10,at:'2026-11-08T12:00:00Z'},
      {id:'contradictory',chapterId:'ritmus',score:100,correct:2,total:10,at:'2026-11-08T12:00:00Z'}
    ]
  });
  assert.equal(converted.xp,83);
  assert.deepEqual(converted.activityDays,['2024-02-29','2026-11-08']);
  assert.deepEqual(converted.earTrainingDailyXp,{'2026-11-08':25});
  assert.deepEqual(converted.quizAttempts?.map(q => q.id),['consistent']);
  assert.equal(consecutiveDays(['2026-02-30','2026-11-08'],'2026-11-08'),1);
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

test('quiz practice timing is preserved but rejects invalid or excessive durations',()=>{
 const progress=createEmptyProgress();
 const base={id:'timed-quiz',chapterId:'ritmus',score:80,correct:4,total:5,at:'2026-11-07T20:00:00Z',durationSeconds:95};
 progress.quizAttempts=[base];
 const restored=migrateProgress(progress);
 assert.equal(restored.quizAttempts?.[0]?.durationSeconds,95);
 assert.equal(mergeProgress(restored,createEmptyProgress()).quizAttempts?.[0]?.durationSeconds,95);
 for(const duration of [-1,36001,1.5]){
   const invalid=migrateProgress({...progress,quizAttempts:[{...base,durationSeconds:duration}]});
   assert.equal(invalid.quizAttempts?.length,0);
 }
});

test('glossary starred terms are retained on profile migration and account import',()=>{
  const server=createEmptyProgress();
  server.favoriteExpressions=['term-1'];
  const local=createEmptyProgress();
  local.favoriteExpressions=['term-2'];
  const merged=mergeProgress(server,local);
  assert.deepEqual(merged.favoriteExpressions,['term-1','term-2']);
  assert.deepEqual(migrateProgress(JSON.parse(JSON.stringify(merged))).favoriteExpressions,['term-1','term-2']);
  assert.deepEqual(migrateProgress({...local,favoriteExpressions:undefined}).favoriteExpressions,[]);
});

test('concurrent sync respects local removal while preserving remote additions', () => {
  const base=createEmptyProgress();
  base.favoriteExpressions=['old','keep'];
  const remote=createEmptyProgress();
  remote.favoriteExpressions=['old','keep','remote-added'];
  const local=createEmptyProgress();
  local.favoriteExpressions=['keep','local-added'];
  const result=mergeConcurrentProgress(remote,local,base);
  assert.deepEqual(new Set(result.favoriteExpressions),new Set(['keep','remote-added','local-added']));
  assert.ok(!result.favoriteExpressions?.includes('old'));
});
test('concurrent sync preserves remote favorite removal when local did not edit it', () => {
  const base=createEmptyProgress();
  base.favoriteExpressions=['old','keep'];
  const remote=createEmptyProgress();
  remote.favoriteExpressions=['keep'];
  const local=createEmptyProgress();
  local.favoriteExpressions=['old','keep'];
  assert.deepEqual(mergeConcurrentProgress(remote,local,base).favoriteExpressions,['keep']);
});
test('guest account import still unions favorites without silent deletion', () => {
  const account=createEmptyProgress();
  account.favoriteExpressions=['saved'];
  const guest=createEmptyProgress();
  guest.favoriteExpressions=['local'];
  assert.deepEqual(mergeProgress(account,guest).favoriteExpressions,['saved','local']);
});

test('hearing exercise XP is bounded to 100 per day without losing historical points', () => {
  const day='2026-11-07';
  let progress=createEmptyProgress();
  progress.xp=300;
  progress=recordEarTrainingActivity(progress,25,day);
  progress=recordEarTrainingActivity(progress,80,day);
  assert.equal(progress.xp,400);
  assert.equal(progress.earTrainingDailyXp?.[day],100);
  progress=recordEarTrainingActivity(progress,25,day);
  assert.equal(progress.xp,400);
  const next=recordEarTrainingActivity(progress,25,'2026-11-08');
  assert.equal(next.xp,425);
});
test('daily XP caps survive import and reject forged daily counter shapes', () => {
  const server=createEmptyProgress();
  server.earTrainingDailyXp={'2026-11-07':75};
  const local=createEmptyProgress();
  local.earTrainingDailyXp={'2026-11-07':50,'2026-11-08':25};
  const merged=mergeProgress(server,local);
  assert.deepEqual(merged.earTrainingDailyXp,{'2026-11-07':75,'2026-11-08':25});
  const migrated=migrateProgress({...local,earTrainingDailyXp:{'invalid-date':1000,'2026-11-07':120,'2026-11-08':25}});
  assert.deepEqual(migrated.earTrainingDailyXp,{'2026-11-08':25});
});

test('offline unsaved scores survive a reload only for their own account', () => {
  const cache = new Map<string,string>();
  const storage = {
    getItem: (key:string) => cache.get(key) ?? null,
    setItem: (key:string,value:string) => { cache.set(key,value); },
    removeItem: (key:string) => { cache.delete(key); }
  };
  const base = createEmptyProgress();
  base.quizScores.ritmus = 20;
  const local = migrateProgress(base);
  local.quizScores.ritmus = 90;
  local.favoriteExpressions=['favorite-new'];
  savePendingProgress(storage,'user-A',base,local);
  assert.equal(loadPendingProgress(storage,'user-B'),null);
  const remote=migrateProgress(base);
  remote.quizScores.hangok = 60;
  const restored=recoverPendingProgress(remote,loadPendingProgress(storage,'user-A'));
  assert.equal(restored.quizScores.ritmus,90);
  assert.equal(restored.quizScores.hangok,60);
  assert.deepEqual(restored.favoriteExpressions,['favorite-new']);
  clearSavedPendingProgress(storage,'user-A',base);
  assert.ok(loadPendingProgress(storage,'user-A'));
  clearSavedPendingProgress(storage,'user-A',local);
  assert.equal(loadPendingProgress(storage,'user-A'),null);
});
test('offline favorite removal is honored without deleting remote additions', () => {
  const cache = new Map<string,string>();
  const storage = {getItem:(key:string)=>cache.get(key)??null,setItem:(key:string,value:string)=>{cache.set(key,value);},removeItem:(key:string)=>{cache.delete(key);}};
  const base=createEmptyProgress();base.favoriteExpressions=['keep','remove'];
  const offline=createEmptyProgress();offline.favoriteExpressions=['keep'];
  savePendingProgress(storage,'account',base,offline);
  const remote=createEmptyProgress();remote.favoriteExpressions=['keep','remove','new-device'];
  const restored=recoverPendingProgress(remote,loadPendingProgress(storage,'account'));
  assert.deepEqual(restored.favoriteExpressions,['keep','new-device']);
  assert.equal(loadPendingProgress(storage,'other-account'),null);
});

test('stale account progress writes wake the new account without reusing the old result', () => {
  assert.equal(shouldRescheduleProgressSync(false, 1, 2), true);
  assert.equal(shouldRescheduleProgressSync(true, 1, 1), true);
  assert.equal(shouldRescheduleProgressSync(false, 1, 1), false);
  assert.equal(shouldRescheduleProgressSync(true, 1, 2), true);
});


test('malformed XP rewards cannot corrupt learning totals or daily caps', () => {
  const day = '2026-11-08';
  const starting = createEmptyProgress();
  starting.xp = 55;
  for (const invalid of [NaN, Infinity, -Infinity]) {
    const next = recordActivity(starting, invalid, day);
    assert.equal(next.xp, 55);
    const hearing = recordEarTrainingActivity(starting, invalid, day);
    assert.equal(hearing.xp, 55);
    assert.equal(hearing.earTrainingDailyXp?.[day], 0);
    assert.ok(Number.isFinite(hearing.xp));
  }
  const corrupted = createEmptyProgress();
  corrupted.earTrainingDailyXp = { [day]: NaN };
  const recovered = recordEarTrainingActivity(corrupted, 25, day);
  assert.equal(recovered.earTrainingDailyXp?.[day], 25);
  assert.equal(recovered.xp, 25);
  const negative = recordEarTrainingActivity(starting, -40, day);
  assert.equal(negative.xp, 55);
  assert.equal(negative.earTrainingDailyXp?.[day], 0);
});
