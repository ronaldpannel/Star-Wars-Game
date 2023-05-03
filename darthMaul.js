export default class DarthMaul {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 48;
    this.spriteWidth = 32;
    this.spriteHeight = 48;
    this.frameX = 0;
    this.frameY = 1;
    this.speedX = -2;
    this.speedY = 0;
    this.image = document.getElementById("darthMaulImage");
    this.maxFrames = 3;
    this.frameRate = 0;
    this.r = 50;
    this.angle = 0;
    this.isWalking = false;
  }
  draw(context) {
    context.strokeStyle = "yellow";
    //context.strokeRect(this.x, this.y, this.w, this.h)

    context.drawImage(
      this.image,
      this.spriteWidth * this.frameX,
      this.spriteHeight * this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth,
      this.spriteHeight
    );
  }
  update() {
    this.frameRate++;
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y < 100 || this.y + this.h >= this.height) {
      this.speedY *= -1;
    }

    if (this.frameX < this.maxFrames) {
      if (this.frameRate % 10 == 0) {
        this.frameX++;
      }
    } else {
      this.frameX = 0;
    }
  }
  isColliding(other) {
    return (
      this.x + this.w > other.x &&
      this.x < other.x + other.w &&
      this.y + this.h >= other.y &&
      this.y <= other.y + other.h
    );
  }
}
