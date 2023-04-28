export default class Enemy {
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
    this.speedX = -1.5;
    this.speedY = 0;
    this.image = document.getElementById("stormTropperImage");
    this.maxFrames = 3;
    this.frameRate = 60;
    this.r = 50
    this.isWalking = false;
  }
  draw(context) {
    context.strokeStyle = "blue";
    context.lineWidth = 3;
    //context.strokeRect(this.x, this.y, this.w, this.h);

    //  context.beginPath();
    //  context.strokeStyle = "white";
    //  context.arc(
    //    this.x + this.spriteWidth / 2,
    //    this.y + this.spriteHeight / 2,
    //    this.r,
    //    0,
    //    Math.PI * 2
    //  );
    //  context.stroke();
    //  context.closePath();

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
    if (this.frameX < this.maxFrames) {
      if (this.frameRate % 10 == 0) {
        this.frameX++;
      }
    } else {
      this.frameX = 0;
    }

    if(this.y + this.r/2 > this.height || this.y -this.r/2 < 100){
      this.speedY *= -1
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
