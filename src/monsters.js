import { ctx } from "./canvas";
import dragonSrc from "./assets/draggleSprite.png";
import embySpriteSrc from "./assets/embySprite.png";
import { attacks } from "./constants";

const dragonImage = new Image();
dragonImage.src = dragonSrc;

const embyImage = new Image();
embyImage.src = embySpriteSrc;

export const monsters = {
  emby: {
    position: { x: 280, y: 325 },
    image: { src: embySpriteSrc },
    frames: { max: 4, hold: 30 },
    animate: true,
    name: "Emby",
    attacks: [attacks.tackle, attacks.fireball],
    ctx,
  },
  dragon: {
    position: { x: 800, y: 100 },
    image: { src: dragonSrc },
    frames: { max: 4, hold: 30 },
    animate: true,
    isEnemy: true,
    attacks: [attacks.tackle, attacks.fireball],
    name: "Dragon",
    ctx,
  },
};
