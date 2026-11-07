// Web Audio API synthesizer for music theory learning and ear training

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Note frequencies in Hz (Equal temperament, A4 = 440Hz)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94, 'H3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88, 'H4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 790.00, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77, 'H5': 987.77,
  'C6': 1046.50
};

export function playNote(noteName: string, durationMs = 600, type: OscillatorType = 'sine'): void {
  try {
    const ctx = getAudioContext();
    const freq = NOTE_FREQUENCIES[noteName] || 440;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    console.error('Audio playback error:', e);
  }
}

export function playChord(noteNames: string[], durationMs = 1000): void {
  noteNames.forEach((note, index) => {
    setTimeout(() => {
      playNote(note, durationMs, 'triangle');
    }, index * 40);
  });
}

export function playMelody(notes: { note: string; duration: number }[]): void {
  let totalTime = 0;
  notes.forEach(({ note, duration }) => {
    setTimeout(() => {
      playNote(note, duration * 0.9, 'sine');
    }, totalTime);
    totalTime += duration;
  });
}


/**
 * Softer, longer two-note interval exercise. The partials and damping imitate a
 * gently struck mallet/piano-like instrument, without remote audio samples.
 * Scheduling against AudioContext.currentTime keeps timing accurate on mobile.
 */
let earTrainingVoices: { oscillators: OscillatorNode[]; output: GainNode }[] = [];

export function stopEarTrainingInterval(): void {
  for (const voice of earTrainingVoices) {
    try {
      voice.output.gain.cancelScheduledValues(0);
      voice.output.gain.setValueAtTime(0, 0);
      voice.oscillators.forEach(osc => { try { osc.stop(); } catch { /* already stopped */ } });
    } catch { /* audio may have been released */ }
  }
  earTrainingVoices = [];
}

function scheduleWarmTone(ctx: AudioContext, frequency: number, startAt: number, duration = 1.9): void {
  const output = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = Math.min(3500, frequency * 8);
  filter.Q.value = 0.55;
  output.gain.setValueAtTime(0.0001, startAt);
  output.gain.exponentialRampToValueAtTime(0.23, startAt + 0.045);
  output.gain.exponentialRampToValueAtTime(0.12, startAt + 0.24);
  output.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  filter.connect(output);
  output.connect(ctx.destination);
  const oscillators: OscillatorNode[] = [];
  // An unobtrusive, harmonic-rich tone is easier on the ear than a pure sine.
  for (const [harmonic, level] of [[1, 1], [2, 0.26], [3, 0.11], [4, 0.045]] as const) {
    const oscillator = ctx.createOscillator();
    const mix = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency * harmonic, startAt);
    mix.gain.value = level / 1.45;
    oscillator.connect(mix);
    mix.connect(filter);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.06);
    oscillator.onended = () => { oscillator.disconnect(); mix.disconnect(); };
    oscillators.push(oscillator);
  }
  earTrainingVoices.push({ oscillators, output });
}

/** Two clearly separated pitches, with a short natural overlap at the end. */
export function playEarTrainingInterval(notes: readonly string[]): void {
  if (notes.length !== 2) return;
  try {
    stopEarTrainingInterval();
    const ctx = getAudioContext();
    const begin = ctx.currentTime + 0.04;
    const first = NOTE_FREQUENCIES[notes[0]];
    const second = NOTE_FREQUENCIES[notes[1]];
    if (!first || !second) return;
    scheduleWarmTone(ctx, first, begin, 1.95);
    scheduleWarmTone(ctx, second, begin + 1.30, 1.95);
  } catch (error) {
    console.error('Interval playback error:', error);
  }
}
