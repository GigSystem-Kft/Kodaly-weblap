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

test('metronome has exactly four quarter beats aligned to a 60 BPM measure',()=>{
 for(const divisions of RHYTHM_SUBDIVISIONS){
  const p=rhythmPattern(divisions,60);
  assert.deepEqual(p.beats.map(beat=>beat.startSeconds),[0,1,2,3]);
  assert.equal(p.beats.filter(beat=>beat.accent).length,1);
  assert.equal(p.beats[0].accent,true);
  assert.ok(p.beats.slice(1).every(beat=>!beat.accent));
  assert.equal(p.beats.length,4);
 }
});
test('changing tempo moves both notes and metronome on the same timeline',()=>{
 const p=rhythmPattern(8,120);
 assert.deepEqual(p.beats.map(beat=>beat.startSeconds),[0,0.5,1,1.5]);
 assert.equal(p.notes.at(-1)!.startSeconds+p.notes.at(-1)!.durationSeconds,2);
});
