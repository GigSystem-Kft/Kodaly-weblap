import test from 'node:test';
import assert from 'node:assert/strict';
import { quizPracticeTrends } from '../src/quizAnalytics';
import { createEmptyProgress } from '../src/progress';

test('practice improvement requires six rounds in the same chapter',()=>{
  const progress=createEmptyProgress();
  progress.quizAttempts=[20,30,40,60,80,90].map((score,i)=>({
    id:`lesson-${i}`,chapterId:'ritmus',score,
    correct:score/10,total:10,at:`2026-11-0${i+1}T10:00:00.000Z`
  }));
  const result=quizPracticeTrends(progress)[0];
  assert.equal(result.attempts,6);
  assert.equal(result.priorAverage,30);
  assert.equal(result.recentAverage,77);
  assert.equal(result.change,47);
  assert.equal(result.latestScore,90);
});
test('mixed-topic attempts do not contaminate a chapter trend',()=>{
  const progress=createEmptyProgress();
  progress.quizAttempts=[
    ...[1,2,3].map(i=>({id:`rhythm-${i}`,chapterId:'ritmus',score:50,
      correct:1,total:2,at:`2026-11-0${i}T10:00:00Z`})),
    ...[1,2,3,4,5,6].map(i=>({id:`mixed-${i}`,chapterId:'vegyes-gyakorlas',score:80,
      correct:4,total:5,at:`2026-11-0${i}T11:00:00Z`}))
  ];
  const result=quizPracticeTrends(progress);
  assert.equal(result.find(item=>item.chapterId==='ritmus')?.change,null);
  assert.equal(result.find(item=>item.chapterId==='vegyes-gyakorlas')?.change,0);
});
test('latest three incomplete rounds remain descriptive only',()=>{
  const progress=createEmptyProgress();
  progress.quizAttempts=[95,75].map((score,i)=>({
    id:`t-${i}`,chapterId:'hangkeszletek',score,correct:1,total:1,
    at:`2026-11-0${i+1}T10:00:00Z`
  }));
  const result=quizPracticeTrends(progress)[0];
  assert.equal(result.priorAverage,null);
  assert.equal(result.change,null);
  assert.equal(result.recentAverage,85);
});
