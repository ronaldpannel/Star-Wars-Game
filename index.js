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

const expSound1 = document.getElementById("explosion1");
const expSound2 = document.getElementById("explosion2");
const expSound3 = document.getElementById("explosion3");
const expSound4 = document.getElementById("explosion4");
const expSound5 = document.getElementById("explosion5");
const expSound6 = document.getElementById("explosion6");

const laserSound = document.getElementById("laserSound");

const startPage = document.getElementById("startPage");
const startGameBtn = document.getElementById("startBtn");
const reStartGameBtn = document.getElementById("restartBtn");
const cloudAnimation = document.getElementById("cloud");

const refugeeArray = [];
const enemyArray = [];
let explosionArray = [];
let darthMaulArray = [];
let laseArray = [];
let soundArray = [
  expSound1,
  expSound2,
  expSound3,
  expSound4,
  expSound5,
  expSound6,
];

let refugeeCaptured = 0;
let refugeeSaved = 0;
let stormTroopersDestroyed = 0;
let darthmaulClonesDestroyed = 0;
let gameOver = true;

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
function startGame() {
  gameOver = false;
  requestAnimationFrame(animate);
}

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
  let y = Math.random() * (canvas.height - 50 - 100) + 100;

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
      soundArray[Math.floor(Math.random() * soundArray.length)].play();
      enemyArray.splice(i, 1);
      stormTroopersDestroyed++;
      explosionArray.push(
        new Explosion(canvas.width, canvas.height, player.x, player.y)
      );
    }
  }
}

function playerDarthMaulCollision() {
  for (let i = 0; i < darthMaulArray.length; i++) {
    if (darthMaulArray[i].isColliding(player)) {
      soundArray[Math.floor(Math.random() * soundArray.length)].play();
      reStartGameBtn.classList.add("restartActive");
      ctx.fillStyle = "black";
      ctx.font = "60px arial";
      ctx.fillText(" GAME OVER", canvas.width / 2 - 200, canvas.height / 2);

      ctx.font = "30px arial";
      ctx.fillText(
        " You Have Been Destroyed by the Darthmaul Clones",
        canvas.width / 2 - 350,
        canvas.height / 2 + 100
      );
      explosionArray.push(
        new Explosion(canvas.width, canvas.height, player.x, player.y)
      );

      setTimeout(() => {
        gameOver = true;
      }, 100);
    }
  }
}

function darthmaulLaserCollision() {
  for (let i = darthMaulArray.length - 1; i > 0; i--) {
    for (let j = laseArray.length - 1; j > 0; j--) {
      if (darthMaulArray[i].isColliding(laseArray[j])) {
        soundArray[Math.floor(Math.random() * soundArray.length)].play();
        darthmaulClonesDestroyed++;
        explosionArray.push(
          new Explosion(
            canvas.width,
            canvas.height,
            darthMaulArray[i].x,
            darthMaulArray[i].y
          )
        );
        darthMaulArray.splice(i, 1);
        laseArray.splice(j, 1);
      }
    }
  }
}

