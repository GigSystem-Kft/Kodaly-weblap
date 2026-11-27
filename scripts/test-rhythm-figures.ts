import test from 'node:test';
import assert from 'node:assert/strict';
import { RHYTHM_FIGURES, rhythmFigurePattern } from '../src/utils/rhythmFigures';

test('four teaching rhythm patterns are available',()=>{
 assert.deepEqual(RHYTHM_FIGURES.map(item=>item.id),['nyujtott','eles','szinkopa','triola']);
});
test('single figures fill their own length with no repetition, gaps or overlaps',()=>{
 for(const figure of RHYTHM_FIGURES){
  const pattern=rhythmFigurePattern(figure.id,60);
  const expectedBeats=figure.id==='triola'?1:2;
  assert.equal(pattern.totalSeconds,expectedBeats);
  assert.equal(pattern.figure.lengthBeats,expectedBeats);
  let end=0;
  for(const event of pattern.events){
   assert.ok(Math.abs(event.startBeats-end)<1e-9,figure.title);
   assert.ok(event.durationBeats>0);
   end=event.startBeats+event.durationBeats;
  }
  assert.ok(Math.abs(end-expectedBeats)<1e-9,figure.title);
  assert.deepEqual(pattern.beats.map(x=>x.startSeconds),Array.from({length:expectedBeats},(_,i)=>i));
  assert.equal(pattern.beats.filter(x=>x.accent).length,1);
 }
});
test('dotted and reverse dotted each sound just two notes lasting two beats',()=>{
 assert.deepEqual(rhythmFigurePattern('nyujtott').events.map(x=>x.durationBeats),[1.5,0.5]);
 assert.deepEqual(rhythmFigurePattern('eles').events.map(x=>x.durationBeats),[0.5,1.5]);
});
test('syncopation has three notes, eighth-quarter-eighth, without repeating',()=>{
 assert.deepEqual(rhythmFigurePattern('szinkopa').events.map(x=>x.durationBeats),[0.5,1,0.5]);
});
test('one triplet is three equal notes over exactly one beat',()=>{
 const notes=rhythmFigurePattern('triola').events;
 assert.equal(notes.length,3);
 assert.ok(notes.every(x=>Math.abs(x.durationBeats-1/3)<1e-9));
});
test('tempo scales the figures and metronome together',()=>{
 const triplet=rhythmFigurePattern('triola',120);
 assert.equal(triplet.totalSeconds,0.5);
 assert.deepEqual(triplet.beats.map(x=>x.startSeconds),[0]);
 const sharp=rhythmFigurePattern('eles',120);
 assert.equal(sharp.totalSeconds,1);
 assert.deepEqual(sharp.beats.map(x=>x.startSeconds),[0,0.5]);
 assert.throws(()=>rhythmFigurePattern('triola',0));
});

test('rhythm descriptions agree with the actual single playback length',()=>{
 for(const id of ['nyujtott','eles'] as const){
  const figure=RHYTHM_FIGURES.find(x=>x.id===id)!;
  assert.match(figure.explanation,/Két negyednyi ritmusképlet, egyszer megszólaltatva\./);
  assert.equal(rhythmFigurePattern(id,60).totalSeconds,2);
  assert.equal(rhythmFigurePattern(id,60).events.length,2);
 }
});
