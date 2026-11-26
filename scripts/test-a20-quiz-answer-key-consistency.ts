import test from 'node:test';
import assert from 'node:assert/strict';
import { QUIZ_QUESTIONS } from '../src/data/musicData';
import {
  THEORY_DRILLS, THEORY_FLASHCARDS, THEORY_MATCHING, THEORY_QUIZZES,
  EXPRESSION_FLASHCARDS, EXPRESSION_MATCHING, EXPRESSION_QUIZZES,
} from '../src/data/musicExpressionsPractice';

/**
 * A-20: validate real quiz ANSWER KEYS against the independently exported
 * study cards and matching definitions; structural answer-index checks alone
 * cannot catch a swapped correctIndex that still points to a valid option.
 * This is a technical cross-bank check, not independent music proofreading.
 */
const normalize = (value: string) =>
  value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('hu-HU');

test('every theoretical exercise grades its own card and matching definition as correct', () => {
  assert.ok(THEORY_DRILLS.length >= 30, 'Core theory drills unexpectedly incomplete');
  assert.equal(THEORY_QUIZZES.length, THEORY_DRILLS.length);
  assert.equal(THEORY_FLASHCARDS.length, THEORY_DRILLS.length);
  assert.equal(THEORY_MATCHING.length, THEORY_DRILLS.length);
  const flash = new Map(THEORY_FLASHCARDS.map(card => [card.id, card]));
  const matching = new Map(THEORY_MATCHING.map(pair => [pair.id, pair]));
  const questions = new Map(THEORY_QUIZZES.map(question => [question.id, question]));
  assert.equal(questions.size, THEORY_DRILLS.length, 'Duplicate theory question IDs');
  for (const item of THEORY_DRILLS) {
    const question = questions.get('drill-q-' + item.id);
    const card = flash.get('drill-f-' + item.id);
    const pair = matching.get('drill-m-' + item.id);
    assert.ok(question && card && pair, 'Incomplete practice triple: ' + item.id);
    assert.equal(question.options.length, 4, 'Expected four options for ' + item.id);
    assert.equal(normalize(question.options[question.correctIndex]),
      normalize(item.meaning), 'Wrong keyed theory answer: ' + item.id);
    assert.equal(normalize(card.definition), normalize(item.meaning),
      'Theory flashcard disagrees: ' + item.id);
    assert.equal(normalize(pair.match), normalize(item.meaning),
      'Theory matching definition disagrees: ' + item.id);
    assert.ok(question.explanation.includes(item.why),
      'Theory explanation drops source reasoning: ' + item.id);
  }
});

test('every generated expression quiz has the same keyed meaning as its study card and matching pair', () => {
  assert.ok(EXPRESSION_QUIZZES.length >= 100,
    'Expression study question bank unexpectedly reduced');
  const flash = new Map(EXPRESSION_FLASHCARDS.map(card => [card.id, card]));
  const matching = new Map(EXPRESSION_MATCHING.map(pair => [pair.id, pair]));
  for (const question of EXPRESSION_QUIZZES) {
    assert.ok(question.id.startsWith('expr-q-'), question.id);
    const suffix = question.id.slice('expr-q-'.length);
    const card = flash.get('expr-fl-' + suffix);
    const pair = matching.get('expr-m-' + suffix);
    assert.ok(card && pair, 'Expression quiz has no study source: ' + question.id);
    assert.equal(question.options.length, 4, 'Not four options: ' + question.id);
    assert.equal(normalize(question.options[question.correctIndex]),
      normalize(card.definition), 'Expression answer disagrees with card: ' + question.id);
    assert.equal(normalize(card.definition), normalize(pair.match),
      'Expression matching card differs: ' + question.id);
    assert.ok(question.explanation.includes(card.term),
      'Expression explanation does not identify term: ' + question.id);
  }
});

test('shuffled copies of an identical question and answer set never disagree on the keyed answer', () => {
  // Existing release tests compared the displayed option order. This also
  // protects shuffles and source-bank duplicates that use another ordering.
  const seen = new Map<string, { id: string; answer: string }>();
  for (const q of QUIZ_QUESTIONS) {
    const choices = q.options.map(normalize).sort();
    const key = JSON.stringify([normalize(q.question), choices]);
    const answer = normalize(q.options[q.correctIndex]);
    const previous = seen.get(key);
    if (previous) {
      assert.equal(answer, previous.answer,
        'Conflicting answer key after option shuffle: ' + previous.id + ' / ' + q.id);
    } else {
      seen.set(key, { id: q.id, answer });
    }
  }
});

test('independent A-20 rhythm and meter facts are keyed consistently across theory quiz bank', () => {
  // These are independently established music-theory facts, not compared to a
  // second copy of the same original data.
  const facts: Record<string, string> = {
    'met-24': 'Két negyednyi ütem, egy súlyos és egy súlytalan negyed',
    'met-34': 'Három negyednyi ütem; első negyed súlyos, két további súlytalan',
    'met-68': 'Hat nyolcad, általában két háromnyolcados lüktetési csoport',
    'rhythm-sync': 'Nyolcad–negyed–nyolcad a kétnegyedes alapmintában',
    'rhythm-pointed': 'Pontozott negyed és nyolcad két negyed időtartamban',
    'rhythm-reverse': 'Nyolcad és pontozott negyed két negyed időtartamban',
    'rhythm-trip': 'Három egyenlő részre osztott negyedérték',
    'scale-harm': 'A természetes moll VII. fokát felemeljük',
    'scale-melod': 'Felfelé emelt VI. és VII. fok; lefelé rendszerint természetes moll',
    'key-g': 'Egy kereszt: Fisz',
    'key-d': 'Két kereszt: Fisz és Cisz',
    'key-f': 'Egy bé: B',
  };
  const lookup = new Map(THEORY_QUIZZES.map(q => [q.id, q]));
  for (const [id, correct] of Object.entries(facts)) {
    const q = lookup.get('drill-q-' + id);
    assert.ok(q, 'Known music topic missing: ' + id);
    assert.equal(normalize(q.options[q.correctIndex]), normalize(correct),
      'A-20 factual discrepancy in ' + id);
  }
});
