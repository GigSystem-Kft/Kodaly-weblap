import test from 'node:test';
import assert from 'node:assert/strict';
import { splitKnowledgeText } from './knowledge-chunks';

test('PHP tutor chunks retain supplementary music notation at the former UTF-16 boundary', () => {
  const original = 'a'.repeat(1199) + '𝄞' + 'b'.repeat(140);
  const chunks = splitKnowledgeText(original);
  assert.ok(chunks.length >= 2, 'the long source must actually be split');
  assert.equal(chunks.join(''), original, 'no character can disappear or be substituted');
  assert.equal(chunks[1].startsWith('𝄞'), true, 'musical G clef remains one Unicode symbol');
  assert.ok(chunks.every(part => !part.includes('\uFFFD')),
    'the exporter must never introduce Unicode replacement glyphs');
  assert.equal(Buffer.from(JSON.stringify(chunks), 'utf8').toString('utf8').includes('𝄞'),
    true, 'the JSON->base64->PHP pipeline retains the notation mark');
});

test('combining Hungarian accents and emoji sequences are not divided between passages', () => {
  const graphemes = ['e\u0301','o\u030B','👩‍🎼','🎶','𝄞','ő','ű'];
  for (const grapheme of graphemes) {
    const original = 'x'.repeat(1199) + grapheme + 'y'.repeat(29);
    const chunks = splitKnowledgeText(original);
    assert.equal(chunks.join(''), original);
    assert.ok(chunks.some(chunk => chunk.includes(grapheme)),
      'one full visible grapheme must be present in one piece: ' + grapheme);
    assert.ok(chunks.every(chunk => !chunk.includes('\uFFFD')));
  }
});

test('short final tails, paragraph whitespace and punctuation survive unchanged', () => {
  const original = 'Tananyag.\n\n' + 'Ritmus és szinkópa; '.repeat(140) +
    '\n\n  Záró mondat 𝄞!  \n';
  const chunks = splitKnowledgeText(original);
  assert.ok(chunks.length > 1);
  assert.equal(chunks.join(''), original, 'all whitespace and trailing source text preserved');
  assert.equal(chunks.at(-1)?.endsWith('Záró mondat 𝄞!  \n'), true);
  assert.deepEqual(splitKnowledgeText(''), []);
  assert.deepEqual(splitKnowledgeText('Ő'), ['Ő']);
  assert.throws(() => splitKnowledgeText('x', 1), RangeError);
});

test('each normal passage contains no more than 1200 Unicode code points', () => {
  const data = 'á🎼ű𝄞'.repeat(1800);
  const chunks = splitKnowledgeText(data);
  assert.equal(chunks.join(''), data);
  assert.ok(chunks.every(chunk => Array.from(chunk).length <= 1200));
  assert.ok(chunks.every(chunk => Buffer.from(chunk, 'utf8').toString('utf8') === chunk));
});
