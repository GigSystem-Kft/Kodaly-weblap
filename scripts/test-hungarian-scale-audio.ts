import { noteFrequencyHz } from '../src/utils/audio';
import test from 'node:test';
import assert from 'node:assert/strict';
import { MUSIC_CHAPTERS } from '../src/data/musicData';
import { C_MAJOR_SCALE_NOTES, hungarianOctaveName, quarterScaleSchedule } from '../src/utils/noteNotation';

test('requested 1.4 rhythm-reading chapter has been removed from lesson navigation', () => {
 const rhythm=MUSIC_CHAPTERS.find(chapter=>chapter.id==='ritmus');
 assert.ok(rhythm);
 assert.ok(!rhythm.subchapters.some(sub=>sub.id==='ritmus-gyakorlatok' || sub.title.startsWith('1.4 ')));
 assert.ok(rhythm.subchapters.some(sub=>sub.id==='ritmus-alapok'));
 assert.ok(rhythm.subchapters.some(sub=>sub.id==='ritmuskepsz'));
});

test('2.1 uses Hungarian octave labels while retaining playable internal note IDs', () => {
 const chapter=MUSIC_CHAPTERS.find(ch=>ch.id==='hangok-kulcsok');
 const sub=chapter?.subchapters.find(s=>s.id==='abszolutm-hangok');
 const example=sub?.examples?.find(e=>e.title==='Alaphangok skála');
 assert.ok(example);
 assert.deepEqual(example.audioNotes,C_MAJOR_SCALE_NOTES);
 assert.equal(example.description,'C′, D′, E′, F′, G′, A′, H′, C″ — mindegyik hang negyed értékben, 60 BPM tempóban.');
 assert.deepEqual(example.audioNotes?.map(hungarianOctaveName),['C′','D′','E′','F′','G′','A′','H′','C″']);
});

test('C major scale plays eight equal quarter notes exactly 60 BPM', () => {
 const schedule=quarterScaleSchedule(C_MAJOR_SCALE_NOTES,60);
 assert.equal(schedule.quarterSeconds,1);
 assert.equal(schedule.totalSeconds,8);
 assert.deepEqual(schedule.notes.map(e=>e.startSeconds),[0,1,2,3,4,5,6,7]);
 assert.ok(schedule.notes.every(e=>e.durationSeconds===1));
 assert.equal(quarterScaleSchedule(C_MAJOR_SCALE_NOTES,120).totalSeconds,4);
 assert.throws(()=>quarterScaleSchedule(C_MAJOR_SCALE_NOTES,0));
});

test('Hungarian B-flat differs from natural H in every supported octave',()=>{
  for(const octave of [3,4,5]){
    const b=noteFrequencyHz('B'+octave);
    const h=noteFrequencyHz('H'+octave);
    const ais=noteFrequencyHz('A#'+octave);
    assert.ok(b && h && ais);
    assert.equal(b,ais,'Hungarian B must equal international B-flat/A-sharp');
    assert.ok(h>b,'H-natural must be higher than B-flat');
    assert.ok(Math.abs(12*Math.log2(h/b)-1)<0.01,'B-to-H must be one semitone');
  }
  assert.equal(noteFrequencyHz('not-a-note'),undefined);
});
