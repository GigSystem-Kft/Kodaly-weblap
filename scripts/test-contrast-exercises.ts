import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

for (const [name,filename] of [
 ['Szókártyák','FlashcardsView.tsx'],
 ['Párosító','MatchingGame.tsx'],
 ['Teszt','QuizView.tsx'],
] as const) {
 test(name+' – readable headings, helper text and dark exercise cards',()=>{
   const source=readFileSync('src/components/'+filename,'utf8');
   assert.ok(source.includes('text-3xl font-extrabold text-slate-900 mb-2'), name+' title contrast');
   assert.ok(source.includes('className="text-slate-600 text-sm"'),name+' description contrast');
   assert.ok(!source.includes('className="text-3xl font-extrabold text-white mb-2"'),name+' white heading on white background');
   assert.ok(source.includes('bg-slate-900'),name+' dark exercise cards preserved');
   assert.ok(source.includes('text-white'),name+' white on dark card preserved');
   assert.ok(source.includes('<select'),name+' compact category selector preserved');
 });
}
test('Flashcards – white text stays on cards; labels outside are dark',()=>{
 const s=readFileSync('src/components/FlashcardsView.tsx','utf8');
 assert.ok(s.includes('text-slate-800 mb-2">Szókártyák témaköre'));
 assert.ok(s.includes('className="text-xs text-slate-600 mt-2"'));
 assert.ok(s.includes('text-slate-300 group-hover:text-white'));
});
test('Matching – the score and column labels are legible against light page',()=>{
 const s=readFileSync('src/components/MatchingGame.tsx','utf8');
 assert.ok(s.includes('className="text-sm font-medium text-slate-700"'));
 assert.ok(s.includes('className="text-emerald-700">{matchedPairs.length}'));
 assert.ok(s.includes('text-slate-700 mb-2'));
});
test('Quiz – header text is dark outside the dark question card',()=>{
 const s=readFileSync('src/components/QuizView.tsx','utf8');
 assert.ok(s.includes('text-violet-800'));
 assert.ok(s.includes('text-slate-800">Teszt témaköre'));
 assert.ok(s.includes('className="text-xl font-bold text-white mb-6 leading-snug"'));
});

test('flashcards and matching remain navigable without a mouse or category data', () => {
  const flashcards=readFileSync('src/components/FlashcardsView.tsx','utf8');
  const matching=readFileSync('src/components/MatchingGame.tsx','utf8');
  assert.match(flashcards,/aria-pressed=\{isFlipped\}/);
  assert.match(flashcards,/event\.key === 'Enter' \|\| event\.key === ' '/);
  assert.match(flashcards,/Ebben a témakörben még nincs szókártya/);
  assert.match(matching,/Ehhez a témakörhöz még nincs párosító feladat/);
  assert.match(matching,/aria-pressed=\{isSelected\}/);
});
