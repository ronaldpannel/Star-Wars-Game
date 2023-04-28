export default class Refugee {
  constructor(width, height, x) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = this.height + 50;
    this.w = 32;
    this.h = 48;
    this.spriteWidth = 32;
    this.spriteHeight = 48;
    this.frameX = 0;
    this.frameY = 3;
    this.speedX = 0;
    this.speedY = -0.5;
    this.image = document.getElementById("refugeeImage");
    this.maxFrames = 3;
    this.frameRate = 60;
  }
  draw(context) {
    context.strokeStyle = "red";
    context.lineWidth = 3;
    //context.strokeRect(this.x, this.y, this.w, this.h);

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
    this.y += this.speedY;
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
  }
}
