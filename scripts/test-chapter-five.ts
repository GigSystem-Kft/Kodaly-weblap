import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {MUSIC_CHAPTERS} from '../src/data/musicData';
import {ADDITIONAL_LESSONS} from '../src/data/extendedMusicData';
import {MAJOR_SCALES,MINOR_SCALES,TRIADS,C_MAJOR_INVERSIONS,FIFTHS_CIRCLE} from '../src/data/tonalExamples';
import {INTERVAL_EXAMPLES} from '../src/components/IntervalExamplesVisual';

const musicalNames=['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','H4',
 'C5','C#5','D5','D#5','E5','F5','F#5','G5','A3','A#3','H3'];
test('the five requested major keys have coherent printed note names',()=>{
 assert.deepEqual(MAJOR_SCALES.map(x=>x.name),['C-dúr','G-dúr','D-dúr','F-dúr','B-dúr']);
 for(const example of MAJOR_SCALES){
  assert.equal(example.labels.length,8);
  assert.equal(example.notes.length,8);
  assert.ok(example.notes.every(n=>musicalNames.includes(n)),example.name);
 }
 assert.ok(MAJOR_SCALES[3].labels.includes('B′'));
 assert.ok(MAJOR_SCALES[4].labels.includes('Esz′'));
});
test('three minor forms contain correct raised notes and melodic descent',()=>{
 assert.deepEqual(MINOR_SCALES.map(x=>x.name),['Természetes a-moll','Harmonikus a-moll','Melodikus a-moll']);
 assert.equal(MINOR_SCALES[0].notes[6],'G4');
 assert.equal(MINOR_SCALES[1].notes[6],'G#4');
 assert.equal(MINOR_SCALES[2].notes[5],'F#4');
 assert.equal(MINOR_SCALES[2].notes[6],'G#4');
 assert.equal(MINOR_SCALES[2].notes[8],'G4');
 assert.equal(MINOR_SCALES[2].notes.at(-1),'A3');
});
test('four chord qualities and all inversions use exact Hungarian pitch spelling',()=>{
 assert.equal(TRIADS.length,4);
 assert.deepEqual(TRIADS.map(x=>x.notes),[
  ['C4','E4','G4'],['C4','D#4','G4'],['C4','D#4','F#4'],['C4','E4','G#4']]);
 assert.deepEqual(TRIADS[2].labels,['C′','Esz′','Gesz′']);
 assert.deepEqual(C_MAJOR_INVERSIONS.map(x=>x.labels),[
  ['C′','E′','G′'],['E′','G′','C″'],['G′','C″','E″']]);
});
test('new fifth chapter keeps 5.1–5.4, with 5.5 fully merged into 5.3',()=>{
 const ch=MUSIC_CHAPTERS.find(x=>x.id==='hetfoku-hangsorok');
 assert.ok(ch);
 assert.deepEqual(ch.subchapters.map(x=>x.id),['dúr-es-modalis','moll-hangsorok','harmashangzatok','kvintkor']);
 const chord=ch.subchapters[2].content.join(' ');
 assert.match(chord,/szextakkord/i);
 assert.match(chord,/kvartszextakkord/i);
 assert.equal(ADDITIONAL_LESSONS['hetfoku-hangsorok'].some(x=>x.id==='hangzat-forditas'),false);
 assert.ok(!ch.subchapters.some(x=>/5\.5/.test(x.title)));
});
test('Hungarian circle graphic is present, detailed, editable and uses parallel minors',()=>{
 assert.equal(FIFTHS_CIRCLE.length,12);
 assert.ok(existsSync('public/assets/kvintkor-magyar-reszletes.svg'));
 const svg=readFileSync('public/assets/kvintkor-magyar-reszletes.svg','utf8');
 assert.match(svg,/KVINTKÖR/);
 assert.match(svg,/párhuzamos moll/);
 assert.match(svg,/Bék:/);
 const component=readFileSync('src/components/ChapterDetailView.tsx','utf8');
 assert.match(component,/CircleOfFifthsVisual/);
 assert.match(component,/TonalExamplesVisual/);
});
test('intervals present concrete Hungarian upper pitch names',()=>{
 assert.equal(INTERVAL_EXAMPLES[3].upperName,'Esz′');
 assert.equal(INTERVAL_EXAMPLES[5].upperName,'F′');
 assert.equal(INTERVAL_EXAMPLES[10].upperName,'B′');
 assert.equal(INTERVAL_EXAMPLES[12].upperName,'C″');
 const source=readFileSync('src/components/IntervalExamplesVisual.tsx','utf8');
 assert.ok(!source.includes("'Felső hang'"));
});
