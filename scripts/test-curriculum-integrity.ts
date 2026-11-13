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
test('quiz items with the same visible question and choices cannot disagree on the correct key', () => {
  // An E2E learner only sees the prompt and the choices, not the stable ID.
  // If identical displayed questions have conflicting keys, the assessment
  // cannot be answered unambiguously and automated grading becomes flaky.
  const visibleItems = new Map<string, {id:string;correctIndex:number}>();
  const normalize = (text:string) => text.trim().normalize('NFC').replace(/\s+/g, ' ').toLocaleLowerCase('hu-HU');
  for (const question of QUIZ_QUESTIONS) {
    const visible = JSON.stringify([
      normalize(question.question),
      question.options.map(normalize)
    ]);
    const previous = visibleItems.get(visible);
    if (previous) {
      assert.equal(question.correctIndex, previous.correctIndex,
        `Conflicting answer keys for visually identical items: ${previous.id} / ${question.id}`);
    } else {
      visibleItems.set(visible, {id:question.id,correctIndex:question.correctIndex});
    }
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


test('perfect fourth and fifth matching definitions agree with the interval audio examples', () => {
  const fourth = MATCHING_PAIRS.find(pair => pair.id === 'm10');
  const fifth = MATCHING_PAIRS.find(pair => pair.id === 'm9');
  assert.ok(fourth && fifth);
  assert.equal(fourth.term, 'Tiszta kvart (T4)');
  assert.equal(fourth.category, 'Hangközök');
  assert.match(fourth.match, /Négy diatonikus fok, öt félhang/);
  assert.equal(fifth.term, 'Tiszta kvint (T5)');
  assert.equal(fifth.category, 'Hangközök');
  assert.match(fifth.match, /Öt diatonikus fok, hét félhang/);
  // Older stored achievements refer to these IDs, so never replace them.
  assert.equal(fourth.id, 'm10');
  assert.equal(fifth.id, 'm9');
});
