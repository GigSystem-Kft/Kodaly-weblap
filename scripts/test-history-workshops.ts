import test from 'node:test';
import assert from 'node:assert/strict';
import { MUSIC_HISTORY } from '../src/data/musicHistory';
import { HISTORY_WORKSHOPS } from '../src/data/musicHistoryWorkshops';
test('all seven history periods have in-depth study goals, listening tasks and reliable answer keys',()=>{
 assert.equal(HISTORY_WORKSHOPS.length,MUSIC_HISTORY.length);
 assert.deepEqual(HISTORY_WORKSHOPS.map(w=>w.periodId).sort(),MUSIC_HISTORY.map(p=>p.id).sort());
 for(const item of HISTORY_WORKSHOPS){
  assert.ok(item.goals.length>=2);
  assert.ok(item.context.length>=2 && item.context.every(x=>x.length>100));
  assert.ok(item.steps.length>=4);
  assert.ok(item.question.length>20);
  assert.ok(item.modelAnswer.length>50);
  assert.ok(item.furtherPractice.length>30);
 }
});
