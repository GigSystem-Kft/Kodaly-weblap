import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import MUSIC_EXPRESSIONS from '../src/data/musicExpressions.json';
import {EXPRESSION_FLASHCARDS,EXPRESSION_MATCHING,EXPRESSION_QUIZZES,THEORY_DRILLS,THEORY_FLASHCARDS,THEORY_QUIZZES} from '../src/data/musicExpressionsPractice';
import {FLASHCARDS_DATA,MATCHING_PAIRS,QUIZ_QUESTIONS} from '../src/data/musicData';
import {sourceCoverageReport,searchKnowledge} from '../server-knowledge';
import {earDrillSchedule,EAR_DRILL_CATEGORIES} from '../src/components/ExtendedEarTraining';

test('entire submitted A-V music expressions glossary is searchable and categorized',()=>{
 const text=readFileSync('server-data/forrasok/zenei-kifejezesek-teljes-szotar.txt','utf8');
 assert.ok(text.length>90000);
 assert.ok(MUSIC_EXPRESSIONS.length>1750);
 assert.ok(new Set(MUSIC_EXPRESSIONS.map(x=>x.id)).size===MUSIC_EXPRESSIONS.length);
 assert.ok(new Set(MUSIC_EXPRESSIONS.map(x=>x.category)).size>=9);
 for(const word of ['a cappella','accelerando','allegro','andante','crescendo','da capo','forte','pianissimo','pizzicato']){
  const term=MUSIC_EXPRESSIONS.find(x=>x.term===word);
  assert.ok(term,word);
  assert.ok(term.definition.length>3,word);
 }
 assert.ok(MUSIC_EXPRESSIONS.every(x=>x.line>1&&x.letter.length<=2&&x.definition));
});

test('new exercises are nonempty, valid and maintain unique stable IDs',()=>{
 assert.ok(EXPRESSION_FLASHCARDS.length>=120);
 assert.ok(EXPRESSION_MATCHING.length>=100);
 assert.ok(EXPRESSION_QUIZZES.length>=100);
 assert.ok(THEORY_DRILLS.length>=30);
 assert.ok(new Set(FLASHCARDS_DATA.map(x=>x.id)).size===FLASHCARDS_DATA.length);
 assert.ok(new Set(MATCHING_PAIRS.map(x=>x.id)).size===MATCHING_PAIRS.length);
 assert.ok(new Set(QUIZ_QUESTIONS.map(x=>x.id)).size===QUIZ_QUESTIONS.length);
 for(const q of [...EXPRESSION_QUIZZES,...THEORY_QUIZZES]){
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options).size,4,'Duplicate wrong answers in '+q.id);
  assert.ok(q.correctIndex>=0&&q.correctIndex<4);
  assert.ok(q.explanation.length>6);
 }
 assert.ok(THEORY_FLASHCARDS.some(x=>x.term==='Hexachord'));
 assert.ok(THEORY_DRILLS.some(x=>x.term==='Éles ritmus'));
});

test('all 4 new hearing modes are reachable and duration examples are musically accurate',()=>{
 assert.deepEqual(EAR_DRILL_CATEGORIES,['hangsor','ritmus','hangérték','ütemmutató']);
 const get=(id:string)=>({
 'Nyújtott ritmus':{lengths:[1.5,.5]},
 'Éles ritmus':{lengths:[.5,1.5]},
 'Szinkópa':{lengths:[.5,1,.5]},
 'Nyolcadtriola':{lengths:[1/3,1/3,1/3]}
 } as Record<string,any>)[id];
 for(const title of ['Nyújtott ritmus','Éles ritmus','Szinkópa','Nyolcadtriola']){
  const ch={id:title,title,explanation:'teszt',...get(title)};
  const notes=earDrillSchedule(ch,60);
  assert.ok(Math.abs(notes.at(-1)!.time+notes.at(-1)!.duration-(title==='Nyolcadtriola'?.91: title==='Nyújtott ritmus'?1.955:1.955))<.2,title);
 }
 const whole=earDrillSchedule({id:'whole',title:'Egész',explanation:'',lengths:[4]},60);
 assert.ok(Math.abs(whole[0].duration-3.64)<.001);
 assert.equal(earDrillSchedule({id:'2/4',title:'2/4',explanation:'',meter:[1,0,1,0]},60).length,4);
});

test('both Node and PHP AI indexes include the vocabulary and source line references',()=>{
 const report=sourceCoverageReport();
 assert.equal(report.missing.length,0);
 assert.ok(report.sources.some(x=>x.source.includes('Zenei kifejezések')&&x.chunks>1500));
 for(const term of ['accelerando','ars nova','crescendo','allegro']){
  const hits=searchKnowledge(term,15);
  assert.ok(hits.some(x=>x.label.includes('Zenei kifejezések')&&x.label.includes('eredeti')),term);
 }
 const exporter=readFileSync('scripts/export-php-knowledge.ts','utf8');
 assert.ok(exporter.includes('for(const item of MUSIC_EXPRESSIONS)'));
 const app=readFileSync('src/App.tsx','utf8');
 const chapters=readFileSync('src/components/ChapterListView.tsx','utf8');
 const ear=readFileSync('src/components/EarTrainingView.tsx','utf8');
 assert.ok(app.includes('MusicExpressionsView'));
 assert.ok(chapters.includes('onOpenExpressions'));
 assert.ok(ear.includes('ExtendedEarTraining'));
});
