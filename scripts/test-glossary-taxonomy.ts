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
  assert.equal(terms.filter(x=>x.category==='Egyéb szakkifejezések').length,418);
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

test('recent reviewed glossary terms appear in their exact specialist categories',()=>{
  const expected: Record<string,string> = {
    'bassanello':'Hangszer és játéktechnika',
    'cello':'Hangszer és játéktechnika',
    'coda':'Zenei műfajok és formák',
    'chanson':'Zenei műfajok és formák',
    'bockstriller':'Díszítések és ornamentika',
    'BWV':'Zenetörténet és stílus',
    'ben tenuto':'Előadásmód és artikuláció',
    'calmato, calmo':'Dinamika és karakter'
  };
  for(const [term,category] of Object.entries(expected)){
    const entry=MUSIC_EXPRESSIONS.find(item=>item.term===term);
    assert.equal(entry?.category,category,`Incorrect reviewed taxonomy: ${term}`);
  }
});

test('newly reviewed orchestration, expressive and theory terms retain exact categories',()=>{
  const expected: Record<string,string>={
    'bocca chiusa':'Éneklés és kórus',
    'bariton':'Éneklés és kórus',
    'ars antiqua':'Zenetörténet és stílus',
    'consort':'Zenei műfajok és formák',
    'attacca':'Előadásmód és artikuláció',
    'da capo':'Kottaírás és jelölések',
    'dal segno':'Kottaírás és jelölések',
    'con sordino':'Egyéb szakkifejezések',
    'con fuoco':'Dinamika és karakter',
    'con dolore':'Dinamika és karakter',
    'diatonikus félhang/félhanglépés':'Hangsorok és harmóniák',
    'diesis':'Kottaírás és jelölések',
    'diabolus in musica':'Hangsorok és harmóniák',
    'bagpipe':'Hangszer és játéktechnika',
    'bandoneon':'Hangszer és játéktechnika',
    'demi jeu':'Dinamika és karakter'
  };
  for(const [term,category] of Object.entries(expected)){
    const entry=MUSIC_EXPRESSIONS.find(item=>item.term===term);
    assert.equal(entry?.category,category,term);
  }
});
