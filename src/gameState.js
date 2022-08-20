export const getState = {
  isPlaying: false,

  set setIsPlaying(isPlaying) {
    this.isPlaying = isPlaying;
  },

  get getIsPlaying() {
    return this.isPlaying;
  },
};
