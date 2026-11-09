/**
 * Release gate: the PHP tutor must contain every student-facing practice
 * item, not just a nonzero sample from each bank.
 *
 * Invoked after export-php-knowledge.ts writes release/api/knowledge.php.
 * No personal user data or external provider calls are involved.
 */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { FLASHCARDS_DATA, QUIZ_QUESTIONS, MATCHING_PAIRS } from '../src/data/musicData';
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
console.log('PHP tutor: all seven packaged student-facing banks match their original data');
