import { meterPattern, type MeterId } from './meterPatterns';
import { quarterScaleSchedule } from './noteNotation';
import { rhythmFigurePattern, type RhythmFigureId } from './rhythmFigures';
import { rhythmPattern, type RhythmSubdivision } from './rhythmPattern';
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
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 233.08, 'H3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 466.16, 'H4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 790.00, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 932.33, 'H5': 987.77,
  'C6': 1046.50
};

/** Hungarian B means international B-flat; H is B-natural. */
export function noteFrequencyHz(noteName: string): number | undefined {
  return NOTE_FREQUENCIES[noteName];
}

export function playNote(noteName: string, durationMs = 600, type: OscillatorType = 'sine'): void {
  try {
    const ctx = getAudioContext();
    const freq = noteFrequencyHz(noteName);
    if (!freq) { console.warn('Unknown note in audio example:', noteName); return; }

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

/** Hangkészlet-dallam gyakorlása természetesebb, felhangos, egyenként elkülönülő hangokkal. */
export function playEarTrainingMelody(notes: readonly string[]): void {
  if (!notes.length || notes.length > 16) return;
  try {
    stopEarTrainingInterval();
    const ctx=getAudioContext();
    const begin=ctx.currentTime+0.045;
    for(let index=0;index<notes.length;index++) {
      const frequency=NOTE_FREQUENCIES[notes[index]];
      if (!frequency) return;
      scheduleWarmTone(ctx,frequency,begin+index*0.86,1.07);
    }
  } catch(error) {
    console.error('Hangkészletlejátszási hiba:',error);
  }
}


/** One four-beat measure, with pitch repeated precisely at the selected note-value attacks. */
let rhythmSound: {oscillators: OscillatorNode[]; gains: GainNode[]} | null=null;

export function stopRhythmPlayback(): void {
  const playback=rhythmSound;
  rhythmSound=null;
  if(!playback)return;
  for(const gain of playback.gains){
    try {
      gain.gain.cancelScheduledValues(0);
      gain.gain.setValueAtTime(0,0);
    } catch { /* context may be closed */ }
  }
  for(const osc of playback.oscillators) {
    try { osc.stop(); } catch { /* completed voice */ }
  }
}

export function playRhythmPlayback(divisions: RhythmSubdivision, bpm=60, withMetronome=true): {durationMs:number;stop:()=>void} {
  stopRhythmPlayback();
  const pattern=rhythmPattern(divisions,bpm);
  const ctx=getAudioContext();
  const start=ctx.currentTime+0.04;
  const oscillators:OscillatorNode[]=[];
  const gains:GainNode[]=[];
  for(const note of pattern.notes){
    const at=start+note.startSeconds;
    const until=at+note.durationSeconds;
    const gain=ctx.createGain();
    const osc=ctx.createOscillator();
    // A warm, rounded tone remains audible even for a whole note held for four beats.
    osc.type='triangle';
    osc.frequency.setValueAtTime(261.63,at);
    const attack=Math.min(0.02,note.durationSeconds*0.16);
    const release=Math.min(0.045,note.durationSeconds*0.22);
    gain.gain.setValueAtTime(0.0001,at);
    gain.gain.linearRampToValueAtTime(0.23,at+attack);
    gain.gain.setValueAtTime(0.23,until-release);
    gain.gain.linearRampToValueAtTime(0.0001,until);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(at);
    osc.stop(until+0.01);
    osc.onended=()=>{osc.disconnect();gain.disconnect();};
    oscillators.push(osc);
    gains.push(gain);
  }
  if(withMetronome){
    // Quarter-note pulse is timed on the same AudioContext clock as the notes.
    // First beat has a distinct higher click; both are deliberately quieter.
    for(const beat of pattern.beats){
      const at=start+beat.startSeconds;
      const clickLength=0.055;
      const click=ctx.createOscillator();
      const envelope=ctx.createGain();
      click.type='sine';
      click.frequency.setValueAtTime(beat.accent?1380:920,at);
      click.frequency.exponentialRampToValueAtTime(beat.accent?780:530,at+clickLength);
      envelope.gain.setValueAtTime(0.0001,at);
      envelope.gain.linearRampToValueAtTime(beat.accent?0.12:0.075,at+0.003);
      envelope.gain.exponentialRampToValueAtTime(0.0001,at+clickLength);
      click.connect(envelope);
      envelope.connect(ctx.destination);
      click.start(at);
      click.stop(at+clickLength+0.005);
      click.onended=()=>{click.disconnect();envelope.disconnect();};
      oscillators.push(click);
      gains.push(envelope);
    }
  }
  const playback={oscillators,gains};
  rhythmSound=playback;
  return {durationMs:pattern.totalSeconds*1000,
    stop:()=>{if(rhythmSound===playback)stopRhythmPlayback();}};
}


/** Ritmusképlet: négynegyedes, pontos időzítésű hangok és opcionális mérőütések. */
export function playRhythmFigure(id: RhythmFigureId, bpm=60, withMetronome=true): {durationMs:number;stop:()=>void} {
  stopRhythmPlayback();
  const pattern=rhythmFigurePattern(id,bpm);
  const ctx=getAudioContext();
  const start=ctx.currentTime+0.04;
  const oscillators: OscillatorNode[]=[];
  const gains: GainNode[]=[];
  const tone=(at:number, duration:number, frequency:number, amplitude:number, click=false)=>{
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type=click?'sine':'triangle';
    osc.frequency.setValueAtTime(frequency,at);
    if(click)osc.frequency.exponentialRampToValueAtTime(frequency*0.61,at+duration);
    const attack=click?0.003:Math.min(0.016,duration*0.14);
    const release=click?duration-attack:Math.min(0.035,duration*0.2);
    gain.gain.setValueAtTime(0.0001,at);
    gain.gain.linearRampToValueAtTime(amplitude,at+attack);
    if(!click)gain.gain.setValueAtTime(amplitude,at+duration-release);
    gain.gain.exponentialRampToValueAtTime(0.0001,at+duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(at);
    osc.stop(at+duration+0.005);
    osc.onended=()=>{osc.disconnect();gain.disconnect();};
    oscillators.push(osc); gains.push(gain);
  };
  for(const event of pattern.events){
    tone(start+event.startBeats*pattern.beatSeconds,
      event.durationBeats*pattern.beatSeconds,261.63,0.22);
  }
  if(withMetronome){
    for(const beat of pattern.beats){
      tone(start+beat.startSeconds,0.052,beat.accent?1380:920,beat.accent?0.12:0.075,true);
    }
  }
  const playback={oscillators,gains};
  rhythmSound=playback;
  return {durationMs:pattern.totalSeconds*1000,
    stop:()=>{if(rhythmSound===playback)stopRhythmPlayback();}};
}

/** Egységes, lágy hangszínű negyedek: az egyvonalas C-től a kétvonalas C-ig. */
export function playWarmQuarterScale(noteNames: readonly string[], bpm=60): void {
  const timeline=quarterScaleSchedule(noteNames,bpm);
  // Previous scale or ear-training phrase must not continue underneath the new one.
  stopEarTrainingInterval();
  try {
    const ctx=getAudioContext();
    const start=ctx.currentTime+0.04;
    for(const event of timeline.notes) {
      const frequency=NOTE_FREQUENCIES[event.note];
      if(!frequency)throw new Error('Ismeretlen hang: '+event.note);
      // Separate quarter-note attacks, warm harmonic timbre and sufficient sustain.
      scheduleWarmTone(ctx,frequency,start+event.startSeconds,event.durationSeconds*0.94);
    }
  } catch (error) {
    stopEarTrainingInterval();
    console.error('Negyedes skálalejátszás hiba:',error);
  }
}


/**
 * Two-bar metrical example using the same AudioContext timeline.
 * Three distinct dynamic layers make main, secondary and unstressed beats audible.
 */
export function playMeterExample(id:MeterId,bpm=60):{durationMs:number;stop:()=>void}{
  stopRhythmPlayback();
  const pattern=meterPattern(id,bpm);
  const ctx=getAudioContext();
  const start=ctx.currentTime+0.04;
  const oscillators:OscillatorNode[]=[];
  const gains:GainNode[]=[];
  for(const pulse of pattern.pulses){
    const at=start+pulse.startSeconds;
    const duration=pulse.durationSeconds;
    const amplitude=pulse.accent==='fo'?0.28:pulse.accent==='mellek'?0.19:0.105;
    const freq=pulse.accent==='fo'?392:pulse.accent==='mellek'?349.23:329.63;
    const osc=ctx.createOscillator();
    const lowpass=ctx.createBiquadFilter();
    const gain=ctx.createGain();
    osc.type='triangle';
    osc.frequency.setValueAtTime(freq,at);
    lowpass.type='lowpass';
    lowpass.frequency.value=2400;
    gain.gain.setValueAtTime(0.0001,at);
    gain.gain.linearRampToValueAtTime(amplitude,at+0.012);
    gain.gain.setValueAtTime(amplitude*0.65,at+Math.min(duration*0.30,0.15));
    gain.gain.exponentialRampToValueAtTime(0.0001,at+duration*0.91);
    osc.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);
    osc.start(at);
    osc.stop(at+duration*0.92);
    osc.onended=()=>{osc.disconnect();lowpass.disconnect();gain.disconnect();};
    oscillators.push(osc);gains.push(gain);
  }
  const playback={oscillators,gains};
  rhythmSound=playback;
  return {durationMs:pattern.totalDurationSeconds*1000,
    stop:()=>{if(rhythmSound===playback)stopRhythmPlayback();}};
}


/**
 * Lágy, felhangdús hangszínnel játszott kromatikus hangsor.
 * A böngésző hangórája biztosítja az egyenletes, 60 BPM-es negyedeket.
 * Az aktuális lejátszás gombnyomásra és alfejezetváltáskor leállítható.
 */
export function playChromaticSequence(notes:readonly string[],bpm=60):{durationMs:number;stop:()=>void}{
  if(!Number.isFinite(bpm)||bpm<=0||bpm>240)throw new Error('Érvénytelen tempó');
  if(!notes.length||notes.length>24)throw new Error('Érvénytelen hanglista');
  const frequencies=notes.map(note=>{
    const freq=NOTE_FREQUENCIES[note];
    if(!freq)throw new Error('Ismeretlen hang: '+note);
    return freq;
  });
  stopEarTrainingInterval();
  const ctx=getAudioContext();
  const start=ctx.currentTime+0.045;
  const beatSeconds=60/bpm;
  for(let i=0;i<frequencies.length;i++){
    scheduleWarmTone(ctx,frequencies[i],start+i*beatSeconds,beatSeconds*0.93);
  }
  return {durationMs:frequencies.length*beatSeconds*1000,stop:stopEarTrainingInterval};
}

/** Egyidejű, lágy hármashangzat, a korábbi hangpéldák hangszínével. */
export function playWarmTriad(notes:readonly string[],durationSeconds=2.2):{durationMs:number;stop:()=>void}{
  const frequencies=notes.map(note=>{
    const f=NOTE_FREQUENCIES[note];
    if(!f)throw new Error('Ismeretlen akkordhang: '+note);
    return f;
  });
  stopEarTrainingInterval();
  const ctx=getAudioContext();
  const at=ctx.currentTime+0.05;
  for(const f of frequencies)scheduleWarmTone(ctx,f,at,durationSeconds);
  return {durationMs:durationSeconds*1000,stop:stopEarTrainingInterval};
}
