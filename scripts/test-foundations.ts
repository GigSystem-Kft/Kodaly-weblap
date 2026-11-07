import test from 'node:test';
import assert from 'node:assert/strict';
import { FOUNDATIONS_GUIDES } from '../src/data/musicFoundationsGuide';
import { FOUNDATIONS_SUBCHAPTER_IDS, getFoundationsSubchapterGuide } from '../src/data/musicFoundationsSubchapters';
import { FOUNDATIONS_FLASHCARDS, FOUNDATIONS_MATCHING, FOUNDATIONS_QUIZZES } from '../src/data/musicFoundationsExercises';
import { MUSIC_CHAPTERS, FLASHCARDS_DATA, MATCHING_PAIRS, QUIZ_QUESTIONS } from '../src/data/musicData';

test('all five foundational chapters have sourced deep lessons and exercises',()=>{
 assert.equal(FOUNDATIONS_GUIDES.length,5);
 assert.deepEqual(FOUNDATIONS_GUIDES.map(x=>x.chapterId).sort(),MUSIC_CHAPTERS.map(x=>x.id).sort());
 for (const guide of FOUNDATIONS_GUIDES) {
  assert.equal(guide.sections.length,4);
  assert.ok(guide.sections.every(s=>s.paragraphs.length>=2 && s.paragraphs.every(p=>p.length>100)));
  assert.ok(guide.objectives.length>=3);
  assert.ok(guide.guidedPractice.length>=4);
  assert.ok(guide.commonMistakes.length>=3);
  assert.ok(guide.selfCheck.length>=2);
  assert.ok(guide.sources.every(x=>x.url.startsWith('https://')));
  assert.ok(MUSIC_CHAPTERS.find(x=>x.id===guide.chapterId)?.subchapters.length);
 }
});
test('new cards, matching and theory questions are consistent and do not replace historical IDs',()=>{
 assert.equal(FOUNDATIONS_FLASHCARDS.length,25);
 assert.equal(FOUNDATIONS_MATCHING.length,25);
 assert.equal(FOUNDATIONS_QUIZZES.length,25);
 for(const bank of [FLASHCARDS_DATA,MATCHING_PAIRS,QUIZ_QUESTIONS]) assert.equal(new Set(bank.map(x=>x.id)).size,bank.length);
 const chapterIds=new Set(MUSIC_CHAPTERS.map(x=>x.id));
 for(const q of FOUNDATIONS_QUIZZES){
  assert.ok(chapterIds.has(q.chapterId));
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.ok(q.options[q.correctIndex]);
  assert.ok(q.explanation.length>20);
 }
});

test('each chapter 1–5 subchapter receives focused, in-depth content with stable identifiers',()=>{
 const all=MUSIC_CHAPTERS.flatMap(chapter=>chapter.subchapters.map(sub=>({chapter,sub})));
 assert.equal(new Set(FOUNDATIONS_SUBCHAPTER_IDS).size,FOUNDATIONS_SUBCHAPTER_IDS.length);
 for(const {chapter,sub} of all){
   const guide=getFoundationsSubchapterGuide(chapter.id,sub.id);
   assert.ok(guide,sub.id+' guide exists');
   assert.ok(guide!.sections.length>0,sub.id+' gets a reading');
   assert.ok(guide!.sections.every(section=>section.paragraphs.length>=2));
   assert.ok(guide!.guidedPractice.length>=4);
 }
 assert.ok(all.length>=16,'Foundational chapter coverage unexpectedly diminished after requested chapter consolidations');
 assert.ok(!FOUNDATIONS_SUBCHAPTER_IDS.includes('hangkoz-szamitas'));
 assert.ok(!FOUNDATIONS_SUBCHAPTER_IDS.includes('szolmizacio-alkalmazas'));
 assert.ok(!FOUNDATIONS_SUBCHAPTER_IDS.includes('ritmus-gyakorlatok'));
 assert.ok(!FOUNDATIONS_SUBCHAPTER_IDS.includes('elojegyzes-feloldas'));
});
