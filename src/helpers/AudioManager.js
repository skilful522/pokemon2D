class AudioManager {
  constructor(audios) {
    this.audios = audios;
  }

  getAudio(audioName) {
    return this.audios[audioName];
  }

  play(audioName) {
    this.audios[audioName].play();
  }

  stop(audioName) {
    this.audios[audioName].stop();
  }
}

export default AudioManager;
