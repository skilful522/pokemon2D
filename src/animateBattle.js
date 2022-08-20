import battleBackground from "./assets/battleBackground.png";
import Sprite from "./Sprite";
import { ctx } from "./canvas";
import { attacks } from "./constants";
import Character, { attackInfo } from "./Character";
import { monsters } from "./monsters";
import gsap from "gsap";
import { animate, battle } from "./index";
import { audioManager } from "./audio";

const enemyHealthBar = document.querySelector("#enemyHealthBar");
const playerHealthBar = document.querySelector("#playerHealthBar");
const attacksContainer = document.querySelector(".attacks");
const attackType = document.querySelector(".attackType");

const battleBackgroundImage = new Image();
battleBackgroundImage.src = battleBackground;

const battleBackgroundSprite = new Sprite({
  position: { x: 0, y: 0 },
  image: battleBackgroundImage,
  ctx,
});

let dragon;
let emby;
let renderedSprites;
let queue;

export const initBattle = () => {
  document.querySelector(".battle-interface").style.display = "block";
  enemyHealthBar.style.width = "100%";
  playerHealthBar.style.width = "100%";
  attackInfo.style.display = "none";
  attacksContainer.replaceChildren();
  dragon = new Character(monsters.dragon);
  emby = new Character(monsters.emby);
  renderedSprites = [dragon, emby];
  queue = [];

  document.querySelector(".enemy-character-name").innerHTML = dragon.name;
  document.querySelector(".player-character-name").innerHTML = emby.name;

  emby.attacks.map((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    button.dataset.attack = attack.name;
    attacksContainer.append(button);
  });

  Array.from(attacksContainer.children).forEach((child) => {
    child.addEventListener("mouseenter", (event) => {
      if (event.target.dataset.attack) {
        const { type, color } = attacks[event.target.dataset.attack];

        attackType.innerHTML = type;
        attackType.style.color = color;
      }
    });
    attackType.innerHTML = "Attack type";
  });

};

let battleAnimationId;

export const animateBattle = () => {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackgroundSprite.draw();
  renderedSprites.forEach((sprite) => sprite.draw());
};

const finishFight = () => {
  cancelAnimationFrame(battleAnimationId);
  document.querySelector(".battle-interface").style.display = "none";
  gsap.to(".overlapping", {
    opacity: 0,
  });
  audioManager.play("map");
  animate();
  battle.initiated = false;
};

attacksContainer.addEventListener("click", (event) => {
  if (event.target.dataset.attack) {
    emby.attack({
      attack: attacks[event.target.dataset.attack],
      recipient: dragon,
      renderedSprites,
    });

    if (dragon.health <= 0) {
      queue.push(() => {
        audioManager.stop("battle");
        dragon.faint();
        audioManager.play("victory");
      });
      queue.push(() => {
        gsap.to(".overlapping", {
          opacity: 1,
          onComplete: finishFight,
        });
      });
      return;
    }

    const randomDragonAttack =
      dragon.attacks[Math.floor(Math.random() * dragon.attacks.length)];

    queue.push(() => {
      dragon.attack({
        attack: randomDragonAttack,
        recipient: emby,
        renderedSprites,
      });
    });

    if (emby.health <= 0) {
      queue.push(() => {
        audioManager.stop("battle");
        emby.faint();
        audioManager.play("victory");
      });
      queue.push(() => {
        gsap.to(".overlapping", {
          opacity: 1,
          onComplete: finishFight,
        });
      });
      return;
    }
  }
});

document.querySelector(".attack-info").addEventListener("click", (event) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    event.target.style.display = "none";
  }
});
