import gsap from "gsap";

import playerUpSrc from "./assets/playerUp.png";
import playerDownSrc from "./assets/playerDown.png";
import playerRightSrc from "./assets/playerRight.png";
import playerLeftSrc from "./assets/playerLeft.png";
import gameMapSrc from "./assets/updatedGameMap.png";
import foregroundSrc from "./assets/foregroundObjects.png";

import { Boundary } from "./Boundary";
import Sprite from "./Sprite";
import { canvas, ctx } from "./canvas";
import { getLayer } from "./helpers/getLayer";
import { checkCollision } from "./helpers/checkCollision";
import { rectangularCollision } from "./helpers/rectangularCollision";
import "./styles.css";
import { animateBattle, initBattle } from "./animateBattle";
import { audioManager } from "./audio";
import { getState } from "./gameState";

const gameMenuContainer = document.querySelector(".game-menu");
const loadingContainer = document.querySelector(".loading");
const playButton = document.querySelector(".play");
const collisions = getLayer("Collisions");
const battleZones = getLayer("Battle Zones");

const collisionsMap = [];
const battleZonesMap = [];

for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

for (let i = 0; i < battleZones.length; i += 70) {
  battleZonesMap.push(battleZones.slice(i, 70 + i));
}

const offset = {
  x: -1000,
  y: -140,
};

const boundaries = [];
const battleZoneBoundaries = [];

collisionsMap.forEach((row, index) => {
  row.forEach((symbol, rowIndex) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary(
          {
            x: rowIndex * Boundary.width + offset.x,
            y: index * Boundary.height + offset.y,
          },
          ctx
        )
      );
    }
  });
});

battleZonesMap.forEach((row, index) => {
  row.forEach((symbol, rowIndex) => {
    if (symbol === 1025) {
      battleZoneBoundaries.push(
        new Boundary(
          {
            x: rowIndex * Boundary.width + offset.x,
            y: index * Boundary.height + offset.y,
          },
          ctx
        )
      );
    }
  });
});

const mapImage = new Image();
mapImage.src = gameMapSrc;

const foregroundImage = new Image();
foregroundImage.src = foregroundSrc;

const initPlayerImages = () => {
  [playerUpSrc, playerRightSrc, playerLeftSrc].forEach((src) => {
    const image = new Image();
    image.src = src;
  });
};

// TODO investigate me, workaround for uploading images
initPlayerImages();

const playerImage = new Image();
playerImage.src = playerDownSrc;

const player = new Sprite({
  ctx,
  position: {
    x: canvas.width / 2 - playerImage.width / 4,
    y: canvas.height / 2 - 50 - playerImage.height / 2,
  },
  frames: { max: 4, hold: 10 },
  sprites: {
    up: playerUpSrc,
    down: playerDownSrc,
    right: playerRightSrc,
    left: playerLeftSrc,
  },
  image: playerImage,
});

const background = new Sprite({
  ctx,
  position: offset,
  image: mapImage,
});

const foreground = new Sprite({
  ctx,
  position: offset,
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, ...battleZoneBoundaries];

export const battle = {
  initiated: false,
};

export const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  player.draw();
  foreground.draw();

  let isMoving = true;
  player.animate = false;

  if (battle.initiated) {
    return;
  }

  if (keys.w.pressed) {
    player.image.src = player.sprites.up;
  }
  if (keys.s.pressed) {
    player.image.src = player.sprites.down;
  }
  if (keys.a.pressed) {
    player.image.src = player.sprites.left;
  }
  if (keys.d.pressed) {
    player.image.src = player.sprites.right;
  }

  if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZoneBoundaries.length; i++) {
      const battleZone = battleZoneBoundaries[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.5
      ) {
        window.cancelAnimationFrame(animationId);
        audioManager.stop("map");
        audioManager.play("initBattle");
        audioManager.stop("initBattle");
        audioManager.play("battle");
        battle.initiated = true;
        gsap.to(".overlapping", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to(".overlapping", {
              opacity: 1,
              duration: 0.4,
              onComplete: () => {
                initBattle();
                animateBattle();
                gsap.to(".overlapping", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed) {
    player.animate = true;

    checkCollision({
      direction: "up",
      player,
      boundaries,
      collisionCallback: () => {
        isMoving = false;
      },
    });

    isMoving && movables.forEach((movable) => (movable.position.y += 3));
  }
  if (keys.s.pressed) {
    player.animate = true;
    checkCollision({
      direction: "down",
      player,
      boundaries,
      collisionCallback: () => {
        isMoving = false;
      },
    });

    isMoving && movables.forEach((movable) => (movable.position.y -= 3));
  }
  if (keys.a.pressed) {
    player.animate = true;
    checkCollision({
      direction: "left",
      player,
      boundaries,
      collisionCallback: () => {
        isMoving = false;
      },
    });

    isMoving && movables.forEach((movable) => (movable.position.x += 3));
  }
  if (keys.d.pressed) {
    player.animate = true;
    checkCollision({
      direction: "right",
      player,
      boundaries,
      collisionCallback: () => {
        isMoving = false;
      },
    });

    isMoving && movables.forEach((movable) => (movable.position.x -= 3));
  }
};

window.onload = () => {
  loadingContainer.style.display = "none";
  playButton.style.display = "block";
};

document.querySelector(".play").addEventListener("click", () => {
  getState.isPlaying = true;
  gameMenuContainer.style.display = "none";
  canvas.style.display = "block";
  audioManager.play("map");
  animate();
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      keys.w.pressed = true;
      break;
    case "s":
      keys.s.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    default:
      break;
  }
});
