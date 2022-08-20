import { audioManager } from "./audio";

export const attacks = {
  tackle: {
    name: "tackle",
    damage: 10,
    type: "Normal",
    color: "black",
    audioHit: audioManager.getAudio("tackleHit"),
  },
  fireball: {
    name: "fireball",
    damage: 50,
    type: "Fire",
    color: "red",
    audioHit: audioManager.getAudio("initFireball"),
    audioInit: audioManager.getAudio("initFireball"),
  },
};
