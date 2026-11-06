import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { MUSIC_CHAPTERS } from './src/data/musicData';
import { CREATIVE_PRACTICES, CREATIVE_SOURCE } from './src/data/creativeEducation';
import { MUSIC_HISTORY } from './src/data/musicHistory';
import { COMPOSER_BIOGRAPHIES, GUIDED_LISTENING } from './src/data/musicHistoryProfiles';

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
  'kerlek', 'mondj', 'lehet', 'tudnal', 'tudok', 'tananyag', 'zeneelmelet'
]);

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function tokenize(value: string): string[] {
  return (normalize(value).match(/[a-z0-9]{3,}/g) ?? [])
    .map(word => word.slice(0, 6))
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
  for (const chapter of MUSIC_CHAPTERS) {
    for (const sub of chapter.subchapters) {
      // A lecke rövid és részletes szövege együtt kereshető, az eredeti fejezetnévvel.
      const body = [sub.summary, ...sub.content].join('\n\n');
      const label = `${chapter.title} / ${sub.title}`;
      for (const piece of splitLongText(body, 1200)) {
        const chunk = makeChunk('Zeneelméleti Műhely – Tananyag', label, piece, 'lesson');
        if (chunk) entries.push(chunk);
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
    return { entry, score: score * (0.55 + coverage) * preferred };
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
