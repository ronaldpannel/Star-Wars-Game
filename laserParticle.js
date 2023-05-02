export default class LaserParticle {
  constructor(width, height, x, y, velX, velY, accX, accY) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.r = 5;
    this.velX = velX;
    this.velY = velY
    this.accX = accX
    this.accY = accY
  }
  draw(context) {
    context.beginPath();
    context.fillStyle = " white";
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }
  update(){
    this.velX += this.accX
    this.velY += this.accY
    this.x += this.velX
    this.y += this.velY
  }
  edges(){
    if(this.x <= 0 || this.x >= this.width || this.y <= 0 || this.y >= this.height)
    return true
  }
}
