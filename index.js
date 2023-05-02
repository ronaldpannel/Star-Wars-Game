import Player from "./player.js";
import Refugee from "./refugee.js";
import Enemy from "./enemy.js";
import Explosion from "./explosion.js";
import DarthMaul from "./darthMaul.js";
import LaserParticle from "./laserParticle.js";

/**@type{HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const refugeeArray = [];
const enemyArray = [];
let explosionArray = [];
let darthMaulArray = [];
let laseArray = [];

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
  fKey: {
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
    Math.random() * (canvas.width + 50 - (canvas.width + 25)) +
    (canvas.width + 25);
  let y = Math.random() * (canvas.height - 50 - 50) + 50;

  enemyArray.push(new Enemy(canvas.width, canvas.height, x, y));
}

function initDarthMaul() {
  let x =
    Math.random() * (canvas.width + 150 - (canvas.width + 50)) +
    (canvas.width + 50);
  let y = Math.random() * (canvas.height - 50 - 100) + 100;

  darthMaulArray.push(new DarthMaul(canvas.width, canvas.height, x, y));
}

function playerEnemyCollision() {
  for (let i = enemyArray.length - 1; i > 0; i--) {
    if (enemyArray[i].isColliding(player)) {
      enemyArray.splice(i, 1);
      stormTroopersDestroyed++;
      explosionArray.push(
        new Explosion(canvas.width, canvas.height, player.x, player.y)
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
          new Explosion(
            canvas.width,
            canvas.height,
            enemyArray[i].x,
            enemyArray[i].y
          )
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
function enemyPlayerAvoid() {
  for (let i = 0; i < enemyArray.length; i++) {
    let dx = player.x - enemyArray[i].x;
    let dy = player.y - enemyArray[i].y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player.r + enemyArray[i].r && !player.isWalking) {
      if (player.y > enemyArray[i].y) {
        enemyArray[i].speedY = -1.5;
      } else {
        enemyArray[i].speedY = 1.5;
      }
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
  if (frameRate % 150 == 0) {
    initDarthMaul();
  }
  for (let i = laseArray.length-1; i > 0; i--) {
    laseArray[i].draw(ctx);
    laseArray[i].update();
    if(laseArray[i].edges()){
      laseArray.splice(i, 1)
    }
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

  for (let i = darthMaulArray.length - 1; i > 0; i--) {
    darthMaulArray[i].draw(ctx);
    darthMaulArray[i].update();
    if (darthMaulArray[i].x <= -50) {
      darthMaulArray.splice(i, 1);
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
  console.log(laseArray.length)
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
  if (e.key === "f") {
    if (player.frameY == 1) {
      keys.fKey.pressed=true
      laseArray.push(
        new LaserParticle(
          canvas.width,
          canvas.height,
          player.x + player.w / 2,
          player.y + player.h / 2,
          -3,
          0,
          -0.5,
          0
        )
      );
    }
     if (player.frameY == 2) {
       laseArray.push(
         new LaserParticle(
           canvas.width,
           canvas.height,
           player.x + player.w / 2,
           player.y + player.h / 2,
           3,
           0,
           0.5,
           0
         )
       );
     }
        if (player.frameY == 3) {
          laseArray.push(
            new LaserParticle(
              canvas.width,
              canvas.height,
              player.x + player.w / 2,
              player.y + player.h / 2,
              0,
              -3,
              0,
              -0.5
            )
          );
        }
  }  if (player.frameY === 0) {
    laseArray.push(
      new LaserParticle(
        canvas.width,
        canvas.height,
        player.x + player.w / 2,
        player.y + player.h / 2,
        0,
        3,
        0,
        0.5
      )
    );
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
 if (e.key === "f") {
   keys.fKey.pressed = false;
  //  player.isWalking = false;
   player.frameY = null
 }
});
