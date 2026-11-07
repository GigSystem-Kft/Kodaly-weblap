import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MUSIC_CHAPTERS} from '../src/data/musicData';
import {ADDITIONAL_LESSONS} from '../src/data/extendedMusicData';
import {COLLECTION_EXAMPLES,collectionPitchCount} from '../src/data/collectionLessonExamples';
import {FIRST_LEDGER_LINE_Y,trebleStaffY} from '../src/utils/trebleStaff';

const expectNames={
 'ton-hangkeszlet':[['biton',2],['triton',3],['tetraton',4],['pentaton',5]],
 'chord-hangkeszlet':[['bichord',2],['trichord',3],['pentachord',5],['hexachord',6]]
} as const;
test('4.1 and 4.2 have four independent, correct-pitch-count sound samples',()=>{
 for(const section of ['ton-hangkeszlet','chord-hangkeszlet'] as const){
  const examples=COLLECTION_EXAMPLES[section];
  assert.deepEqual(examples.map(e=>[e.id,e.pitchCount]),expectNames[section]);
  for(const example of examples){
   assert.equal(collectionPitchCount(example.notes),example.pitchCount,example.id);
   assert.ok(example.notes.length>=example.pitchCount);
   assert.ok(example.notes.every(note=>['C4','D4','E4','F4','G4','A4'].includes(note)));
  }
 }
});
test('4.3 pentaton lessons include five distinct complete pentatonic motifs',()=>{
 const examples=COLLECTION_EXAMPLES['pentaton-gyakorlat'];
 assert.equal(examples.length,5);
 for(const e of examples){
  assert.equal(e.pitchCount,5);
  assert.equal(collectionPitchCount(e.notes),5,e.id);
  assert.deepEqual([...new Set(e.notes)].sort(),['A4','C4','D4','E4','G4']);
 }
 const chapter=ADDITIONAL_LESSONS.hangkeszletek;
 assert.ok(chapter?.some(lesson=>lesson.id==='pentaton-gyakorlat'));
});
test('chapter 4 retains three distinct lesson sections, each with its own visual',()=>{
 const chapter=MUSIC_CHAPTERS.find(c=>c.id==='hangkeszletek');
 assert.ok(chapter);
 assert.deepEqual(chapter.subchapters.map(s=>s.id),['ton-hangkeszlet','chord-hangkeszlet','pentaton-gyakorlat']);
 const detail=readFileSync('src/components/ChapterDetailView.tsx','utf8');
 assert.ok(detail.includes('CollectionLessonVisual'));
 assert.ok(detail.includes("chapter.id === 'hangkeszletek'"));
 assert.ok(!detail.includes("<InteractiveMusicVisual chapterId={chapter.id}/>}\n\n            {/* Az eredeti"));
});
test('note positions are shared with corrected treble staff for all examples',()=>{
 const visual=readFileSync('src/components/CollectionLessonVisual.tsx','utf8');
 assert.match(visual,/trebleStaffY\(note\)/);
 assert.match(visual,/FIRST_LEDGER_LINE_Y/);
 assert.equal(trebleStaffY('C4'),FIRST_LEDGER_LINE_Y);
 assert.equal(trebleStaffY('E4'),99);
 assert.equal(trebleStaffY('A4'),75);
});
