export default class Explosion {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;;
    this.image = document.getElementById("boomImage");
    this.spriteWidth = 300;
    this.spriteHeight = 300;
    this.frameX = 0;
    this.frameY = 0
    this.maxFrames = 4;
    this.frameRate = 0;
  }
  draw(context) {
    // context.save();
    // context.strokeStyle = "white";
    // context.lineWidth = 15;
    // context.rect(this.x-50/2, this.y - 50/2, 50, 50);
    // context.stroke();
    // context.restore()

    context.drawImage(
      this.image,
      this.spriteWidth * this.frameX,
      this.spriteHeight * this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth /3,
      this.spriteHeight /3
    );
    context.restore();
  }
  update() {
    this.frameRate++;
    if (this.frameX <= this.maxFrames) {
      if (this.frameRate % 5 === 0) {
        this.frameX++;
      }
    } else {
      this.frameX = 0;
    }
  }
}
