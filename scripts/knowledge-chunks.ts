/**
 * Lossless segmentation for PHP tutor index passages.
 *
 * String.slice() addresses UTF-16 code units and may split a musical symbol
 * or an emoji into two unpaired surrogates. JSON.stringify then writes
 * replacement characters when the segments are encoded as UTF-8.
 *
 * Grapheme clusters preserve Hungarian combining accents, supplementary
 * notation glyphs and emoji sequences; joining the chunks reproduces the
 * original text, including small tails and boundary whitespace.
 */
export function splitKnowledgeText(source: string, maxCodePoints = 1200): string[] {
  if (!Number.isInteger(maxCodePoints) || maxCodePoints < 2)
    throw new RangeError('The knowledge index chunk size must be at least two code points');
  if (source.length === 0) return [];
  const chunks: string[] = [];
  let chunk = '';
  let size = 0;
  for (const { segment } of new Intl.Segmenter('hu', { granularity: 'grapheme' }).segment(source)) {
    const points = Array.from(segment).length;
    // A single grapheme may contain many combining characters. Do not split
    // it to enforce a limit; source fidelity takes precedence in that case.
    if (chunk && size + points > maxCodePoints) {
      chunks.push(chunk);
      chunk = '';
      size = 0;
    }
    chunk += segment;
    size += points;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}
