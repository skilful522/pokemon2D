import Sprite from "./Sprite";
import gsap from "gsap";
import fireballSrc from "./assets/fireball.png";

export const attackInfo = document.querySelector(".attack-info");

class Character extends Sprite {
  constructor({ name, attacks, health, isEnemy = false, ...props }) {
    super(props);
    this.name = name;
    this.attacks = attacks;
    this.health = 100;
    this.isEnemy = isEnemy;
  }

  _attackAnimation(recipient, damage, healthBarClassName) {
    gsap.to(healthBarClassName, {
      width: recipient.health + "%",
    });

    gsap.to(recipient.position, {
      x: recipient.position.x + 10,
      yoyo: true,
      repeat: 5,
      duration: 0.08,
    });
    gsap.to(recipient, {
      opacity: 0,
      repeat: 5,
      duration: 0.08,
      yoyo: true,
    });
  }

  faint() {
    attackInfo.innerHTML = `${this.name} fainted!`;
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
  }

  attack({
    recipient,
    renderedSprites,
    attack: { name, damage, type, audioHit, audioInit },
  }) {
    attackInfo.style.display = "block";
    attackInfo.innerHTML = `${this.name} used ${name}`;

    recipient.health -= damage

    const healthBarClassName = this.isEnemy
      ? "#playerHealthBar"
      : "#enemyHealthBar";

    switch (name) {
      case "tackle":
        const tl = gsap.timeline();
        let movementDistance = 20;

        if (this.isEnemy) {
          movementDistance = -20;
        }

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + 40,
            duration: 0.1,
            onComplete: () => {
              audioHit.play()
              this._attackAnimation(recipient, damage, healthBarClassName);
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
      case "fireball":
        const fireballImage = new Image();
        fireballImage.src = fireballSrc;
        audioInit.play();
        const fireball = new Sprite({
          position: { x: this.position.x, y: this.position.y },
          image: fireballImage,
          frames: { max: 4, hold: 10 },
          animate: true,
          rotation: this.isEnemy ? 4 : 1,
          ctx: this.ctx,
        });

        renderedSprites.splice(1, 0, fireball);

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 1.5,
          onComplete: () => {
            renderedSprites.splice(1, 1);
            audioHit.play();
            this._attackAnimation(recipient, damage, healthBarClassName);
          },
        });

        break;
    }
  }
}

export default Character;
