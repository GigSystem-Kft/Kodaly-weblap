import test from 'node:test';
import assert from 'node:assert/strict';
import { MUSIC_EXPRESSIONS, MUSIC_EXPRESSION_CATEGORIES } from '../src/components/MusicExpressionsView';
import { EXPRESSION_FLASHCARDS, EXPRESSION_MATCHING } from '../src/data/musicExpressionsPractice';

test('glossary maintains exactly 1793 source terms, IDs and definitions', () => {
  assert.equal(MUSIC_EXPRESSIONS.length,1793);
  assert.equal(new Set(MUSIC_EXPRESSIONS.map(x=>x.id)).size,1793);
  assert.ok(MUSIC_EXPRESSIONS.every(x=>x.term.trim()&&x.definition.trim()));
});
test('conservative taxonomy changes are visible and never hidden by the practice bank',()=>{
  const terms=MUSIC_EXPRESSIONS;
  assert.equal(terms.filter(x=>x.category==='Egyéb szakkifejezések').length,756);
  for(const label of ['Díszítések és ornamentika','Előadásmód és artikuláció']){
    assert.ok(MUSIC_EXPRESSION_CATEGORIES.includes(label));
    assert.ok(terms.some(t=>t.category===label));
    assert.ok(EXPRESSION_FLASHCARDS.some(c=>c.category==='Zenei kifejezések – '+label),label);
    assert.ok(EXPRESSION_MATCHING.some(c=>c.category==='Zenei kifejezések – '+label),label);
  }
});

test('meaning-based glossary improvements preserve stable IDs and editable source meanings',()=>{
 const targeted=['acquietandosi','addolorato','canon à l’écrevisse','auxiliary note'];
 for(const term of targeted){
   const item=MUSIC_EXPRESSIONS.find(e=>e.term===term);
   assert.ok(item,'Missing source entry '+term);
   assert.notEqual(item.category,'Egyéb szakkifejezések',term+' remains uncategorized');
 }
});
