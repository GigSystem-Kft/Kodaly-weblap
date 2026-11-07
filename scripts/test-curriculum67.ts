import assert from 'node:assert/strict';
import test from 'node:test';
import { FLASHCARDS_DATA, MATCHING_PAIRS, QUIZ_QUESTIONS } from '../src/data/musicData';
import { NEW_FLASHCARDS, NEW_MATCHING, NEW_QUIZZES } from '../src/data/curriculum67Practice';

test('additive chapter 6/7 exercise banks are complete and have unique IDs', () => {
  assert.equal(NEW_FLASHCARDS.length, 30);
  assert.equal(NEW_MATCHING.length, 24);
  assert.equal(NEW_QUIZZES.length, 24);
  for (const bank of [FLASHCARDS_DATA, MATCHING_PAIRS, QUIZ_QUESTIONS]) {
    assert.equal(new Set(bank.map(x => x.id)).size, bank.length, 'exercise IDs are unique');
  }
  for (const label of ['Kreatív zenei nevelés','Zenetörténet']) {
    assert.ok(NEW_FLASHCARDS.some(f=>f.category===label));
    assert.ok(NEW_MATCHING.some(m=>m.category===label));
  }
  for (const [index, question] of NEW_QUIZZES.entries()) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.correctIndex, index % 4);
    assert.ok(question.options[question.correctIndex].length >= 4);
    assert.ok(question.explanation.length > 30);
    assert.ok(['kreativ', 'zenetortenet'].includes(question.chapterId));
  }
});
