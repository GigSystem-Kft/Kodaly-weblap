import test from 'node:test';
import assert from 'node:assert/strict';
import { shuffleEarChallenges } from '../src/utils/earTraining';

const intervalIds = Array.from({length: 12}, (_,i) => ({id:i+1}));

test('all 12 intervals appear exactly once in a shuffled round', () => {
 for(let n=0;n<80;n++) {
  const mixed=shuffleEarChallenges(intervalIds);
  assert.equal(mixed.length,12);
  assert.deepEqual(mixed.map(x=>x.id).sort((a,b)=>a-b),intervalIds.map(x=>x.id));
 }
});
test('shuffling cannot simply return the listed ascending challenge sequence', () => {
 const mixed=shuffleEarChallenges(intervalIds,undefined,()=>0.999999);
 assert.notDeepEqual(mixed.map(x=>x.id),intervalIds.map(x=>x.id));
});
test('first challenge in a new round differs from the previous round last challenge', () => {
 for(const previous of [1,5,12]) {
  for(const rng of [()=>0,()=>0.999999,()=>0.45]) {
   assert.notEqual(shuffleEarChallenges(intervalIds,previous,rng)[0].id,previous);
  }
 }
});
test('original challenge list remains unchanged', () => {
 const before=intervalIds.map(x=>x.id);
 shuffleEarChallenges(intervalIds);
 assert.deepEqual(intervalIds.map(x=>x.id),before);
});
