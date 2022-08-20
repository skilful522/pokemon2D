import { Howl } from "howler";
import battle from "./assets/audio/battle.mp3";
import fireballHit from "./assets/audio/fireballHit.wav";
import initBattle from "./assets/audio/initBattle.wav";
import tackleHit from "./assets/audio/tackleHit.wav";
import initFireball from "./assets/audio/initFireball.wav";
import map from "./assets/audio/map.wav";
import victory from "./assets/audio/victory.wav";

import AudioManager from "./helpers/AudioManager";

const BASE_AUDIO_PATH = "./assets/audio/";

const audiosMap = [
  { name: "battle", src: battle },
  { name: "fireballHit", src: fireballHit },
  { name: "initBattle", src: initBattle },
  { name: "tackleHit", src: tackleHit },
  { name: "initFireball", src: initFireball },
  { name: "map", src: map },
  { name: "victory", src: victory },
];

const audios = audiosMap.reduce((acc, { name, src }) => {
  acc[name] = new Howl({
    src,
    html5: true,
  });

  return acc;
}, {});

export const audioManager = new AudioManager(audios);
