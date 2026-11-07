import test from 'node:test';
import assert from 'node:assert/strict';
import { PEDAGOGY_UNITS, PEDAGOGY_SOURCE } from '../src/data/musicPedagogy';
import { DEEP_PEDAGOGY_LESSONS } from '../src/data/musicPedagogyDeep';
import { PEDAGOGY_FLASHCARDS, PEDAGOGY_MATCHING, PEDAGOGY_QUIZZES } from '../src/data/musicPedagogyExercises';
import { FLASHCARDS_DATA, MATCHING_PAIRS, QUIZ_QUESTIONS } from '../src/data/musicData';

test('pedagogy course covers 17 sourced teaching-methodology units', () => {
 assert.equal(PEDAGOGY_UNITS.length,17);
 assert.equal(new Set(PEDAGOGY_UNITS.map(x=>x.id)).size,17);
 assert.equal(PEDAGOGY_SOURCE.isbn,'978-615-5621-66-6');
 assert.ok(PEDAGOGY_SOURCE.originalUrl.startsWith('https://publikacio.uni-eszterhazy.hu/'));
 for(const unit of PEDAGOGY_UNITS){
  assert.ok(unit.page && unit.goal && unit.title);
  assert.ok(unit.sections.length >=2);
  assert.ok(unit.sections.every(section=>section.text.length>=130));
  assert.ok(unit.seminar.length>=2);
  assert.ok(unit.reflection.length>=1);
 }
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('Kodály')));
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('Daltanítás')));
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('Ritmikai')));
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('zenehallgatás')));
});

test('new expanded pedagogy lessons cover every course topic and original figure sources',()=>{
 assert.equal(DEEP_PEDAGOGY_LESSONS.length,PEDAGOGY_UNITS.length);
 assert.deepEqual([...new Set(DEEP_PEDAGOGY_LESSONS.map(x=>x.unitId))].sort(),PEDAGOGY_UNITS.map(x=>x.id).sort());
 for(const deep of DEEP_PEDAGOGY_LESSONS){
  assert.ok(deep.explanation.length>=2);
  assert.ok(deep.explanation.every(p=>p.length>120));
  assert.ok(deep.lessonPlan.length>=5);
  assert.ok(deep.pitfalls.length>=2);
 }
 assert.equal(DEEP_PEDAGOGY_LESSONS.filter(x=>x.figure).length,4);
 for(const fig of DEEP_PEDAGOGY_LESSONS.map(x=>x.figure).filter(x=>x!==undefined)){
  assert.ok(fig.file.endsWith('.png'));
  assert.ok(fig.pdfPage>fig.printPage);
 }
});
test('pedagogy practice contains unique and valid questions with variable correct positions',()=>{
 assert.equal(PEDAGOGY_FLASHCARDS.length,34);
 assert.equal(PEDAGOGY_MATCHING.length,26);
 assert.equal(PEDAGOGY_QUIZZES.length,28);
 for(const bank of [FLASHCARDS_DATA,MATCHING_PAIRS,QUIZ_QUESTIONS]) assert.equal(new Set(bank.map(x=>x.id)).size,bank.length);
 for(const question of PEDAGOGY_QUIZZES){
  assert.equal(question.chapterId,'pedagogia');
  assert.equal(question.options.length,4);
  assert.equal(new Set(question.options).size,4);
  assert.ok(question.options[question.correctIndex].length>5);
  assert.ok(question.explanation.length>20);
 }
 assert.deepEqual([...new Set(PEDAGOGY_QUIZZES.map(x=>x.correctIndex))].sort(),[0,1,2,3]);
});
