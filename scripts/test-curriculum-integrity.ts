import test from 'node:test';
import assert from 'node:assert/strict';
import { MUSIC_CHAPTERS, QUIZ_QUESTIONS, MATCHING_PAIRS, FLASHCARDS_DATA } from '../src/data/musicData';
import { EXTRA_LEARNING_MODULES } from '../src/data/learningProgressSummary';

const unique = (ids: string[], label: string) => {
  assert.equal(new Set(ids).size, ids.length, `Duplicate ${label} IDs found`);
};

test('curriculum has distinct chapter and subchapter IDs with substantive content', () => {
  assert.equal(MUSIC_CHAPTERS.length + EXTRA_LEARNING_MODULES.length, 9);
  unique(MUSIC_CHAPTERS.map(ch => ch.id), 'chapter');
  const subchapters = MUSIC_CHAPTERS.flatMap(ch => ch.subchapters);
  unique(subchapters.map(sub => sub.id), 'subchapter');
  for (const sub of subchapters) {
    assert.ok(sub.title.trim() && sub.summary.trim(), `Missing subchapter text ${sub.id}`);
    assert.ok(sub.content.some(text => text.trim()), `Empty lesson content: ${sub.id}`);
  }
});
test('all quiz questions have unambiguous answers, descriptions and known curriculum category', () => {
  const known = new Set([...MUSIC_CHAPTERS.map(ch => ch.id), ...EXTRA_LEARNING_MODULES.map(m => m.quizId),'solfege','abc-hangok']);
  unique(QUIZ_QUESTIONS.map(q => q.id), 'quiz question');
  for (const question of QUIZ_QUESTIONS) {
    assert.ok(known.has(question.chapterId), `Unknown quiz chapter: ${question.chapterId}`);
    assert.ok(question.question.trim() && question.explanation.trim(), `Missing question/explanation: ${question.id}`);
    assert.ok(question.options.length >= 2 && question.options.every(option=>option.trim()), `Invalid options: ${question.id}`);
    const normalizedAnswers = question.options.map(option =>
      option.trim().normalize('NFC').toLocaleLowerCase('hu-HU').replace(/\s+/g,' ')
    );
    assert.equal(new Set(normalizedAnswers).size, normalizedAnswers.length,
      `Ambiguous duplicate answer options: ${question.id}`);

    assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < question.options.length, `Invalid correct option: ${question.id}`);
  }
});
test('study card and matching IDs are unique, nonempty and stable', () => {
  unique(FLASHCARDS_DATA.map(card => card.id), 'flashcard');
  unique(MATCHING_PAIRS.map(pair => pair.id), 'matching pair');
  assert.ok(FLASHCARDS_DATA.every(card=>card.term.trim() && card.definition.trim()));
  assert.ok(MATCHING_PAIRS.every(pair=>pair.term.trim() && pair.match.trim()));
});

test('all curriculum questions avoid exact duplicate answer options',()=>{
  for(const q of QUIZ_QUESTIONS){
    const normalized=q.options.map(option=>
      option.normalize('NFC').replace(/\s+/g,' ').trim().toLocaleLowerCase('hu-HU'));
    assert.equal(new Set(normalized).size,q.options.length,
      'Repeated text in question '+q.id+': '+JSON.stringify(q.options));
  }
});
