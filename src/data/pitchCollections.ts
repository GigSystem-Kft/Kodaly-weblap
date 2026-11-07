/**
 * Önálló, rövid hangkészlet-felismerő motívumok.
 * Nem népdalok/kottaidézetek: a megadott hangkészletet bejáró saját gyakorlóképletek.
 * A kategóriák *különböző hangmagasságokat* számolnak, nem leütéseket.
 */
export interface PitchCollectionChallenge {
  id: number;
  title: string;
  solfege: string;
  explanation: string;
  /** A C-dúrból származtatott hangnevek, a daloktól független gyakorláshoz. */
  variants: readonly (readonly string[])[];
}

export const PITCH_COLLECTIONS: readonly PitchCollectionChallenge[] = [
  {
    id: 1, title: 'Biton', solfege: 'szó–mi',
    explanation: 'Kéthangos, hiányos (nem szomszédos hangokból álló) hangkészlet. Például szó és mi.',
    variants: [['G4','E4','G4','G4','E4'],['E4','G4','E4','G4']]
  },
  {
    id: 2, title: 'Triton', solfege: 'lá–szó–mi',
    explanation: 'Három különböző hangból álló hiányos hangkészlet; itt lá, szó és mi szerepel.',
    variants: [['A4','G4','E4','G4','A4'],['E4','G4','A4','G4','E4']]
  },
  {
    id: 3, title: 'Tetraton', solfege: 'szó–mi–ré–dó',
    explanation: 'Négy különböző hangból álló hangkészlet. Itt szó–mi–ré–dó; ez nem teljes, összefüggő négyfokú diatonikus szakasz.',
    variants: [['G4','E4','D4','C4','E4','G4'],['C4','D4','E4','G4','E4','C4']]
  },
  {
    id: 4, title: 'Pentaton', solfege: 'lá–szó–mi–ré–dó',
    explanation: 'Ötfokú, itt félhang nélküli pentaton hangkészlet: dó–ré–mi–szó–lá. A magyar népzene fontos alaphangkészlete.',
    variants: [['A4','G4','E4','D4','C4','G4'],['C4','E4','G4','A4','D4','C4']]
  },
  {
    id: 5, title: 'Bichord', solfege: 'szó–lá',
    explanation: 'Két szomszédos diatonikus hangból álló készlet; itt szó–lá, nagy szekunddal.',
    variants: [['G4','A4','G4','A4'],['A4','G4','G4','A4']]
  },
  {
    id: 6, title: 'Trichord', solfege: 'dó–ré–mi',
    explanation: 'Három egymás melletti diatonikus hang: dó–ré–mi. A két szomszédos lépés nagy szekund.',
    variants: [['C4','D4','E4','D4','C4'],['E4','D4','C4','D4','E4']]
  },
  {
    id: 7, title: 'Pentachord', solfege: 'dó–ré–mi–fá–szó',
    explanation: 'Öt egymás mellett elhelyezkedő diatonikus hang. A mi–fá között félhang van.',
    variants: [['C4','D4','E4','F4','G4','E4','C4'],['G4','F4','E4','D4','C4','G4']]
  },
  {
    id: 8, title: 'Hexachord', solfege: 'dó–ré–mi–fá–szó–lá',
    explanation: 'Hat egymás melletti diatonikus hang; a középkori hexachord ut–re–mi–fa–sol–la mintájával rokon hangsorszakasz.',
    variants: [['C4','D4','E4','F4','G4','A4','G4','E4'],['A4','G4','F4','E4','D4','C4','A4']]
  }
];

export function pitchNotes(challenge: PitchCollectionChallenge, variantIndex: number): readonly string[] {
  return challenge.variants[variantIndex % challenge.variants.length];
}

/** Returns a nonrepeating order plus an independently randomized version of each motif. */
export function createPitchCollectionRound(
  previousLastId?: number,
  random: () => number = Math.random
): { id: number; variantIndex: number }[] {
  const entries = PITCH_COLLECTIONS.map(item => ({
    id: item.id, variantIndex: Math.floor(random() * item.variants.length)
  }));
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(random() * (i + 1)));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  if (entries[0].id === previousLastId) [entries[0], entries[1]] = [entries[1], entries[0]];
  if (entries.every((entry,i) => entry.id === PITCH_COLLECTIONS[i].id)) {
    [entries[0], entries[2]] = [entries[2], entries[0]];
  }
  return entries;
}
