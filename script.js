const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const endScreen = document.getElementById("endScreen");
const finalScore = document.getElementById("finalScore");
const rewardCode = document.getElementById("rewardCode");
const restartBtn = document.getElementById("restartBtn");

const mobileControls = document.getElementById("mobileControls");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let score = 0;
let timeLeft = 30;
let gameInterval;
let pumpkinInterval;
let playerX;
let gameActive = false;
let step = 20;

function startGame() {
  score = 0;
  timeLeft = 30;
  gameActive = true;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.classList.add("hidden");
  endScreen.style.display = "none";

  playerX = window.innerWidth / 2;
  player.style.left = playerX + "px";

  pumpkinInterval = setInterval(spawnPumpkin, 700);
  gameInterval = setInterval(updateTimer, 1000);

  document.addEventListener("keydown", movePlayer);

  // Mobile só aparece se a largura da tela <= 768
  if (window.innerWidth <= 768) {
    mobileControls.style.display = "flex";
  } else {
    mobileControls.style.display = "none";
  }
}

function movePlayer(e) {
  if (!gameActive) return;
  const key = e.key.toLowerCase();
  if (key === "a" || key === "arrowleft") {
    playerX -= step;
  } else if (key === "d" || key === "arrowright") {
    playerX += step;
  }

  // limites da tela
  if (playerX < 0) playerX = 0;
  if (playerX > window.innerWidth - 50) playerX = window.innerWidth - 50;

  player.style.left = playerX + "px";
}

// Mobile buttons
leftBtn.addEventListener("touchstart", () => moveMobile(-step));
rightBtn.addEventListener("touchstart", () => moveMobile(step));
leftBtn.addEventListener("mousedown", () => moveMobile(-step));
rightBtn.addEventListener("mousedown", () => moveMobile(step));

function moveMobile(distance) {
  if (!gameActive) return;
  playerX += distance;

  if (playerX < 0) playerX = 0;
  if (playerX > window.innerWidth - 50) playerX = window.innerWidth - 50;

  player.style.left = playerX + "px";
}

function spawnPumpkin() {
  const pumpkin = document.createElement("div");
  pumpkin.classList.add("pumpkin");
  pumpkin.textContent = "🎃";
  pumpkin.style.left = Math.random() * (window.innerWidth - 40) + "px";
  pumpkin.style.top = "-50px";

  game.appendChild(pumpkin);

  let pos = -50;
  const fallSpeed = 4 + Math.random() * 3;

  const fall = setInterval(() => {
    if (!gameActive) {
      pumpkin.remove();
      clearInterval(fall);
      return;
    }

    pos += fallSpeed;
    pumpkin.style.top = pos + "px";

    const pumpkinRect = pumpkin.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      pumpkinRect.bottom >= playerRect.top &&
      pumpkinRect.left + 10 < playerRect.right &&
      pumpkinRect.right - 10 > playerRect.left
    ) {
      score++;
      scoreDisplay.textContent = score;
      pumpkin.remove();
      clearInterval(fall);
    }

    if (pos > window.innerHeight) {
      pumpkin.remove();
      clearInterval(fall);
    }
  }, 30);
}

function updateTimer() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(pumpkinInterval);
  document.removeEventListener("keydown", movePlayer);
  document.querySelectorAll(".pumpkin").forEach(p => p.remove());
  finalScore.textContent = score;
  rewardCode.textContent = generateRewardCode(score);
  endScreen.style.display = "block";
  startBtn.classList.remove("hidden");
}

function generateRewardCode(points) {
  if (points >= 15) {
    return "SPOOK-" + Math.floor(Math.random() * 9000 + 1000);
  }
  return "Tente fazer +15 pontos!";
}

restartBtn.addEventListener("click", startGame);
startBtn.addEventListener("click", startGame);
