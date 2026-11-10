/**
 * Release gate: the PHP tutor must contain every student-facing practice
 * item, not just a nonzero sample from each bank.
 *
 * Invoked after export-php-knowledge.ts writes release/api/knowledge.php.
 * No personal user data or external provider calls are involved.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { MUSIC_CHAPTERS, FLASHCARDS_DATA, QUIZ_QUESTIONS, MATCHING_PAIRS } from '../src/data/musicData';
import { MAJOR_SCALES, MINOR_SCALES, TRIADS, C_MAJOR_INVERSIONS, FIFTHS_CIRCLE } from '../src/data/tonalExamples';
import { COLLECTION_EXAMPLES } from '../src/data/collectionLessonExamples';
import MUSIC_EXPRESSIONS from '../src/data/musicExpressions.json';

type Entry = { source: string; label: string; text: string };
const file = process.argv[2] || 'release/api/knowledge.php';
const raw = readFileSync(file, 'utf8');
const encoded = raw.match(/base64_decode\('([A-Za-z0-9+/=]+)'\)/)?.[1];
assert.ok(encoded, 'PHP release knowledge index has no embedded base64 data');
const decoded: unknown = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
assert.ok(Array.isArray(decoded), 'PHP knowledge index must decode into an array');
const entries = decoded as Entry[];

function assertBank(source: string, expected: Array<{label:string;text:string}>) {
  assert.ok(expected.length > 0, source + ': source dataset unexpectedly empty');
  const actual = entries.filter(e => e.source === source)
    .map(e => JSON.stringify([e.label, e.text])).sort();
  const wanted = expected.map(e => JSON.stringify([e.label, e.text])).sort();
  assert.deepEqual(actual, wanted,
    source + ': a source item is missing, modified, duplicated or not imported in the PHP tutor');
  console.log(source + ': ' + actual.length + '/' + wanted.length + ' complete');
}

assertBank('Zeneelméleti Műhely – Szókártyák',
  FLASHCARDS_DATA.map(card => ({
    label: card.category + ' / ' + card.term,
    text: card.term + ' – ' + card.definition
  }))
);
assertBank('Zeneelméleti Műhely – Teszt',
  QUIZ_QUESTIONS.map(quiz => ({
    label: quiz.chapterId + ' / ' + quiz.id,
    text: quiz.question + '\nHelyes válasz: ' +
      (quiz.options[quiz.correctIndex] ?? '') + '\n' + (quiz.explanation ?? '')
  }))
);
assertBank('Zeneelméleti Műhely – Párosító',
  MATCHING_PAIRS.map(pair => ({
    label: pair.category + ' / ' + pair.term,
    text: pair.term + ' – ' + pair.match
  }))
);
assertBank('Zeneelméleti Műhely – Hangzó hangsor és akkord',
  [...MAJOR_SCALES, ...MINOR_SCALES, ...TRIADS, ...C_MAJOR_INVERSIONS].map(sound => ({
    label: sound.name,
    text: [sound.name, sound.labels.join(' – '), sound.description].join('\n')
  }))
);
assertBank('Zeneelméleti Műhely – Hangkészletek és pentaton példák',
  Object.values(COLLECTION_EXAMPLES).flat().map(example => ({
    label: example.title,
    text: [example.title, example.solfege, example.description,
      example.notes.join(', ')].join('\n')
  }))
);
assertBank('Zeneelméleti Műhely – Kvintkör',
  FIFTHS_CIRCLE.map(item => ({
    label: 'Kvintkör / ' + item.major + '-dúr / ' + item.minor + '-moll',
    text: item.major + '-dúr párhuzamos ' + item.minor + '-moll; ' +
      Math.abs(item.accidentals) + ' ' +
      (item.accidentals > 0 ? 'kereszt' :
        item.accidentals < 0 ? 'bé' : 'előjegyzés nélküli hangnem')
  }))
);

// The entire 09. glossary must remain intact, not merely 1,793 labels.
assert.equal(MUSIC_EXPRESSIONS.length, 1793);
assertBank('Zenei kifejezések – mellékelt, nem minden címszóban lektorált teljes szótár',
  MUSIC_EXPRESSIONS.map(item => ({
    label: '09. Zenei kifejezések / ' + item.category + ' / ' + item.term +
      ' / eredeti ' + item.line + '. sor',
    text: item.term + ' – ' + item.definition
  }))
);


// A-08: prove that the PHP tutor includes the full visible student lesson
// (not just the first 5,000 UTF-16 code units, and not omitting notation
// examples, audio demonstrations or cited quotations).
let verifiedLessons=0;
for (const chapter of MUSIC_CHAPTERS) {
  for (const sub of chapter.subchapters) {
    const body=[
      sub.summary, ...sub.content,
      ...(sub.examples??[]).flatMap(example=>[
        example.title, example.description, ...(example.notes??[]),
        ...(example.audioNotes??[])
      ]),
      ...(sub.quotes??[]).map(q=>q.text+' – '+q.source)
    ].filter(Boolean).join('\n\n');
    if (body.length<=12) continue;
    const label=chapter.title+' / '+sub.title;
    const pieces=entries.filter(entry=>
      entry.source==='Zeneelméleti Műhely – Tananyag' &&
      (entry.label===label || entry.label.startsWith(label+' / ')));
    assert.ok(pieces.length>0, label+': lesson missing from PHP tutor');
    assert.equal(pieces[0].label,label, label+': opening lesson passage changed');
    pieces.slice(1).forEach((entry,index)=>
      assert.equal(entry.label,label+' / '+(index+2)+'. részlet',
        label+': source part labels are not sequential'));
    assert.equal(pieces.map(entry=>entry.text).join(''),body,
      label+': full student-facing lesson, examples or quotations were truncated');
    verifiedLessons++;
  }
}
assert.ok(verifiedLessons>0,'No curriculum lesson was verified');
console.log('PHP tutor: '+verifiedLessons+' complete student-facing lessons and examples verified');

// A-08: source-derived text should be lossless, not merely present as a few
// searchable snippets. The old UTF-16 slicing could corrupt 𝄞/emoji and
// silently discarded short final pieces; the older lesson exporter also
// truncated everything after its first 5,000 code units.
const sourceRoot = resolve('server-data');
const documents = [{file:'jegyzet.txt',label:'Bartáné Góhér Edit – egyetemi jegyzet'}];
const sourceFolder = join(sourceRoot,'forrasok');
if (existsSync(sourceFolder)) {
  for (const fileName of readdirSync(sourceFolder)
    .filter(x=>/\.(txt|md)$/i.test(x) && !x.startsWith('_') &&
      !/kesztler[-_ ]zenei[-_ ]alapismeretek/i.test(x))) {
    documents.push({file:'forrasok/'+fileName,label:fileName});
  }
}
let verifiedSourcePages = 0;
for (const document of documents) {
  const path = join(sourceRoot,document.file);
  if (!existsSync(path)) continue;
  const rawText = readFileSync(path,'utf8');
  const pageRegex = /(?:^===\s*\[OLDAL\s+(\d+)\][^\n]*===\s*$)|(?:^---\s*(\d+)\.\s*oldal\s*---\s*$)/gim;
  const boundaries=[...rawText.matchAll(pageRegex)];
  const pages = boundaries.length ? boundaries.map((match,index)=>({
    label:(match[1] ?? match[2])+'. oldal',
    text:rawText.slice(match.index!+match[0].length, boundaries[index+1]?.index ?? rawText.length)
  })) : [{label:'forrásrészlet',text:rawText}];
  const expected = new Map<string,string>();
  for (const page of pages) {
    if (!page.text) continue;
    expected.set(page.label,(expected.get(page.label)??'')+page.text);
  }
  const actual = new Map<string,string>();
  for (const passage of entries.filter(e=>e.source===document.label)) {
    actual.set(passage.label,(actual.get(passage.label)??'')+passage.text);
  }
  assert.deepEqual([...actual.entries()].sort(),[...expected.entries()].sort(),
    document.file+': the PHP index dropped or modified source text or its page attribution');
  verifiedSourcePages += expected.size;
}
console.log('PHP tutor: '+verifiedSourcePages+
  ' teacher-source page groups match original UTF-8 text byte-for-byte');

console.log('PHP tutor: all seven packaged student-facing banks match their original data');
