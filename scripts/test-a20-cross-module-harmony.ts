import test from 'node:test';
import assert from 'node:assert/strict';
import { EXTENDED_EAR_DRILLS, earDrillSchedule } from '../src/components/ExtendedEarTraining';
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

test('the named ear-training intervals match independently defined theoretical semitone values',()=> {
  const expected: Record<string,number> = {
    'Tiszta Prím (t1)':0,
    'Kis Szekund (k2)':1,
    'Nagy Szekund (n2)':2,
    'Kis Terc (k3)':3,
    'Nagy Terc (n3)':4,
    'Tiszta Kvart (t4)':5,
    'Tiszta Kvint (t5)':7,
    'Kis Szext (k6)':8,
    'Nagy Szext (n6)':9,
    'Kis Szeptim (k7)':10,
    'Nagy Szeptim (n7)':11,
    'Tiszta Oktáv (t8)':12
  };
  assert.equal(EAR_CHALLENGES.length,Object.keys(expected).length);
  for (const challenge of EAR_CHALLENGES) {
    assert.ok(Object.hasOwn(expected,challenge.title),'Unexpected interval label '+challenge.title);
    assert.equal(steps(challenge.notes)[0],expected[challenge.title],
      challenge.title+' has a pitch/label disagreement');
    assert.ok(challenge.description.includes(expected[challenge.title]+' félhang'),
      challenge.title+' explanatory text disagrees');
  }
});

test('syncopation, dotted long-short, short-long and triplets have the correct durations at 60 BPM',()=> {
  const checks: {id:string;lengths:number[]}[] = [
    {id:'sync',lengths:[0.5,1,0.5]},
    {id:'pointed',lengths:[1.5,0.5]},
    {id:'reverse',lengths:[0.5,1.5]},
    {id:'triplet',lengths:[1/3,1/3,1/3]}
  ];
  for (const {id,lengths} of checks) {
    const challenge=EXTENDED_EAR_DRILLS.ritmus.find(item=>item.id===id);
    assert.ok(challenge && challenge.lengths,'Missing rhythm '+id);
    assert.equal(challenge.lengths.length,lengths.length,id);
    challenge.lengths.forEach((length,i)=>assert.ok(Math.abs(length-lengths[i])<1e-8,id+' note '+i));
    const rendered=earDrillSchedule(challenge,60);
    let elapsed=0;
    rendered.forEach((item,i)=>{
      assert.ok(Math.abs(item.time-elapsed)<1e-8,id+' onset '+i);
      assert.ok(Math.abs(item.duration-lengths[i]*.91)<1e-8,id+' length '+i);
      elapsed+=lengths[i];
    });
  }
});

test('two 2/4, 3/4, 4/4 and 6/8 measures use the correct beat units at 60 BPM',()=> {
  for (const [id,expectedCount,beatSeconds] of [
    ['2/4',4,1],
    ['3/4',6,1],
    ['4/4',8,1],
    ['6/8',12,.5],
  ] as const) {
    const challenge=EXTENDED_EAR_DRILLS['ütemmutató'].find(item=>item.id===id);
    assert.ok(challenge,id+' exercise is missing');
    const sequence=earDrillSchedule(challenge,60);
    assert.equal(sequence.length,expectedCount,id+' beat count');
    sequence.forEach((item,i)=>assert.ok(Math.abs(item.time-i*beatSeconds)<1e-8,
      id+' beat position '+i));
    assert.equal(sequence[0].accent,1,id+' starts on strong beat');
  }
});
