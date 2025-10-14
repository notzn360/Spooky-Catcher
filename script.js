const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const endScreen = document.getElementById("endScreen");
const finalScore = document.getElementById("finalScore");
const rewardCode = document.getElementById("rewardCode");

let score = 0;
let timeLeft = 30;
let gameInterval;
let pumpkinInterval;
let playerX = 180;
let gameActive = false;

function startGame() {
  score = 0;
  timeLeft = 30;
  gameActive = true;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.classList.add("hidden");
  endScreen.classList.add("hidden");

  gameInterval = setInterval(updateTimer, 1000);
  pumpkinInterval = setInterval(spawnPumpkin, 700);

  document.addEventListener("keydown", movePlayer);
}

function movePlayer(e) {
  if (!gameActive) return;
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 20;
  } else if (e.key === "ArrowRight" && playerX < 360) {
    playerX += 20;
  }
  player.style.left = playerX + "px";
}

function spawnPumpkin() {
  const pumpkin = document.createElement("div");
  pumpkin.classList.add("pumpkin");
  pumpkin.textContent = "🎃";
  pumpkin.style.left = Math.random() * 370 + "px";
  pumpkin.style.animationDuration = "2.5s";

  game.appendChild(pumpkin);

  let fall = setInterval(() => {
    const pumpkinRect = pumpkin.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      pumpkinRect.bottom >= playerRect.top &&
      pumpkinRect.left < playerRect.right &&
      pumpkinRect.right > playerRect.left
    ) {
      score++;
      scoreDisplay.textContent = score;
      pumpkin.remove();
      clearInterval(fall);
    }

    if (pumpkinRect.top > 400) {
      pumpkin.remove();
      clearInterval(fall);
    }
  }, 50);
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
  endScreen.classList.remove("hidden");
  startBtn.classList.remove("hidden");
}

function restartGame() {
  startGame();
}

function generateRewardCode(points) {
  if (points >= 15) {
    return "BOO-" + Math.floor(Math.random() * 9000 + 1000);
  }
  return "Tente fazer +15 pontos!";
}

startBtn.addEventListener("click", startGame);
