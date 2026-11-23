import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * Release 1.0 UI freeze: the legacy media showcase cards were removed at the
 * owner's request. Keep curated source data available to other consumers,
 * but don't render the standalone showcase. The Tutor AI must stay visible.
 */
const read = (path: string) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('The four lesson views no longer render the curated media showcase', () => {
  for (const path of [
    'src/components/ChapterDetailView.tsx',
    'src/components/MusicPedagogyView.tsx',
    'src/components/CreativeEducationView.tsx',
    'src/components/MusicHistoryView.tsx',
  ]) {
    const source = read(path);
    assert.doesNotMatch(source, /CuratedMediaPanel/, path);
    assert.doesNotMatch(source, /Szemléltető képek és videóforrások/, path);
  }
});

test('Lesson pages do not display the removed audio-example cards', () => {
  const source = read('src/components/ChapterDetailView.tsx');
  assert.doesNotMatch(source, /Szemléltető Példák\s*&\s*Hangzó Anyag/i);
  assert.doesNotMatch(source, /currentSub\.examples\.map\(/);
  assert.doesNotMatch(source, /Példa hangzása/);
});

test('The Tutor AI remains in the application shell', () => {
  const app = read('src/App.tsx');
  const tutor = read('src/components/ChatAssistant.tsx');
  assert.match(app, /<ChatAssistant\s*\/>/);
  assert.match(tutor, /Tanársegéd AI/);
});
