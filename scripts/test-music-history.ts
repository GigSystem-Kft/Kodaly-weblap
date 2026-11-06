import assert from 'node:assert/strict';
import test from 'node:test';
import { MUSIC_HISTORY } from '../src/data/musicHistory';
import { COMPOSER_BIOGRAPHIES, GUIDED_LISTENING } from '../src/data/musicHistoryProfiles';
import { PORTRAIT_QUIZZES, PORTRAIT_FLASHCARDS, PORTRAIT_MATCHING } from '../src/data/musicHistoryExerciseBank';

test('music history chapter contains unique sourced eras', () => {
  assert.equal(MUSIC_HISTORY.length, 7);
  assert.equal(new Set(MUSIC_HISTORY.map(item=>item.id)).size, MUSIC_HISTORY.length);
  assert.equal(MUSIC_HISTORY[0].id, 'kezdetek');
  assert.equal(MUSIC_HISTORY[MUSIC_HISTORY.length-1].id, 'huszadik');
  for (const item of MUSIC_HISTORY) {
    assert.ok(item.lead.length > 60, 'each era has a meaningful explanation');
    assert.ok(item.sourceLinks.length >= 1);
    assert.ok(item.sourceLinks.every(link => link.url.startsWith('https://hu.wikipedia.org/wiki/')));
    assert.ok(item.features.length >= 3);
    assert.ok(item.figures.length >= 3);
    assert.ok(item.question && item.example);
  }
});

test('composer biographies and guided listening cover each historical period', () => {
  assert.equal(COMPOSER_BIOGRAPHIES.length, 7);
  assert.equal(GUIDED_LISTENING.length, 7);
  assert.equal(PORTRAIT_QUIZZES.length, 14);
  assert.equal(PORTRAIT_FLASHCARDS.length, 7);
  assert.equal(PORTRAIT_MATCHING.length, 7);
  const periods = MUSIC_HISTORY.map(p=>p.id);
  assert.deepEqual([...new Set(COMPOSER_BIOGRAPHIES.map(p=>p.periodId))].sort(),[...periods].sort());
  assert.deepEqual([...new Set(GUIDED_LISTENING.map(p=>p.periodId))].sort(),[...periods].sort());
  for (const person of COMPOSER_BIOGRAPHIES) {
    assert.ok(person.significance.length > 110);
    assert.ok(person.sourceUrl.startsWith('https://hu.wikipedia.org/wiki/'));
  }
  for (const study of GUIDED_LISTENING) {
    assert.equal(study.during.length, 3);
    assert.ok(study.before && study.after && study.sampleAnswer && study.sourceUrl);
  }
  for (const question of PORTRAIT_QUIZZES) {
    assert.equal(question.options.length,4);
    assert.equal(new Set(question.options).size,4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.chapterId,'zenetortenet');
  }
});
