import Player from "./player.js";
import Refugee from "./refugee.js";
import Enemy from "./enemy.js";
import Explosion from "./explosion.js";

/**@type{HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const refugeeArray = [];
const enemyArray = [];
let explosionArray = [];

let refugeeCaptured = 0;
let refugeeSaved = 0;
let stormTroopersDestroyed = 0;

let frameRate = 0;
const keys = {
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  arrowUp: {
    pressed: false,
  },
  arrowDown: {
    pressed: false,
  },
};

const player = new Player(canvas.width, canvas.height);

function movePlayer() {
  if (keys.arrowLeft.pressed) {
    player.speedX = -5;
    player.frameY = 1;
  }
  if (keys.arrowRight.pressed) {
    player.speedX = 5;
    player.frameY = 2;
  }
  if (keys.arrowUp.pressed) {
    player.speedY = -5;
    player.frameY = 3;
  }
  if (keys.arrowDown.pressed) {
    player.speedY = 5;
    player.frameY = 0;
  }
}
function initRefugees() {
  let x = Math.random() * (80 - 0) + 20;
  refugeeArray.push(new Refugee(canvas.width, canvas.height, x));
}

function initEnemies() {
  let x =
    Math.random() * (canvas.width + 150 - (canvas.width + 50)) +
    (canvas.width + 50);
  let y = Math.random() * (canvas.height - 50 - 100) + 100;

  enemyArray.push(new Enemy(canvas.width, canvas.height, x, y));
}

function playerEnemyCollision() {
  for (let i = enemyArray.length - 1; i > 0; i--) {
    if (enemyArray[i].isColliding(player)) {
      enemyArray.splice(i, 1);
      stormTroopersDestroyed++;
      explosionArray.push(
        new Explosion(
          canvas.width,
          canvas.height,
          player.x,
          player.y,
        )
      );
    }
  }
}

function enemyRefugeeCollision() {
  for (let i = enemyArray.length - 1; i > 0; i--) {
    for (let j = refugeeArray.length - 1; j > 0; j--) {
      if (enemyArray[i].isColliding(refugeeArray[j])) {
        refugeeArray.splice(j, 1);
        refugeeCaptured++;
        explosionArray.push(
          new Explosion(canvas.width, canvas.height, enemyArray[i].x, enemyArray[i].y)
        );
      }
    }
  }
}

function displayScores() {
  ctx.fillStyle = "black";
  ctx.font = "16px arial";
  ctx.fillText(`Refugees Captured: ${refugeeCaptured}`, 20, canvas.height - 20);
  ctx.fillText(`Refugees Saved: ${refugeeSaved}`, 210, canvas.height - 20);
  ctx.fillText(
    `Storm Troopers Destroyed: ${stormTroopersDestroyed}`,
    380,
    canvas.height - 20
  );
}
function enemyPlayerAvoid(){
  for(let i = 0; i < enemyArray.length; i++){
    let dx = player.x - enemyArray[i].x
    let dy = player.y - enemyArray[i].y
    let distance = Math.sqrt(dx * dx + dy * dy)
    if(distance < player.r + enemyArray[i].r && !player.isWalking){
      if(player.y > enemyArray[i].y){
        enemyArray[i].speedY = -1.5;
      }else{
         enemyArray[i].speedY = 1.5;
      }

      // if(player.y > enemyArray[i].y){
      //   enemyArray[i].speedY = -1.5
      // }else if( player.x > enemyArray[i].x && player.y < enemyArray[i].y){
      //   enemyArray[i].speedY = 0
      // }
     
    
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameRate++;
  if (frameRate % 70 == 0) {
    initRefugees();
  }

  if (frameRate % 40 == 0) {
    initEnemies();
  }

  player.draw(ctx);
  player.update();
  player.edges();

  for (let i = refugeeArray.length - 1; i > 0; i--) {
    refugeeArray[i].draw(ctx);
    refugeeArray[i].update();

    if (refugeeArray[i].y <= 120) {
      refugeeArray.splice(i, 1);
      refugeeSaved++;
    }
  }

  for (let i = enemyArray.length - 1; i > 0; i--) {
    enemyArray[i].draw(ctx);
    enemyArray[i].update();
    if (enemyArray[i].x <= -50) {
      enemyArray.splice(i, 1);
    }
  }
  movePlayer();
  playerEnemyCollision();
  enemyRefugeeCollision();
  displayScores();
  enemyPlayerAvoid();

  for (let i = 0; i < explosionArray.length; i++) {
    explosionArray[i].draw(ctx);
    explosionArray[i].update();
    if (explosionArray[i].frameX > explosionArray[i].maxFrames) {
      explosionArray.splice(i, 1);
    }
  }
  requestAnimationFrame(animate);
}
animate();
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    keys.arrowLeft.pressed = true;
    player.isWalking = true;
  }
  if (e.key === "ArrowRight") {
    keys.arrowRight.pressed = true;
    player.isWalking = true;
  }
  if (e.key === "ArrowUp") {
    keys.arrowUp.pressed = true;
    player.isWalking = true;
  }
  if (e.key === "ArrowDown") {
    keys.arrowDown.pressed = true;
    player.isWalking = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    keys.arrowLeft.pressed = false;
    player.speedX = 0;
    player.isWalking = false;
  }
  if (e.key === "ArrowRight") {
    keys.arrowRight.pressed = false;
    player.speedX = 0;
    player.isWalking = false;
  }
  if (e.key === "ArrowUp") {
    keys.arrowUp.pressed = false;
    player.speedY = 0;
    player.isWalking = false;
  }
  if (e.key === "ArrowDown") {
    keys.arrowDown.pressed = false;
    player.speedY = 0;
    player.isWalking = false;
  }
});
