import test from 'node:test';
import assert from 'node:assert/strict';
import { RHYTHM_SUBDIVISIONS, rhythmPattern } from '../src/utils/rhythmPattern';

test('all note values last four quarter-note beats at 60 BPM',()=>{
 for(const divisions of RHYTHM_SUBDIVISIONS){
  const result=rhythmPattern(divisions,60);
  assert.equal(result.totalSeconds,4);
  assert.equal(result.notes.length,divisions);
  assert.equal(result.noteSeconds,4/divisions);
  assert.equal(result.notes[0].startSeconds,0);
  assert.equal(result.notes.at(-1)!.startSeconds+result.notes.at(-1)!.durationSeconds,4);
  result.notes.forEach((note,i)=>{
   assert.equal(note.startSeconds,i*4/divisions);
   assert.equal(note.durationSeconds,4/divisions);
  });
 }
});
test('whole/half/quarter/eighth/sixteenth durations are 4/2/1/0.5/0.25 seconds',()=>{
 assert.deepEqual(RHYTHM_SUBDIVISIONS.map(n=>rhythmPattern(n).noteSeconds),[4,2,1,0.5,0.25]);
});
test('tempo changes preserve four beats',()=>{
 assert.equal(rhythmPattern(8,120).totalSeconds,2);
 assert.equal(rhythmPattern(16,80).totalSeconds,3);
 assert.throws(()=>rhythmPattern(4,0));
});
