import test from 'node:test';
import assert from 'node:assert/strict';
import {CHROMATIC_STEPS,chromaticTimeline} from '../src/data/chromaticNotes';
import {MUSIC_CHAPTERS} from '../src/data/musicData';

test('chromatic scale has thirteen notes and twelve ascending semitones',()=>{
 assert.equal(CHROMATIC_STEPS.length,13);
 assert.equal(new Set(CHROMATIC_STEPS.map(step=>step.id)).size,13);
 assert.deepEqual(CHROMATIC_STEPS.map(step=>step.note),[
  'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','H4','C5']);
 assert.equal(CHROMATIC_STEPS[0].label,'C′');
 assert.equal(CHROMATIC_STEPS.at(-1)?.label,'C″');
});
test('Hungarian chromatic labels distinguish all enharmonic pairs and H from B',()=>{
 const altered=CHROMATIC_STEPS.filter(step=>step.isAltered);
 assert.deepEqual(altered.map(x=>x.label),[
  'Cisz′ / Desz′','Disz′ / Esz′','Fisz′ / Gesz′','Gisz′ / Asz′','Aisz′ / B′']);
 assert.equal(CHROMATIC_STEPS[11].label,'H′');
 assert.ok(!CHROMATIC_STEPS[11].isAltered);
});
test('60 BPM means thirteen one-second quarter notes with synchronized highlights',()=>{
 const timeline=chromaticTimeline();
 assert.equal(timeline.stepSeconds,1);
 assert.equal(timeline.totalSeconds,13);
 assert.deepEqual(timeline.steps.map(step=>step.startSeconds),
   Array.from({length:13},(_,i)=>i));
 assert.ok(timeline.steps.every(step=>step.durationSeconds===1));
 assert.equal(chromaticTimeline(120).totalSeconds,6.5);
 assert.throws(()=>chromaticTimeline(0));
});
test('chromatic exercise targets the 2.2 modified notes chapter',()=>{
 const chapter=MUSIC_CHAPTERS.find(ch=>ch.id==='hangok-kulcsok');
 assert.ok(chapter?.subchapters.find(s=>s.id==='modositok'));
});
