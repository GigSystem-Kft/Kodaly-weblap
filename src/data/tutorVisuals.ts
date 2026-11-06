import { LESSON_ILLUSTRATIONS } from './lessonIllustrations';

export interface TutorVisual {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
}

const fromLesson = (id: string, lessonId: string, imageIndex = 0): TutorVisual => {
  const item = LESSON_ILLUSTRATIONS[lessonId][imageIndex];
  return {
    id, title: item.title, description: item.description, image: item.image,
    source: 'Zeneelméleti Műhely – tananyag'
  };
};

/** Whitelisted existing course illustrations; server returns IDs, never arbitrary image URLs. */
export const TUTOR_VISUALS: Record<string, TutorVisual> = {
  kvintkor: {
    id: 'kvintkor', title: 'Kvintkör',
    description: 'Dúr hangnemek és relatív molljaik kvintlépések szerint.',
    image: '/images/kvintkor.svg', source: 'Zeneelméleti Műhely – saját szerkesztésű ábra'
  },
  hangkoz: fromLesson('hangkoz', 'hangkoz-fajtak'),
  szolmizacio: fromLesson('szolmizacio', 'szolmizacio-elonyai'),
  elojegyzes: fromLesson('elojegyzes', 'modositok', 1),
  modositok: fromLesson('modositok', 'modositok', 0),
  kulcsok: fromLesson('kulcsok', 'abszolutm-hangok', 1),
  ritmus: fromLesson('ritmus', 'ritmuskepsz', 0),
  szunetek: fromLesson('szunetek', 'ritmuskepsz', 1),
  utemmutato: fromLesson('utemmutato', 'tempo-utem', 0),
  hangsor: fromLesson('hangsor', 'dúr-es-modalis', 0),
  durok: fromLesson('durok', 'dúr-es-modalis', 1)
};
