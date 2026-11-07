import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { MUSIC_CHAPTERS, FLASHCARDS_DATA, QUIZ_QUESTIONS, MATCHING_PAIRS } from './src/data/musicData';
import { RHYTHM_RESEARCH_PAGES, RHYTHM_RESEARCH_SOURCE } from './src/data/rhythmResearchPages';
import { RESEARCH_RHYTHM_GAMES } from './src/data/rhythmResearchGames';
import { MAJOR_SCALES, MINOR_SCALES, TRIADS, C_MAJOR_INVERSIONS, FIFTHS_CIRCLE } from './src/data/tonalExamples';
import { COLLECTION_EXAMPLES } from './src/data/collectionLessonExamples';
import { VERIFIED_GLOSSARY } from './src/data/verifiedMusicGlossary';
import { CURATED_MEDIA } from './src/data/curatedMusicMedia';
import { FOUNDATIONS_GUIDES } from './src/data/musicFoundationsGuide';
import { CREATIVE_WORKSHOPS, PEDAGOGY_WORKSHOPS } from './src/data/hungarianDidacticWorkshops';
import { PEDAGOGY_SOURCE, PEDAGOGY_UNITS } from './src/data/musicPedagogy';
import { DEEP_PEDAGOGY_LESSONS } from './src/data/musicPedagogyDeep';
import { CREATIVE_PRACTICES, CREATIVE_SOURCE } from './src/data/creativeEducation';
import { MUSIC_HISTORY } from './src/data/musicHistory';
import { HISTORY_WORKSHOPS } from './src/data/musicHistoryWorkshops';
import { COMPOSER_BIOGRAPHIES, GUIDED_LISTENING } from './src/data/musicHistoryProfiles';
import { HISTORY_NOTE_INSIGHTS, HISTORY_TEXTBOOK_LINKS, HISTORY_VISUALS, HISTORY_RESOURCES, HISTORY_NOTE_SOURCE } from './src/data/musicHistorySupplement';
import MUSIC_EXPRESSIONS from './src/data/musicExpressions.json';
import { THEORY_DRILLS } from './src/data/musicExpressionsPractice';

interface KnowledgeChunk {
  source: string;
  label: string;
  text: string;
  kind: 'lesson' | 'source';
  terms: Map<string, number>;
}

const DATA_DIR = resolve(process.cwd(), 'server-data');
const SOURCES_DIR = resolve(DATA_DIR, 'forrasok');
const STOPWORDS = new Set([
  'hogy', 'milyen', 'miert', 'hogyan', 'mikor', 'mirol', 'melyik', 'mennyi',
  'vagy', 'van', 'volt', 'lesz', 'egy', 'meg', 'nem', 'ami', 'amit', 'ennek',
  'annak', 'azok', 'ezek', 'kozott', 'kulonbseg', 'kulonbsege', 'szerint',
  'kerlek', 'mondj', 'lehet', 'tudnal', 'tudok', 'tananyag', 'zeneelmelet',
  'mit','jelent','jelentese','azt','fogalma','magyarazd','nekem','miert','hogyan'
]);

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function tokenize(value: string): string[] {
  // 1.13, 2.18 és 3.9 ritmuspéldák: megőrzött, önálló keresőazonosítók.
  const withRhythmIds=normalize(value).replace(/\b([123])\.(\d{1,2})\b/g, 'ritmuspeldax$1x$2');
  return (withRhythmIds.match(/[a-z0-9]{3,}/g) ?? [])
    .map(word => word.startsWith('ritmuspeldax') ? word : ['hexakord','hexachordum','hexachord'].includes(word) ? 'hexachord' : word.slice(0, 6))
    .filter(word => !STOPWORDS.has(word));
}

function makeChunk(source: string, label: string, text: string, kind: KnowledgeChunk['kind']): KnowledgeChunk | null {
  if (text.trim().length < 20) return null;
  const terms = new Map<string, number>();
  for (const term of tokenize(label + ' ' + text)) terms.set(term, (terms.get(term) ?? 0) + 1);
  return { source, label, text: text.trim(), kind, terms };
}

