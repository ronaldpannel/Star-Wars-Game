export default class LaserParticle {
  constructor(width, height, x, y, velX, velY, accX, accY) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32
    this.velX = velX;
    this.velY = velY
    this.accX = accX
    this.accY = accY
    this.image = document.getElementById("laserBallImage");
  }
  draw(context) {
    context.strokeStyle = " white";
    // context.strokeRect(this.x,this.y,this.w, this.h)

    context.drawImage(this.image, this.x - this.w/2, this.y - this.h/2,this.w, this.h)
  }
  update(){
    this.velX += this.accX
    this.velY += this.accY
    this.x += this.velX
    this.y += this.velY
  }
  edges(){
    if(this.x <= 0 || this.x >= this.width -50 || this.y <= 0 || this.y >= this.height)
    return true
  }
}
