export default class Player {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.x = this.width / 4;
    this.y = this.height / 2;
    this.w = 40;
    this.h = 72;
    this.spriteWidth = 40;
    this.spriteHeight = 72;
    this.frameX = 0;
    this.frameY = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.image = document.getElementById("chewieImage");
    this.maxFrames = 3;
    this.frameRate = 64;
    this.r = 60;
    this.isWalking = false;
  }
  draw(context) {
    // context.strokeStyle = "green";
    // context.lineWidth = 3;
    // context.strokeRect(this.x, this.y, this.w, this.h);
    // context.beginPath()
    // context.strokeStyle = 'white'
    // context.arc(this.x + this.spriteWidth/2, this.y + this.spriteHeight/2, this.r, 0, Math.PI * 2)
    // context.stroke()
    // context.closePath()

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
    if (this.frameX < this.maxFrames && this.isWalking) {
      if (this.frameRate % 10 == 0) {
        this.frameX++;
      }
    } else {
      this.frameX = 0;
    }
  }
  edges() {
    if (this.y <= 100) {
      this.y = 100;
    }
    if (this.y + this.h >= this.height) {
      this.y = this.height - this.h;
    }
    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.x + this.w >= this.width) {
      this.x = this.width - this.w;
    }
  }
}