function splitIntoSections(raw: string): { label: string; text: string }[] {
  // Jegyzet: === [OLDAL 12] (...); tankönyvek: --- 12. oldal ---
  const marker = /(?:^===\s*\[OLDAL\s+(\d+)\][^\n]*===\s*$)|(?:^---\s*(\d+)\.\s*oldal\s*---\s*$)/gim;
  const matches = [...raw.matchAll(marker)];
  if (!matches.length) return [{ label: 'forrásrészlet', text: raw }];
  return matches.map((match, index) => ({
    label: `${match[1] ?? match[2]}. oldal`,
    text: raw.slice(match.index! + match[0].length, matches[index + 1]?.index ?? raw.length).trim()
  }));
}

function splitLongText(text: string, maxLength = 1300): string[] {
  const parts = text.split(/\n\s*\n/);
  const result: string[] = [];
  let current = '';
  for (const part of parts) {
    if (current && current.length + part.length > maxLength) {
      result.push(current.trim());
      current = '';
    }
    if (part.length > maxLength) {
      for (let pos = 0; pos < part.length; pos += maxLength) {
        if (current) { result.push(current.trim()); current = ''; }
        result.push(part.slice(pos, pos + maxLength).trim());
      }
    } else {
      current += (current ? '\n\n' : '') + part;
    }
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

function buildIndex(): KnowledgeChunk[] {
  const entries: KnowledgeChunk[] = [];
  // Structured expression bank: exact term, category and original source line.
  // The complete supplied source is ALSO indexed independently from server-data/forrasok.
  for(const item of MUSIC_EXPRESSIONS){
    const chunk=makeChunk('Zenei kifejezések – mellékelt, nem minden címszóban lektorált teljes szótár',
      '09. Zenei kifejezések / '+item.category+' / '+item.term+' / eredeti '+item.line+'. sor',
      item.term+' – '+item.definition,'source');
    if(chunk)entries.push(chunk);
  }
  for(const item of THEORY_DRILLS){
    const chunk=makeChunk('Zeneelméleti Műhely – ellenőrzött zenei gyakorlati összefoglalók',
      'Gyakorlás / '+item.category+' / '+item.term,
      [item.meaning,item.why].join('\\n'),'lesson');
    if(chunk)entries.push(chunk);
  }
  for (const term of VERIFIED_GLOSSARY) {
    const chunk=makeChunk(term.sourceTitle+' – '+term.sourceUrl,
      'Magyar zeneelméleti fogalomtár / '+term.term+' / '+term.keywords.join(', '),
      [term.definition,...term.details,term.sourceUrl].join('\\n\\n'),'lesson');
    if(chunk)entries.push(chunk);
  }
  for (const media of CURATED_MEDIA) {
    const chunk=makeChunk('Ellenőrzött médiaforrás – '+media.url,
      'Szemléltetés / '+media.title,
      [media.note,media.kind,...media.chapters.map(n=>'0'+n+'. fejezet'),
       media.access??''].join('\\n'),'source');
    if(chunk)entries.push(chunk);
  }
  for (const chapter of MUSIC_CHAPTERS) {
    for (const sub of chapter.subchapters) {
      // A lecke rövid és részletes szövege együtt kereshető, az eredeti fejezetnévvel.
      const body = [sub.summary, ...sub.content, ...(sub.examples ?? []).flatMap(example=>[example.title,example.description,...(example.audioNotes??[])]), ...(sub.quotes ?? []).map(q=>q.text+' – '+q.source)].join('\n\n');
      const label = `${chapter.title} / ${sub.title}`;
      for (const piece of splitLongText(body, 1200)) {
        const chunk = makeChunk('Zeneelméleti Műhely – Tananyag', label, piece, 'lesson');
        if (chunk) entries.push(chunk);
      }
    }
  }
  // A tanulói oldal további adatai (kvízek, szókártyák, párosítás, hangzó példák)
  // a Tanársegédben is kereshetők. Nem vesszük fel a privát tanulói profiladatokat.
  for (const card of FLASHCARDS_DATA) {
    const chunk=makeChunk('Zeneelméleti Műhely – Szókártyák',card.category+' / '+card.term,card.term+' – '+card.definition,'lesson');
    if(chunk)entries.push(chunk);
  }
  for (const quiz of QUIZ_QUESTIONS) {
    const correct=quiz.options[quiz.correctIndex]??'';
    const chunk=makeChunk('Zeneelméleti Műhely – Teszt',quiz.chapterId+' / '+quiz.id,
      quiz.question+'\\nHelyes válasz: '+correct+'\\n'+(quiz.explanation??''),'lesson');
    if(chunk)entries.push(chunk);
  }
  for (const pair of MATCHING_PAIRS) {
    const chunk=makeChunk('Zeneelméleti Műhely – Párosító',pair.category,
      pair.term+' – '+pair.match,'lesson');
    if(chunk)entries.push(chunk);
  }
  for (const example of [...MAJOR_SCALES,...MINOR_SCALES,...TRIADS,...C_MAJOR_INVERSIONS]) {
    const chunk=makeChunk('Zeneelméleti Műhely – Hangzó hangsor és akkord',example.name,
      [example.name,example.labels.join(' – '),example.description].join('\\n'),'lesson');
    if(chunk)entries.push(chunk);
  }
  for(const key of Object.values(COLLECTION_EXAMPLES).flat()){
    const chunk=makeChunk('Zeneelméleti Műhely – Hangkészletek és pentaton példák',key.title,
      [key.title,key.solfege,key.description,key.notes.join(', ')].join('\\n'),'lesson');
    if(chunk)entries.push(chunk);
  }
  for(const key of FIFTHS_CIRCLE){
    const chunk=makeChunk('Zeneelméleti Műhely – Kvintkör','Kvintkör / '+key.major+'-dúr / '+key.minor+'-moll',
      key.major+'-dúr párhuzamos '+key.minor+'-moll; '+Math.abs(key.accidentals)+' '+(key.accidentals>0?'kereszt':key.accidentals<0?'bé':'előjegyzés nélküli hangnem'),'lesson');
    if(chunk)entries.push(chunk);
  }
  // A feltöltött PDF teljes, oldalanként kinyert szövege és a grafikus ritmustáblák tárgymutatója.
  for(const page of RHYTHM_RESEARCH_PAGES){
    const content=[page.text,page.figureDescription??''].join('\\n\\n');
    for(const part of splitLongText(content,1200)){
      const chunk=makeChunk(RHYTHM_RESEARCH_SOURCE,`Ritmikai fejlesztőprogram – ${page.page}. oldal / ${page.title}`,part,'source');
      if(chunk)entries.push(chunk);
    }
  }
  for(const game of RESEARCH_RHYTHM_GAMES){
    const content=[game.name,game.goal,game.grouping,game.equipment,...game.steps,...game.variations,game.observation,...game.relatedPatterns].join('\\n\\n');
    for(const part of splitLongText(content,1200)){
      const chunk=makeChunk('MTA-SZTE – Ritmikai fejlesztőprogram (önálló módszertani feldolgozás)',`Kreatív ritmikai játék: ${game.name}, ${game.pages.join('–')}. oldal`,part,'lesson');
      if(chunk)entries.push(chunk);
    }
  }
  for (const guide of FOUNDATIONS_GUIDES) {
    const chapter=MUSIC_CHAPTERS.find(c=>c.id===guide.chapterId);
    if (!chapter) continue;
    for (const section of guide.sections) {
      const text=[...section.paragraphs,...guide.guidedPractice,...guide.commonMistakes,
        ...guide.selfCheck.flatMap(item=>[item.question,item.answer]),
        ...guide.sources.map(item=>item.url)].join('\\n\\n');
      for (const piece of splitLongText(text,1200)) {
        const chunk=makeChunk('Zeneelméleti Műhely – forrásmegjelölt bővített zeneelméleti tananyag',
          chapter.title+' / '+section.title,piece,'lesson');
        if (chunk) entries.push(chunk);
      }
    }
  }
  for (const [category,workshops] of [['06. Kreatív zenei nevelés',CREATIVE_WORKSHOPS],['08. Ének-zene tantárgy-pedagógia',PEDAGOGY_WORKSHOPS]] as const) {
    for (const unit of workshops) {
      const text=[...unit.aims,...unit.explanation,...unit.differentiation,...unit.evidence,
        ...unit.questions.flatMap(q=>[q.prompt,q.answer])].join('\n\n');
      for(const part of splitLongText(text,1200)){
        const chunk=makeChunk('Magyar nyelvű pedagógiai feldolgozás: '+unit.sources.map(item=>item.url).join(', '),
          category+' / '+unit.id,part,'lesson');
        if(chunk)entries.push(chunk);
      }
    }
  }
  for (const practice of CREATIVE_PRACTICES) {
    const label = `Kreatív zenei nevelés / ${practice.theme} / ${practice.title}, ${practice.page} oldal`;
    const text = [practice.goal, practice.materials, ...practice.steps, practice.observation, practice.extension].join('\\n');
    const chunk = makeChunk(
      `${CREATIVE_SOURCE.author} (${CREATIVE_SOURCE.year}) – ${CREATIVE_SOURCE.title} (módszertani feldolgozás)`,
      label, text, 'lesson'
    );
    if (chunk) entries.push(chunk);
  }
  for (const period of MUSIC_HISTORY) {
    const summary = [
      period.lead, ...(period.sections ?? []).flatMap(section=>[section.title,...section.paragraphs]), ...period.features, ...period.genres, ...period.figures,
      period.example, 'Források: ' + period.sourceLinks.map(link=>link.url).join('; ')
    ].join('\\n');
    const chunk = makeChunk(
      'Zenetörténet – Wikipédia-forrásokra épülő saját oktatási összefoglaló',
      period.name + ' / ' + period.period, summary, 'lesson'
    );
    if (chunk) entries.push(chunk);
  }
  // A 16 oldalas saját jegyzet nyers szövege külön, oldalszámozott forrásból
  // érkezik; a jegyzet kritikus történeti állításait a következő, javított leckék
  // és módszertani figyelmeztetések pontosítják.
  for(const item of HISTORY_NOTE_INSIGHTS){
    const body=[item.title,item.explanation,...item.listenFor,item.task,item.sampleAnswer,item.caution??''].join('\\n\\n');
    for(const part of splitLongText(body,1200)){
      const chunk=makeChunk(HISTORY_NOTE_SOURCE+' – forráskritikus, önálló feldolgozás',
        '07. Zenetörténet / '+item.periodId+' / '+item.title+' / eredeti '+item.pages.join('–')+'. oldal',part,'lesson');
      if(chunk)entries.push(chunk);
    }
  }
  for(const item of HISTORY_TEXTBOOK_LINKS){
    const body=[item.work,'Tankönyv: Ének-zene '+item.grade+'. osztály, '+item.page+'. PDF-oldal',item.focus,item.activity].join('\\n');
    const chunk=makeChunk('NAT 2020 Ének-zene '+item.grade+'. osztály – ellenőrzött műlista és zenetörténeti tanítási kapcsolatok',
      '07. Zenetörténet / '+item.periodId+' / '+item.work+' / '+item.page+'. oldal',body,'lesson');
    if(chunk)entries.push(chunk);
  }
  for(const item of HISTORY_RESOURCES){
    const chunk=makeChunk('Zenetörténet – online múzeumi, hang- és videoforrások',
      '07. Zenetörténet / '+item.periodId+' / '+item.title,
      [item.title,item.focus,item.url,item.availabilityNote??''].join('\\n'),'source');
    if(chunk)entries.push(chunk);
  }
  for(const item of HISTORY_VISUALS){
    const chunk=makeChunk('Zenetörténet – múzeumi és Wikimedia Commons történeti képek',
      '07. Zenetörténet / '+item.periodId+' / '+item.title,
      [item.caption,item.sourceUrl,item.licenseNote].join('\\n'),'source');
    if(chunk)entries.push(chunk);
  }
  for (const workshop of HISTORY_WORKSHOPS) {
    const period=MUSIC_HISTORY.find(item=>item.id===workshop.periodId);
    if (!period) continue;
    const text=[...workshop.goals,...workshop.context,...workshop.steps,
      workshop.question,workshop.modelAnswer,workshop.furtherPractice].join('\\n\\n');
    for(const part of splitLongText(text,1200)){
      const chunk=makeChunk('Zenetörténet – forrásmegjelölt, önálló tanulási műhely; '+period.sourceLinks.map(x=>x.url).join(', '),
        '07. Zenetörténet / '+period.name,part,'lesson');
      if(chunk) entries.push(chunk);
    }
  }
  for (const person of COMPOSER_BIOGRAPHIES) {
    const summary=[person.dates,person.significance,...person.keywords,
      ...person.works,'Forrás: '+person.sourceUrl].join('\\n');
    const chunk=makeChunk('Zenetörténet – forrásmegjelölt zeneszerzői portré',
      person.name,summary,'lesson');
    if (chunk) entries.push(chunk);
  }
  for (const study of GUIDED_LISTENING) {
    const summary=[study.concept,study.before,...study.during,study.after,
      study.sampleAnswer,'Forrás: '+study.sourceUrl].join('\\n');
    const chunk=makeChunk('Zenetörténet – irányított műelemzés',
      study.title,summary,'lesson');
    if (chunk) entries.push(chunk);
  }
  for (const unit of PEDAGOGY_UNITS) {
    for (const section of unit.sections) {
      const chunk = makeChunk(
        `${PEDAGOGY_SOURCE.author} (${PEDAGOGY_SOURCE.year}): ${PEDAGOGY_SOURCE.title}, ${unit.page} oldal – saját tananyag-feldolgozás`,
        `08. Ének-zene tantárgy-pedagógia / ${unit.title} / ${section.heading}`,
        [unit.goal,section.text,...unit.concepts,...unit.seminar,...unit.reflection].join('\\n'),
        'lesson'
      );
      if (chunk) entries.push(chunk);
    }
  }
  for (const deep of DEEP_PEDAGOGY_LESSONS) {
    const unit=PEDAGOGY_UNITS.find(x=>x.id===deep.unitId);
    if (!unit) continue;
    const text=[...deep.explanation,...deep.lessonPlan,...deep.pitfalls].join('\\n');
    for (const piece of splitLongText(text,1200)) {
      const chunk=makeChunk(
        `${PEDAGOGY_SOURCE.author} (${PEDAGOGY_SOURCE.year}), ${unit.page} oldal – részletes didaktikai feldolgozás`,
        '08. Ének-zene tantárgy-pedagógia / '+unit.title,
        piece,'lesson'
      );
      if (chunk) entries.push(chunk);
    }
  }
  const sources: { file: string; path: string }[] = [
    { file: 'Bartáné Góhér Edit – egyetemi jegyzet', path: resolve(DATA_DIR, 'jegyzet.txt') }
  ];
  if (existsSync(SOURCES_DIR)) {
    for (const file of readdirSync(SOURCES_DIR).filter(f => /\.(txt|md)$/i.test(f) && !f.startsWith('_') && !/kesztler[-_ ]zenei[-_ ]alapismeretek/i.test(f)).sort()) {
      sources.push({ file, path: resolve(SOURCES_DIR, file) });
    }
  }
  for (const source of sources) {
    if (!existsSync(source.path)) continue;
    const raw = readFileSync(source.path, 'utf-8');
    for (const section of splitIntoSections(raw)) {
      for (const [i, piece] of splitLongText(section.text).entries()) {
        const label = `${section.label}${i ? `, ${i + 1}. rész` : ''}`;
        const chunk = makeChunk(source.file, label, piece, 'source');
        if (chunk) entries.push(chunk);
      }
    }
  }
  return entries;
}

const INDEX = buildIndex();
const documentFrequency = new Map<string, number>();
for (const entry of INDEX) {
  for (const token of entry.terms.keys()) {
    documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
  }
}

export interface SearchResult {
  source: string;
  label: string;
  text: string;
  kind: KnowledgeChunk['kind'];
  score: number;
}

export function searchKnowledge(query: string, limit = 6): SearchResult[] {
  const terms = [...new Set(tokenize(query))];
  if (!terms.length) return [];
  const sourcePattern = /ritmikai|ritmust[aá]bl[aá]zat|ritmusp[eé]lda/i.test(query) ? query.match(/\b([123])\.(\d{1,2})\b/) : null;
  const targetSourcePage = sourcePattern ? Number(sourcePattern[1]) + 9 : null;
  const scored = INDEX.map(entry => {
    let score = 0;
    let matches = 0;
    for (const token of terms) {
      const frequency = entry.terms.get(token) ?? 0;
      if (frequency) {
        matches++;
        score += (1 + Math.log(frequency)) * Math.log(1 + INDEX.length / (documentFrequency.get(token) ?? 1));
      }
    }
    // Pontosabb találatok előre, egynél több lekérdezett fogalom esetén is.
    const coverage = matches / terms.length;
    const preferred = entry.kind === 'lesson' ? 1.4 : 1;
    const pagePriority = targetSourcePage !== null && /MTA-SZTE|ritmikai-fejleszto/i.test(entry.source) &&
      entry.label.includes(targetSourcePage+'. oldal') ? 20 : 1;
    // Terminológiai kérdésnél a pontos címszó elsőbbséget kapjon a sok
    // véletlenül hasonló kifejezést tartalmazó hosszú jegyzet előtt.
    const labelParts=entry.label.split(' / ');
    const glossaryTerm=normalize(labelParts.at(-2) ?? '').trim();
    const wordsInQuestion=normalize(query).replace(/[^a-z0-9à-žáéíóöőúüű-]/g,' ').split(/\\s+/);
    const exactGlossary=entry.source.startsWith('Zenei kifejezések') &&
      glossaryTerm.length>2 && wordsInQuestion.join(' ').includes(glossaryTerm) &&
      (terms.length<4 || query.toLocaleLowerCase('hu-HU').includes('kifejezés'));
    const glossaryPriority=exactGlossary?18:1;
    return { entry, score: score * (0.55 + coverage) * preferred * pagePriority * glossaryPriority };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  // Egy forrás hosszú szövege ne nyomja ki a többi releváns forrást.
  const results: SearchResult[] = [];
  const used = new Set<string>();
  for (const item of scored) {
    const key = item.entry.source + ':' + item.entry.label.replace(/, \d+\. rész$/, '');
    if (used.has(key)) continue;
    used.add(key);
    results.push({ source: item.entry.source, label: item.entry.label, text: item.entry.text, kind: item.entry.kind, score: item.score });
    if (results.length >= limit) break;
  }
  return results;
}

function relevantPassage(text: string, query: string, maxLength = 520): string {
  const tokens = [...new Set(tokenize(query))];
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  const best = paragraphs.map(paragraph => ({
    paragraph,
    score: tokens.filter(token => tokenize(paragraph).includes(token)).length
  })).sort((a,b) => b.score - a.score)[0]?.paragraph ?? text;
  const clean = best.replace(/\s+/g, ' ').trim();
  return clean.length <= maxLength ? clean : clean.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export function localKnowledgeReply(question: string): string {
  // Egyértelmű előjegyzéskérdés: a jóváhagyott lecke pontos sorát idézzük.
  if (/g.d[uú]r/i.test(question) && /el[oő]jegyz/i.test(question)) {
    const chapter = MUSIC_CHAPTERS.find(item => item.id === 'hetfoku-hangsorok');
    const lesson = chapter?.subchapters.find(item => item.id === 'dúr-es-modalis');
    const fact = lesson?.content.find(line => /^G-dúr:/.test(line));
    if (fact) return '**A kapcsolódó tananyag alapján:**\\n\\n**Zeneelméleti Műhely – Tananyag – 5.1**\\n'
      + fact;
  }
  const hits = searchKnowledge(question, 12);
  if (!hits.length) {
    return 'A betöltött tananyagban nem találtam biztosan kapcsolódó részletet. Próbáld a konkrét zenei fogalmat vagy a tankönyv témáját megadni. A Gemini nélküli helyi mód a forrásokból keres, de nem generál új magyarázatot.';
  }
  const lessons = hits.filter(h => h.kind === 'lesson').slice(0, 2);
  const sources = hits.filter(h => h.kind === 'source').slice(0, 2);
  const picked = [...lessons, ...sources].slice(0, 4);
  return [
    '**A kapcsolódó tananyag alapján:**',
    ...picked.map(hit => `**${hit.source} – ${hit.label}**\n${relevantPassage(hit.text, question)}`),
    '\n_A helyi mód a feltöltött források releváns részleteit mutatja. A pontos, összefüggő magyarázathoz Gemini mód szükséges._'
  ].join('\n\n');
}

export function knowledgeStatus() {
  return {
    indexedChunks: INDEX.length,
    lessonChunks: INDEX.filter(entry => entry.kind === 'lesson').length,
    indexedSources: [...new Set(INDEX.filter(entry => entry.kind === 'source').map(entry => entry.source))].length
  };
}

export function knowledgeContext(question: string): string {
  return searchKnowledge(question, 8).map(hit =>
    `=== ${hit.source} / ${hit.label} ===\n${hit.text}`
  ).join('\n\n');
}

/** Forráslefedettségi jelentés: a valóban létrejött keresési indexről, nyers szövegek nélkül. */
export function sourceCoverageReport() {
  const groups = new Map<string, { source: string; chunks: number; characters: number; kind: string }>();
  for (const entry of INDEX) {
    const key = entry.source;
    const previous = groups.get(key) ?? { source: key, chunks: 0, characters: 0, kind: entry.kind };
    previous.chunks++;
    previous.characters += entry.text.length;
    groups.set(key, previous);
  }
  const files = existsSync(SOURCES_DIR) ? readdirSync(SOURCES_DIR).filter(f => /\.(txt|md)$/i.test(f)).sort() : [];
  const omitted = files.filter(f => f.startsWith('_') || /kesztler[-_ ]zenei[-_ ]alapismeretek/i.test(f));
  const missing = ['jegyzet.txt','forrasok/nat2020-enekzene-1.txt','forrasok/nat2020-enekzene-2.txt',
    'forrasok/nat2020-enekzene-3.txt','forrasok/nat2020-enekzene-4.txt',
    'forrasok/mta-szte-ritmikai-fejleszto-jatekgyujtemeny.txt',
    'forrasok/sajat-zenetorteneti-jegyzet-16-oldal.txt',
    'forrasok/zenei-kifejezesek-teljes-szotar.txt']
    .filter(name => !existsSync(resolve(DATA_DIR,name)));
  return {
    generatedAt: new Date().toISOString(),
    indexChunks: INDEX.length,
    indexedCharacters: INDEX.reduce((n,e) => n + e.text.length, 0),
    sources: [...groups.values()].sort((a,b) => a.source.localeCompare(b.source,'hu')),
    omitted: [...omitted.map(file => ({ file, reason: file.startsWith('_') ?
      'Sablon vagy nem jóváhagyott fájl' : 'Az OCR-átirat szakmai ellenőrzésig szándékosan kizárva' })),
      ...(!omitted.some(file => /kesztler/i.test(file)) ? [{file:'kesztler-zenei-alapismeretek.txt', reason:'Ellenőrizetlen OCR; a telepítőből és az indexből szándékosan kizárt forrás'}] : [])],
    missing,
    limitations: [
      'Ez a jelentés a szerverbe beépített szöveges indexet méri, nem a teljes fájltárat.',
      'Az új ritmikai fejlesztőprogram mind a 13 szöveges oldala indexelt; a 10–12. oldali ritmuskották képei csak leíró tárgymutatóval kereshetők, nem ellenőrzött hangjegyenkénti átiratok.',
      'Az egyéb PDF-képek, kottaábrák és videók tartalma nem automatikusan kereshető.',
      'A külön feltöltött, privát oktatói dokumentumokat a PHP-kiszolgáló tárolja; azok nem részei ennek a statikus jelentésnek.',
      'A lekérdezésből való előkerülést és a szakmailag helyes AI-választ külön tesztek ellenőrzik.'
    ]
  };
}
