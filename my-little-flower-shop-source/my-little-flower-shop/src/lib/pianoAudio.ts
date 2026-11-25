/**
 * Gentle procedural piano music box using Web Audio API.
 * Never auto-plays before explicit user interaction.
 */
class GentlePianoPlayer {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private isPlaying = false;
  private stepIndex = 0;

  // Cozy waltz-like Cmaj7 / Am7 / Fmaj7 / G6 arpeggio frequencies (Hz)
  private readonly melody: number[][] = [
    [261.63, 329.63, 392.0],
    [493.88],
    [523.25],
    [392.0],
    [220.0, 261.63, 329.63],
    [440.0],
    [493.88],
    [329.63],
    [174.61, 220.0, 261.63],
    [392.0],
    [440.0],
    [329.63],
    [196.0, 246.94, 293.66],
    [392.0],
    [329.63],
    [293.66],
  ];

  private playNote(freq: number, volume = 0.045) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 1.9);
    overtone.stop(now + 1.9);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    this.start();
    return true;
  }

  public start(): void {
    if (this.isPlaying) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    this.isPlaying = true;
    const tick = () => {
      if (!this.isPlaying) return;
      const chord = this.melody[this.stepIndex % this.melody.length];
      chord.forEach((freq, idx) => {
        window.setTimeout(() => this.playNote(freq, idx === 0 ? 0.04 : 0.028), idx * 45);
      });
      this.stepIndex += 1;
    };
    tick();
    this.timer = window.setInterval(tick, 760);
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }
}

export const pianoPlayer = new GentlePianoPlayer();
