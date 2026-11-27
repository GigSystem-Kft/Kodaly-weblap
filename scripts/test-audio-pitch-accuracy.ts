import test from 'node:test';
import assert from 'node:assert/strict';
import { noteFrequencyHz } from '../src/utils/audio';
import { EAR_CHALLENGES } from '../src/components/EarTrainingView';

const semitoneFromA: Record<string,number> = {
  C:-9,'C#':-8,D:-7,'D#':-6,E:-5,F:-4,'F#':-3,
  G:-2,'G#':-1,A:0,'A#':1,B:1,H:2
};
test('all available audio notes match A4=440Hz 12-tone equal temperament', () => {
  let tested=0;
  for (let octave=3; octave<=5; octave++) {
    for (const [name, semitones] of Object.entries(semitoneFromA)) {
      const key=name+octave;
      const actual=noteFrequencyHz(key);
      if(actual===undefined) continue;
      const expected=440*Math.pow(2,((octave-4)*12+semitones)/12);
      assert.ok(Math.abs(actual-expected)<0.08,
        `${key} is ${actual} Hz, expected ${expected.toFixed(2)} Hz`);
      tested++;
    }
  }
  assert.ok(tested>=39,'Unexpectedly few pitch entries checked');
});
test('Hungarian B is Bb and H is international B-natural in every supported octave',()=>{
  for (const octave of [3,4,5]) {
    assert.equal(noteFrequencyHz('B'+octave),noteFrequencyHz('A#'+octave));
    assert.ok((noteFrequencyHz('H'+octave)??0)>(noteFrequencyHz('B'+octave)??0));
  }
});

test('ear-training named intervals produce their actual announced semitone distance',()=>{
  const expected: Record<string,number> = {
    t1:0,k2:1,n2:2,k3:3,n3:4,t4:5,t5:7,k6:8,n6:9,k7:10,n7:11,t8:12
  };
  assert.equal(EAR_CHALLENGES.length,12);
  for (const challenge of EAR_CHALLENGES) {
    const match=challenge.title.match(/\(([tnk]\d)\)/);
    assert.ok(match,'Unknown interval label: '+challenge.title);
    const code=match[1];
    const base=noteFrequencyHz(challenge.notes[0]);
    const target=noteFrequencyHz(challenge.notes[1]);
    assert.ok(base && target,'Missing audio note for '+challenge.title);
    const semitones=Math.round(12*Math.log2(target/base));
    assert.equal(semitones,expected[code],
      `${challenge.title}: heard ${semitones} semitones, description says ${expected[code]}`);
  }
});
