import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { formatHungarianPitchText, hungarianOctaveName } from '../src/utils/noteNotation';
import { FOUNDATIONS_QUIZZES, FOUNDATIONS_FLASHCARDS } from '../src/data/musicFoundationsExercises';

const read=(path:string)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Hungarian octave labels cover natural, sharp, flat and English B pitch IDs',()=>{
  const examples:Record<string,string>={
    G4:'G′',C4:'C′',F3:'F',A3:'A',H4:'H′',B4:'H′',
    'F#4':'Fisz′','G#5':'Gisz″','B♭4':'B′',
    C5:'C″',C6:'C‴',C3:'C',C2:'C,'
  };
  for (const [id,label] of Object.entries(examples))
    assert.equal(hungarianOctaveName(id),label,id);
});

test('prose formatter replaces only whole pitch tokens, not internal identifiers or other words',()=>{
  assert.equal(
    formatHungarianPitchText('G4, C4, F3, A3; F#4 és B4.'),
    'G′, C′, F, A; Fisz′ és H′.'
  );
  assert.equal(formatHungarianPitchText('HangG4x és 4/4 és A440 és test_G4'), 'HangG4x és 4/4 és A440 és test_G4');
  assert.equal(formatHungarianPitchText('G4-ben és C5-re'), 'G′-ben és C″-re');
});

test('G-clef second-line quiz uses Hungarian octave notation without modifying answer key',()=>{
  const q=FOUNDATIONS_QUIZZES.find(q=>q.question==='Mi a G-kulcs második vonalának hangja?');
  assert.ok(q);
  assert.equal(q.options[q.correctIndex],'G′');
  assert.deepEqual(new Set(q.options),new Set(['G′','C′','F','A']));
  for (const option of q.options)
    assert.doesNotMatch(option,/\b[A-H][#]?[0-8]\b/u);
  assert.ok(FOUNDATIONS_FLASHCARDS.some(card=>card.term==='G-kulcs' && card.definition.includes('G′')));
});

test('all core learner-facing components use the shared display formatting',()=>{
  const quiz=read('src/components/QuizView.tsx');
  assert.match(quiz,/formatHungarianPitchText\(currentQ\.question\)/);
  assert.match(quiz,/formatHungarianPitchText\(option\)/);
  assert.match(quiz,/formatHungarianPitchText\(currentQ\.explanation\)/);
  const cards=read('src/components/FlashcardsView.tsx');
  assert.match(cards,/formatHungarianPitchText\(currentCard\.definition\)/);
  const pitch=read('src/components/PitchNamesView.tsx');
  assert.match(pitch,/hungarianOctaveName\(row\.note\)/);
  const lesson=read('src/components/ChapterDetailView.tsx');
  assert.match(lesson,/formatHungarianPitchText\(paragraph\)/);
  const keyboard=read('src/components/InteractiveMusicVisual.tsx');
  assert.match(keyboard,/hungarianOctaveName\(note\)/);
});
