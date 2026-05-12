/**
 * Royal Score - Audio Manager
 * Handles all sound effects and background music
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.musicVolume = 0.6;
    this.sfxVolume = 0.8;
    this.masterVolume = 0.8;
    this.soundEnabled = true;
    this.currentMusic = null;
    
    this.loadSettings();
  }

  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('royalScoreSettings') || '{}');
    this.masterVolume = settings.masterVolume / 100 || 0.8;
    this.musicVolume = settings.musicVolume / 100 || 0.6;
    this.sfxVolume = settings.sfxVolume / 100 || 0.8;
    this.soundEnabled = settings.soundEnabled !== false;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Generate simple beep sounds using Web Audio API (placeholder for actual audio files)
  playTone(frequency, duration, type = 'sine') {
    if (!this.soundEnabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    const volume = this.masterVolume * this.sfxVolume;
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sound effect methods (placeholders - replace with actual audio files)
  playCardDraw() {
    this.init();
    // Placeholder: play a quick ascending tone
    this.playTone(440, 0.1, 'sine');
    setTimeout(() => this.playTone(554, 0.1, 'sine'), 50);
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
  }

  playScore() {
    this.init();
    // Placeholder: play a pleasant chime
    this.playTone(523, 0.15, 'sine');
    setTimeout(() => this.playTone(659, 0.15, 'sine'), 100);
    setTimeout(() => this.playTone(784, 0.2, 'sine'), 200);
  }

  playCombo() {
    this.init();
    // Placeholder: play an exciting combo sound
    this.playTone(523, 0.1, 'square');
    setTimeout(() => this.playTone(659, 0.1, 'square'), 50);
    setTimeout(() => this.playTone(784, 0.1, 'square'), 100);
    setTimeout(() => this.playTone(1047, 0.2, 'square'), 150);
  }

  playSkip() {
    this.init();
    // Placeholder: play a low tone for skipping
    this.playTone(330, 0.2, 'triangle');
  }

  playRoundComplete() {
    this.init();
    // Placeholder: play a round completion fanfare
    this.playTone(523, 0.2, 'sine');
    setTimeout(() => this.playTone(659, 0.2, 'sine'), 200);
    setTimeout(() => this.playTone(784, 0.2, 'sine'), 400);
    setTimeout(() => this.playTone(1047, 0.4, 'sine'), 600);
  }

  playGameOver() {
    this.init();
    // Placeholder: play game over sound
    this.playTone(392, 0.3, 'sine');
    setTimeout(() => this.playTone(330, 0.3, 'sine'), 300);
    setTimeout(() => this.playTone(262, 0.5, 'sine'), 600);
  }

  playWin() {
    this.init();
    // Placeholder: play victory sound
    this.playTone(523, 0.15, 'sine');
    setTimeout(() => this.playTone(659, 0.15, 'sine'), 150);
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 300);
    setTimeout(() => this.playTone(1047, 0.15, 'sine'), 450);
    setTimeout(() => this.playTone(1319, 0.4, 'sine'), 600);
  }

  playButtonClick() {
    this.init();
    // Placeholder: play button click sound
    this.playTone(800, 0.05, 'sine');
  }

  playError() {
    this.init();
    // Placeholder: play error sound
    this.playTone(200, 0.2, 'sawtooth');
  }

  playNotification() {
    this.init();
    // Placeholder: play notification sound
    this.playTone(880, 0.1, 'sine');
  }

  // Volume control methods
  setMasterVolume(volume) {
    this.masterVolume = volume;
  }

  setMusicVolume(volume) {
    this.musicVolume = volume;
    if (this.currentMusic) {
      this.currentMusic.volume = this.masterVolume * this.musicVolume;
    }
  }

  setSfxVolume(volume) {
    this.sfxVolume = volume;
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (!enabled && this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  // Background music (placeholder - would use actual audio files)
  playMusic() {
    if (!this.soundEnabled) return;
    // Placeholder: implement background music playback
    console.log('Background music would play here');
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic = null;
    }
  }
}

// Create global audio manager instance
const audioManager = new AudioManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = audioManager;
}
