import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('flashcards have compact accessible dropdown and switching resets card position and flip',()=>{
 const code=readFileSync('src/components/FlashcardsView.tsx','utf8');
 assert.match(code,/htmlFor="flashcards-category"/);
 assert.match(code,/<select/);
 assert.match(code,/value=\{selectedCategory\}/);
 assert.match(code,/setCurrentIndex\(0\)/);
 assert.match(code,/setIsFlipped\(false\)/);
 assert.ok(!code.includes('categories.map((cat) => (\n          <button'));
});
test('matching game uses one dropdown and keeps the existing category-driven game reset',()=>{
 const code=readFileSync('src/components/MatchingGame.tsx','utf8');
 assert.match(code,/htmlFor="matching-category"/);
 assert.match(code,/onChange=\{\(event\) => setSelectedCategory\(event.target.value\)\}/);
 assert.match(code,/useEffect\(\(\) => \{\s*initGame\(\);\s*\}, \[selectedCategory\]\)/);
 assert.ok(!code.includes('categories.map(category => (\n          <button'));
});
test('quiz chapter uses one dropdown and resets the score and question when changed',()=>{
 const code=readFileSync('src/components/QuizView.tsx','utf8');
 assert.match(code,/htmlFor="quiz-chapter"/);
 assert.match(code,/setSelectedChapter\(event.target.value\); restartQuiz\(\)/);
 assert.match(code,/id:'zenei-kifejezesek'/);
 assert.match(code,/id:'zenetortenet'/);
 assert.match(code,/id:'hangkeszletek'/);
 assert.match(code,/id:'hetfoku-hangsorok'/);
 assert.match(code,/QUIZ_QUESTIONS.some\(q => q.chapterId === item.id\)/);
 assert.ok(!code.includes('Chapter Filter'));
});

test('subchapter and matching completions are wired into persistent user progress',()=>{
 const app=readFileSync('src/App.tsx','utf8');
 const lesson=readFileSync('src/components/ChapterDetailView.tsx','utf8');
 const game=readFileSync('src/components/MatchingGame.tsx','utf8');
 assert.match(app,/onCompleteSubchapter=\{completeSubchapter\}/);
 assert.match(app,/onCompleted=\{completeMatching\}/);
 assert.match(lesson,/completedSubchapters.includes\(currentSub.id\)/);
 assert.match(game,/onCompleted\(newMatched\)/);
});

test('quiz uses fair 15-question practice rounds rather than an unbounded all-topic session',()=>{
 const code=readFileSync('src/components/QuizView.tsx','utf8');
 assert.match(code,/return shuffled\.slice\(0, 15\)/);
 assert.match(code,/\[selectedChapter, round\]/);
 assert.match(code,/setRound\(value => value \+ 1\)/);
 assert.match(code,/Vegyes gyakorlás \(15 kérdés\)/);
});
