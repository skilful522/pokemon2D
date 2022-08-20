export default class Sprite {
  constructor({
    position,
    velocity,
    image,
    ctx,
    sprites,
    animate = false,
    isEnemy = false,
    rotation = 0,
    frames = { max: 1, hold: 10 },
  }) {
    this.position = position;
    this.velocity = velocity;
    this.image = new Image();
    this.frames = { ...frames, value: 0, elapsed: 0 };
    this.ctx = ctx;
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    this.ctx.rotate(this.rotation);
    this.ctx.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(
      this.image,
      this.frames.value * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    this.ctx.restore();

    if (!this.animate) {
      return;
    }

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold !== 0) {
      return;
    }

    if (this.frames.value < this.frames.max - 1) {
      this.frames.value++;
    } else {
      this.frames.value = 0;
    }
  }

}
