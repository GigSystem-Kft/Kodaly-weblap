import test from 'node:test';
import assert from 'node:assert/strict';
import { FOUNDATIONS_GUIDES } from '../src/data/musicFoundationsGuide';
import { CREATIVE_WORKSHOPS, PEDAGOGY_WORKSHOPS } from '../src/data/hungarianDidacticWorkshops';
import { CREATIVE_PRACTICES } from '../src/data/creativeEducation';
import { PEDAGOGY_UNITS } from '../src/data/musicPedagogy';
import { HUNGARIAN_FLASHCARDS, HUNGARIAN_MATCHING, HUNGARIAN_QUIZZES } from '../src/data/hungarianWorkshopsExerciseBank';

test('all foundational chapter reading links are Hungarian language materials',()=>{
 assert.equal(FOUNDATIONS_GUIDES.length,5);
 for(const guide of FOUNDATIONS_GUIDES) {
  assert.ok(guide.sources.length>=2);
  for(const src of guide.sources){
   assert.match(src.url,/^(https:\/\/(?:www\.)?(?:nkp\.hu|kodalyhub\.hu|njt\.jog\.gov\.hu)\/)/);
   assert.ok(!/open music theory|edinburgh|hutchinson/i.test(src.title+' '+src.note));
  }
 }
});
test('new creative workshops are matched to existing practices, with observable outcomes',()=>{
 assert.ok(CREATIVE_WORKSHOPS.length>=4);
 const ids=new Set(CREATIVE_PRACTICES.map(x=>x.id));
 for(const workshop of CREATIVE_WORKSHOPS){
  assert.ok(ids.has(workshop.id));
  assert.ok(workshop.aims.length>=2);
  assert.ok(workshop.explanation.length>=2);
  assert.ok(workshop.differentiation.length>=2);
  assert.ok(workshop.evidence.length>=2);
  assert.ok(workshop.questions.every(q=>q.prompt.length>20&&q.answer.length>30));
  assert.ok(workshop.sources.every(src=>src.url.startsWith('https://')));
 }
});
test('university pedagogy workshops match published lesson identifiers and have answer keys',()=>{
 assert.ok(PEDAGOGY_WORKSHOPS.length>=4);
 const ids=new Set(PEDAGOGY_UNITS.map(x=>x.id));
 for(const workshop of PEDAGOGY_WORKSHOPS){
  assert.ok(ids.has(workshop.id));
  assert.ok(workshop.explanation.every(x=>x.length>150));
  assert.ok(workshop.questions.length>=1);
  assert.ok(workshop.evidence.length>=2);
  assert.ok(workshop.sources.some(src=>src.url.includes('uni-eszterhazy.hu')));
 }
});

test('sixth and eighth units include additive Hungarian language self-check banks',()=>{
 assert.equal(HUNGARIAN_FLASHCARDS.length,8);
 assert.equal(HUNGARIAN_MATCHING.length,8);
 assert.equal(HUNGARIAN_QUIZZES.length,8);
 assert.equal(new Set(HUNGARIAN_QUIZZES.map(x=>x.id)).size,8);
 for(const quiz of HUNGARIAN_QUIZZES){
  assert.ok(['kreativ','pedagogia'].includes(quiz.chapterId));
  assert.equal(quiz.options.length,4);
  assert.equal(new Set(quiz.options).size,4);
  assert.ok(quiz.options[quiz.correctIndex]);
  assert.ok(quiz.explanation.length>25);
 }
});
