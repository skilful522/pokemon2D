export class Boundary {
  static width = 48;
  static height = 48;

  constructor(position, ctx) {
    this.position = position;
    this.width = 48;
    this.height = 48;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillStyle = "rgba(0,0,0,0.2)";
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
