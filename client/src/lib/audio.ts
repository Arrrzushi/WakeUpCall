export class RingtonePlayer {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  async init() {
    if (!this.context) {
      this.context = new AudioContext();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
    }
  }

  play() {
    if (!this.context || !this.gainNode) return;
    
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(440, this.context.currentTime);
    
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    
    // Create ringing pattern
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.1);
    this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);
    this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.4);
  }

  stop() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }
}

export const ringtonePlayer = new RingtonePlayer();
