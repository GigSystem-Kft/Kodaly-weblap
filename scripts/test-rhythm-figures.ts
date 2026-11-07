import test from 'node:test';
import assert from 'node:assert/strict';
import { RHYTHM_FIGURES, rhythmFigurePattern } from '../src/utils/rhythmFigures';

test('four teaching rhythm patterns are available',()=>{
 assert.deepEqual(RHYTHM_FIGURES.map(item=>item.id),['nyujtott','eles','szinkopa','triola']);
});
test('every figure fills exactly four quarter-note beats, without gaps or overlaps',()=>{
 for(const figure of RHYTHM_FIGURES){
   const pattern=rhythmFigurePattern(figure.id,60);
   assert.equal(pattern.totalSeconds,4);
   let end=0;
   for(const event of pattern.events){
     assert.ok(Math.abs(event.startBeats-end)<1e-9,figure.title);
     assert.ok(event.durationBeats>0);
     end=event.startBeats+event.durationBeats;
   }
   assert.ok(Math.abs(end-4)<1e-9,figure.title);
   assert.deepEqual(pattern.beats.map(x=>x.startSeconds),[0,1,2,3]);
   assert.equal(pattern.beats.filter(x=>x.accent).length,1);
 }
});
test('dotted and reverse dotted use 1.5 + 0.5 / 0.5 + 1.5 beats',()=>{
 assert.deepEqual(rhythmFigurePattern('nyujtott').events.map(x=>x.durationBeats),[1.5,0.5,1.5,0.5]);
 assert.deepEqual(rhythmFigurePattern('eles').events.map(x=>x.durationBeats),[0.5,1.5,0.5,1.5]);
});
test('syncopation is eighth-quarter-eighth and crosses a beat',()=>{
 assert.deepEqual(rhythmFigurePattern('szinkopa').events.map(x=>x.durationBeats),[0.5,1,0.5,0.5,1,0.5]);
});
test('triplets place three equal notes into each quarter beat',()=>{
 const notes=rhythmFigurePattern('triola').events;
 assert.equal(notes.length,12);
 assert.ok(notes.every(x=>Math.abs(x.durationBeats-1/3)<1e-9));
});
test('tempo scales notation and metronome together',()=>{
 const p=rhythmFigurePattern('triola',120);
 assert.equal(p.totalSeconds,2);
 assert.deepEqual(p.beats.map(x=>x.startSeconds),[0,0.5,1,1.5]);
 assert.throws(()=>rhythmFigurePattern('triola',0));
});
