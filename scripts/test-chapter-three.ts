import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MUSIC_CHAPTERS } from '../src/data/musicData';
import { TREBLE_STAFF_LINES,FIRST_LEDGER_LINE_Y,trebleStaffY,DIATONIC_STAFF_ORDER,hasLowerLedgerLine } from '../src/utils/trebleStaff';
import { INTERVAL_EXAMPLES } from '../src/components/IntervalExamplesVisual';
import { ADDITIONAL_QUESTIONS } from '../src/data/extendedMusicData';

test('treble staff puts C prime on first ledger line, and E prime on bottom staff line',()=>{
 assert.equal(FIRST_LEDGER_LINE_Y,TREBLE_STAFF_LINES.at(-1)!+16);
 assert.deepEqual(DIATONIC_STAFF_ORDER.map(trebleStaffY),[115,107,99,91,83,75,67,59]);
 assert.equal(trebleStaffY('E4'),99);
 assert.equal(trebleStaffY('G4'),83);
 assert.ok(hasLowerLedgerLine('C4'));
 assert.ok(!hasLowerLedgerLine('D4'));
});
test('the original pitch diagram uses the shared, corrected staff position',()=>{
 const component=readFileSync('src/components/InteractiveMusicVisual.tsx','utf8');
 assert.match(component,/trebleStaffY\(/);
 assert.match(component,/FIRST_LEDGER_LINE_Y/);
 assert.ok(!component.includes('const y=107-step*8'));
});
test('chapter three contains only merged 3.1 and 3.2, no pentatonic or hexachord selector',()=>{
 const chapter=MUSIC_CHAPTERS.find(c=>c.id==='szolmizacio-hangkozok');
 assert.ok(chapter);
 assert.deepEqual(chapter.subchapters.map(s=>s.id),['szolmizacio-elonyai','hangkoz-fajtak']);
 assert.ok(chapter.subchapters[0].content.join(' ').includes('transzponálás'));
 assert.ok(chapter.subchapters[1].content.join(' ').includes('Hangközfordításkor'));
 const detail=readFileSync('src/components/ChapterDetailView.tsx','utf8');
 assert.match(detail,/SolfegeScaleVisual/);
 assert.match(detail,/IntervalExamplesVisual/);
 assert.match(detail,/chapter.id === 'szolmizacio-hangkozok'/);
});
test('3.2 provides precise selectable pitch examples up to octave',()=>{
 assert.equal(INTERVAL_EXAMPLES.length,13);
 assert.deepEqual(INTERVAL_EXAMPLES.map(i=>i.semitones),Array.from({length:13},(_,i)=>i));
 assert.equal(INTERVAL_EXAMPLES[5].name,'Tiszta kvart (t4)');
 assert.equal(INTERVAL_EXAMPLES[6].semitones,6);
 assert.equal(INTERVAL_EXAMPLES[12].note,'C5');
});

test('staff-reading quiz uses Hungarian octave labels rather than MIDI-style labels',()=>{
 const questions=ADDITIONAL_QUESTIONS.filter(q=>q.chapterId==='hangok-kulcsok'&&/G-kulcs/.test(q.question));
 assert.ok(questions.length>=3,'Staff reading quiz questions missing');
 for(const question of questions){
   const copy=[question.question,...question.options].join(' ');
   assert.doesNotMatch(copy,/\b[A-H][345]\b/,'International octave label shown to students');
 }
 assert.equal(questions[0].options[0],'E′');
 assert.equal(questions[1].options[0],'G′');
 assert.match(questions[2].question,/C′/);
});
