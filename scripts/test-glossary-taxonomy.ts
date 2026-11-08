import test from 'node:test';
import assert from 'node:assert/strict';
import { MUSIC_EXPRESSIONS, MUSIC_EXPRESSION_CATEGORIES } from '../src/components/MusicExpressionsView';
import { EXPRESSION_FLASHCARDS, EXPRESSION_MATCHING, EXPRESSION_QUIZZES } from '../src/data/musicExpressionsPractice';

test('glossary maintains exactly 1793 source terms, IDs and definitions', () => {
  assert.equal(MUSIC_EXPRESSIONS.length,1793);
  assert.equal(new Set(MUSIC_EXPRESSIONS.map(x=>x.id)).size,1793);
  assert.ok(MUSIC_EXPRESSIONS.every(x=>x.term.trim()&&x.definition.trim()));
});
test('conservative taxonomy changes are visible and never hidden by the practice bank',()=>{
  const terms=MUSIC_EXPRESSIONS;
  assert.equal(terms.filter(x=>x.category==='Egyéb szakkifejezések').length,0);
  for(const label of ['Díszítések és ornamentika','Előadásmód és artikuláció','Általános zenei nyelv és utasítások']){
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
    'con sordino':'Hangszer és játéktechnika',
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

test('reclassified Hungarian harmony, articulation, vocal and historical glossary labels',()=>{
  const expected:Record<string,string>={
    'dodekafónia':'Hangsorok és harmóniák',
    'enharmónia':'Hangsorok és harmóniák',
    'egészhangú skála':'Hangsorok és harmóniák',
    'dot':'Kottaírás és jelölések',
    'doppio movimento':'Tempó és időkezelés',
    'engführung':'Zenei műfajok és formák',
    'falsetto':'Éneklés és kórus',
    'far il capotasto':'Hangszer és játéktechnika',
    'étude':'Zenei műfajok és formák',
    'etüd, etude':'Zenei műfajok és formák',
    'étouffoir':'Hangszer és játéktechnika',
    'farsa':'Zenei műfajok és formák',
    'drinking song':'Zenei műfajok és formák'
  };
  for(const [term,category] of Object.entries(expected)){
    assert.equal(MUSIC_EXPRESSIONS.find(item=>item.term===term)?.category,category,term);
  }
});

test('all 1793 historic source entries have explicit pedagogical domains without a catch-all',()=>{
  const known = new Set(MUSIC_EXPRESSION_CATEGORIES);
  assert.equal(new Set(MUSIC_EXPRESSIONS.map(item=>item.category)).size,12);
  assert.equal(MUSIC_EXPRESSIONS.filter(item=>item.category==='Egyéb szakkifejezések').length,0);
  assert.ok(MUSIC_EXPRESSIONS.every(item=>known.has(item.category)));
  for(const [term,category] of Object.entries({
    'con':'Általános zenei nyelv és utasítások',
    'sempre':'Általános zenei nyelv és utasítások',
    'senza':'Általános zenei nyelv és utasítások',
    'drei':'Általános zenei nyelv és utasítások',
    'hiatus':'Éneklés és kórus',
    'gerade bewegung':'Hangsorok és harmóniák',
    'főpróba':'Előadásmód és artikuláció',
  })){
    assert.equal(MUSIC_EXPRESSIONS.find(item=>item.term===term)?.category,category,term);
  }
});

test('every one of the twelve glossary domains is reachable through card, game and quiz practice',()=>{
  const termsById = new Map(MUSIC_EXPRESSIONS.map(term=>[term.id,term]));
  const quizDomains = new Set(EXPRESSION_QUIZZES.map(quiz=>
    termsById.get(quiz.id.replace(/^expr-q-/,'') )?.category
  ));
  for(const label of MUSIC_EXPRESSION_CATEGORIES){
    assert.ok(EXPRESSION_FLASHCARDS.some(card=>card.category==='Zenei kifejezések – '+label),'Missing flashcard category: '+label);
    assert.ok(EXPRESSION_MATCHING.some(pair=>pair.category==='Zenei kifejezések – '+label),'Missing matching category: '+label);
    assert.ok(quizDomains.has(label),'Missing quiz domain: '+label);
  }
});
