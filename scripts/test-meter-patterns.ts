import test from 'node:test';
import assert from 'node:assert/strict';
import {MUSIC_CHAPTERS} from '../src/data/musicData';
import {meterPattern,METER_OPTIONS} from '../src/utils/meterPatterns';
import {FOUNDATIONS_SUBCHAPTER_IDS,getFoundationsSubchapterGuide} from '../src/data/musicFoundationsSubchapters';

test('1.5 is merged into 1.3 without losing teaching content',()=>{
 const chapter=MUSIC_CHAPTERS.find(c=>c.id==='ritmus');
 assert.ok(chapter);
 assert.deepEqual(chapter.subchapters.map(s=>s.id),['ritmus-alapok','ritmuskepsz','tempo-utem']);
 assert.ok(!FOUNDATIONS_SUBCHAPTER_IDS.includes('metrum-hangsuly'));
 const merged=chapter.subchapters.find(s=>s.id==='tempo-utem')!;
 const lesson=merged.content.join(' ');
 for(const term of ['tempó','metrum','fősúly','mellékhangsúly','2/4','3/4','4/4','6/8','pontozott negyed']) assert.ok(lesson.toLowerCase().includes(term.toLowerCase()),term);
 assert.equal(getFoundationsSubchapterGuide('ritmus','tempo-utem')?.sections.length,4);
});

test('four meter buttons play exactly two complete bars, all accents correctly ordered',()=>{
 assert.deepEqual(METER_OPTIONS,['2/4','3/4','4/4','6/8']);
 const expected={
  '2/4':['fo','sulytalan'],
  '3/4':['fo','sulytalan','sulytalan'],
  '4/4':['fo','sulytalan','mellek','sulytalan'],
  '6/8':['fo','sulytalan','sulytalan','mellek','sulytalan','sulytalan']
 } as const;
 for(const id of METER_OPTIONS){
  const p=meterPattern(id);
  assert.equal(p.pulses.length,p.pulsesPerBar*2);
  assert.deepEqual(p.pulses.filter(x=>x.bar===0).map(x=>x.accent),expected[id]);
  assert.deepEqual(p.pulses.filter(x=>x.bar===1).map(x=>x.accent),expected[id]);
  assert.equal(p.pulses.at(-1)!.startSeconds+p.pulses.at(-1)!.durationSeconds,p.totalDurationSeconds);
  assert.equal(p.totalDurationSeconds,p.barDurationSeconds*2);
  assert.equal(p.pulses.filter(x=>x.accent==='fo').length,2);
 }
});

test('60 BPM means quarters are 1 second and 6/8 eighths are 0.5 seconds',()=>{
 assert.equal(meterPattern('2/4').totalDurationSeconds,4);
 assert.equal(meterPattern('3/4').totalDurationSeconds,6);
 assert.equal(meterPattern('4/4').totalDurationSeconds,8);
 assert.equal(meterPattern('6/8').totalDurationSeconds,6);
 assert.equal(meterPattern('6/8').pulses[0].durationSeconds,0.5);
 assert.equal(meterPattern('4/4').pulses[0].durationSeconds,1);
 assert.equal(meterPattern('6/8',120).totalDurationSeconds,3);
 assert.throws(()=>meterPattern('2/4',0));
});