function enemyRefugeeCollision() {
  for (let i = enemyArray.length - 1; i > 0; i--) {
    for (let j = refugeeArray.length - 1; j > 0; j--) {
      if (enemyArray[i].isColliding(refugeeArray[j])) {
        soundArray[Math.floor(Math.random() * soundArray.length)].play();
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
  ctx.font = "14px arial";
  ctx.fillText(`Refugees Captured: ${refugeeCaptured}`, 20, canvas.height - 20);
  ctx.fillText(`Refugees Saved: ${refugeeSaved}`, 210, canvas.height - 20);
  ctx.fillText(
    `Storm Troopers Destroyed: ${stormTroopersDestroyed}`,
    380,
    canvas.height - 20
  );
  ctx.fillText(
    `DarthMauls Destroyed: ${darthmaulClonesDestroyed}`,
    590,
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
function gameWinConditions() {
  if (darthmaulClonesDestroyed >= 20) {
    reStartGameBtn.classList.add("restartActive");
    ctx.font = "42px arial";
    ctx.fillStyle = "blue";
    ctx.fillText("'YOU WIN'", canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.font = "32px arial";
    ctx.fillText(
      "You Have Destroyed Twenty Darthmaul Clones",
      canvas.width / 2 - 300,
      canvas.height / 2
    );
    ctx.font = "26px arial";
    ctx.fillText(
      "LeaderShip Depleted, Storm Troopers are Retreating ",
      canvas.width / 2 - 280,
      canvas.height / 2 + 50
    );
    setTimeout(() => {
      gameOver = true;
    }, 300);
  } else if (refugeeSaved >= 50) {
    reStartGameBtn.classList.add("restartActive");
    ctx.font = "42px arial";
    ctx.fillStyle = "blue";
    ctx.fillText("'YOU WIN'", canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.font = "32px arial";
    ctx.fillText(
      "Millennium Falcon is Full and is about to Launch",
      canvas.width / 2 - 330,
      canvas.height / 2
    );
    setTimeout(() => {
      gameOver = true;
    }, 100);
  } else if (stormTroopersDestroyed >= 100) {
    reStartGameBtn.classList.add("restartActive");
    ctx.font = "42px arial";
    ctx.fillStyle = "blue";
    ctx.fillText("'YOU WIN'", canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.font = "32px arial";
    ctx.fillText(
      "You have destroyed 100 Storm Troopers ",
      canvas.width / 2 - 280,
      canvas.height / 2
    );
    ctx.font = "32px arial";
    ctx.fillText(
      "Storm Troopers are Retreating ",
      canvas.width / 2 - 200,
      canvas.height / 2 + 50
    );

    setTimeout(() => {
      gameOver = true;
    }, 100);
  } else if (refugeeCaptured >= 100) {
    reStartGameBtn.classList.add("restartActive");
    ctx.fillStyle = "black";
    ctx.font = "60px arial";
    ctx.fillText(" GAME OVER", canvas.width / 2 - 200, canvas.height / 2);

    ctx.font = "30px arial";
    ctx.fillText(
      " 100 Refugees captured cannot Fill Ship",
      canvas.width / 2 - 300,
      canvas.height / 2 + 100
    );
    ctx.font = "30px arial";
    ctx.fillText(
      "Millennium Falcon Launching Empty ",
      canvas.width / 2 - 270,
      canvas.height / 2 + 150
    );

    setTimeout(() => {
      gameOver = true;
    }, 100);
  } else if (darthmaulClonesDestroyed >= 20) {
    reStartGameBtn.classList.add("restartActive");
    ctx.fillStyle = "black";
    ctx.font = "60px arial";
    ctx.fillText(" YOU WIN", canvas.width / 2 - 200, canvas.height / 2);

    ctx.font = "30px arial";
    ctx.fillText(
      " You have destroyed 20 Darthmaul Clones",
      canvas.width / 2 - 300,
      canvas.height / 2 + 100
    );
    ctx.font = "30px arial";
    ctx.fillText(
      "Storm Trooper Regiment Retreating  ",
      canvas.width / 2 - 270,
      canvas.height / 2 + 150
    );

    setTimeout(() => {
      gameOver = true;
    }, 100);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameRate++;
  if (frameRate % 40 == 0) {
    initRefugees();
  }

  if (frameRate % 40 == 0) {
    initEnemies();
  }
  if (frameRate % 150 == 0) {
    initDarthMaul();
  }
  for (let i = laseArray.length - 1; i > 0; i--) {
    laseArray[i].draw(ctx);
    laseArray[i].update();
    if (laseArray[i].edges()) {
      laseArray.splice(i, 1);
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
  playerDarthMaulCollision();
  darthmaulLaserCollision();
  displayScores();
  enemyPlayerAvoid();
  gameWinConditions();

  for (let i = 0; i < explosionArray.length; i++) {
    explosionArray[i].draw(ctx);
    explosionArray[i].update();
    if (explosionArray[i].frameX > explosionArray[i].maxFrames) {
      explosionArray.splice(i, 1);
    }
  }
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
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
      keys.fKey.pressed = true;
      laserSound.play();
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
      laserSound.play();
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
      laserSound.play();
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
    if (player.frameY === 0) {
      laserSound.play();
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
    //player.isWalking = false;
    player.frameY = null;
  }
});

startGameBtn.addEventListener("click", (e) => {
  cloudAnimation.classList.add("cloudActive");

  setTimeout(() => {
    startPage.classList.add("inactive");
    startGame();
  }, 900);
});
reStartGameBtn.addEventListener("click", (e) => {
  location.reload();
});
