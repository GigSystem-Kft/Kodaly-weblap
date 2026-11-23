import test from 'node:test';
import assert from 'node:assert/strict';
import { EXTENDED_EAR_DRILLS } from '../src/components/ExtendedEarTraining';
import { EAR_CHALLENGES } from '../src/components/EarTrainingView';
import { MAJOR_SCALES, MINOR_SCALES, TRIADS } from '../src/data/tonalExamples';
import { noteFrequencyHz } from '../src/utils/audio';

/**
 * A-20 independent representation agreement:
 * the lesson's playable notes and the ear-training drill cannot teach
 * two different versions of the same named musical structure.
 */
const midiFor = (note: string): number => {
  const hz=noteFrequencyHz(note);
  assert.ok(hz, 'Missing audio frequency for '+note);
  const midi=69+12*Math.log2(hz/440);
  assert.ok(Math.abs(midi-Math.round(midi))<0.001,
    note+' frequency is not a valid tempered semitone');
  return Math.round(midi);
};
const steps=(notes:readonly string[] | readonly number[]) => {
  const values=notes.map(n=>typeof n==='number'?n:midiFor(n));
  return values.slice(1).map((value,i)=>value-values[i]);
};
test('major scales in the textbook and sound identification use identical semitone steps',()=>{
  for (const [name,id] of [['C-dúr','c-major'],['G-dúr','g-major'],['F-dúr','f-major']]) {
    const textbook=MAJOR_SCALES.find(x=>x.name===name);
    const ear=EXTENDED_EAR_DRILLS.hangsor.find(x=>x.id===id);
    assert.ok(textbook && ear?.pitches,name+' missing from one learning module');
    assert.deepEqual(steps(textbook.notes),steps(ear.pitches),name+' has inconsistent semitone steps');
  }
});
test('all three A minor forms agree between chapter lessons and audio ear training',()=>{
  for (const [name,id] of [
    ['Természetes a-moll','a-minor'],
    ['Harmonikus a-moll','a-harm'],
    ['Melodikus a-moll','a-melod']
  ]) {
    const textbook=MINOR_SCALES.find(x=>x.name===name);
    const ear=EXTENDED_EAR_DRILLS.hangsor.find(x=>x.id===id);
    assert.ok(textbook && ear?.pitches,name+' absent');
    // Textbook melodic minor also demonstrates descending natural minor.
    assert.deepEqual(steps(textbook.notes.slice(0,8)),steps(ear.pitches),
      name+' ascent differs between teaching examples');
  }
  const melodic=MINOR_SCALES.find(x=>x.name==='Melodikus a-moll');
  assert.ok(melodic);
  assert.deepEqual(steps(melodic.notes.slice(7)),[-2,-2,-1,-2,-2,-1,-2],
    'Descending melodic minor must return via the natural minor form');
});
test('four named triads have the correct interval qualities and playable frequencies',()=>{
  for (const [name,expected] of [
    ['C-dúr hármashangzat',[4,3]],
    ['c-moll hármashangzat',[3,4]],
    ['C-szűkített hármashangzat',[3,3]],
    ['C-bővített hármashangzat',[4,4]]
  ] as const) {
    const item=TRIADS.find(x=>x.name===name);
    assert.ok(item,name+' missing');
    assert.deepEqual(steps(item.notes),expected,name+' has incorrect chord tones');
    assert.equal(item.notes.length,item.labels.length,name+' mismatched note display labels');
  }
});
test('all twelve named interval aural examples have unambiguous, ascending pitches',()=>{
  assert.equal(EAR_CHALLENGES.length,12);
  for(const item of EAR_CHALLENGES) {
    assert.equal(item.notes.length,2);
    const difference=steps(item.notes)[0];
    assert.ok(difference>=0 && difference<=12,item.title+' invalid semitone span');
    assert.ok(item.description.includes(String(difference)+' félhang'),
      item.title+' explanation does not match sound');
  }
});

test('major and minor scales match independently specified theory, not just one another',()=> {
  const expectedPatterns: { name: string; notes: readonly string[]; expected: number[] }[] = [
    ...MAJOR_SCALES.filter(item=>['C-dúr','G-dúr','F-dúr'].includes(item.name)).map(item=>({
      name:item.name, notes:item.notes.slice(0,8), expected:[2,2,1,2,2,2,1]
    })),
    ...([
      ['Természetes a-moll',[2,1,2,2,1,2,2]],
      ['Harmonikus a-moll',[2,1,2,2,1,3,1]],
      ['Melodikus a-moll',[2,1,2,2,2,2,1]]
    ] as const).map(([name,expected])=>{
      const item=MINOR_SCALES.find(scale=>scale.name===name);
      assert.ok(item,'Missing '+name);
      return {name,notes:item.notes.slice(0,8),expected:[...expected]};
    })
  ];
  assert.equal(expectedPatterns.length,6,'All three major and A-minor variants must be checked');
  for(const {name,notes,expected} of expectedPatterns) {
    assert.equal(notes.length,8,name+' must have eight ascending pitches');
    assert.deepEqual(steps(notes),expected,name+' conflicts with its theoretical interval pattern');
  }
});
