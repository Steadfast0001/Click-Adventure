let score = 0;
let gameInterval;
let spawnSpeed = 2000;
let balloonId = 0;
let isGameOver = false;
let missedPositive = 0;
let level = 1;
let positiveMissLimit = 100;
let highScore = localStorage.getItem("clickgame_highscore") || 0;
let balloonSpeedBase = 2; // base speed for balloon rising
let balloonSpeedIncrement = 0.05; // speed increment per 5 seconds
let gameStartTime = 0;

// Show high score on welcome screen
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", playBtnSound);
    btn.addEventListener("touchstart", playBtnSound, {passive: false});
  });
  showHighScore();
});

function showHighScore() {
  let instructions = document.getElementById("welcomeInstructions");
  let hsElem = document.getElementById("highScoreDisplay");
  if (!hsElem) {
    hsElem = document.createElement("div");
    hsElem.id = "highScoreDisplay";
    hsElem.style.fontWeight = "bold";
    hsElem.style.color = "#388e3c";
    hsElem.style.marginBottom = "12px";
    instructions.insertBefore(hsElem, instructions.children[2]);
  }
  hsElem.innerHTML = "High Score: <span style='color:#1565c0'>" + highScore + "</span>";
}

function playBtnSound() {
  const btnSound = document.getElementById("btnSound");
  btnSound.currentTime = 0;
  btnSound.play();
}

// Play button sound after any button click
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", function() {
    let btnSound = document.getElementById("btnSound");
    btnSound.currentTime = 0;
    btnSound.play().catch(() => {});
  });
});

// Play background music after starting either game
document.getElementById("startBtn").addEventListener("click", function() {
  let bgMusic = document.getElementById("bgMusic");
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
});
document.getElementById("startTypingBtn").addEventListener("click", function() {
  let bgMusic = document.getElementById("bgMusic");
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
});

// Update startGame to record the start time
function startGame() {
  document.getElementById("welcomeInstructions").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("game").style.display = "block";
  score = 0;
  missedPositive = 0;
  isGameOver = false;
  spawnSpeed = 2000;
  level = 1;
  gameStartTime = Date.now(); // record game start time
  document.getElementById("scoreBoard").innerText = "Score: 0";
  document.getElementById("levelMeter").innerText = "Level: 1";
  document.getElementById("bgMusic").currentTime = 0;
  document.getElementById("bgMusic").play();
  gameInterval = setInterval(spawnBalloon, spawnSpeed);
}

// Update spawnBalloon to increase riseSpeed as time passes
function spawnBalloon() {
  if (isGameOver) return;

  let game = document.getElementById("game");
  let balloon = document.createElement("div");
  balloon.classList.add("balloon");
  balloon.id = "balloon" + balloonId++;

  // Add rope to balloon
  let rope = document.createElement("div");
  rope.className = "balloon-rope";
  balloon.appendChild(rope);

  // Assign a color from the pool, each with its own gradient for visual distinction
  const colorPool = [
    {name: "green", gradient: "linear-gradient(135deg,#43ea6d 60%,#1b7e2c 100%)"},
    {name: "blue", gradient: "linear-gradient(135deg,#2b9dfc 60%,#0a3d91 100%)"},
    {name: "yellow", gradient: "linear-gradient(135deg,#ffe066 60%,#e1ad01 100%)"},
    {name: "purple", gradient: "linear-gradient(135deg,#b366ff 60%,#6c3483 100%)"},
    {name: "red", gradient: "linear-gradient(135deg,#ff1744 60%,#b71c1c 100%)"},
    {name: "black", gradient: "linear-gradient(135deg,#444 60%,#000 100%)"},
    {name: "gray", gradient: "linear-gradient(135deg,#bdbdbd 60%,#616161 100%)"}
  ];
  let colorObj = colorPool[Math.floor(Math.random() * colorPool.length)];
  balloon.style.background = colorObj.gradient;

  balloon.style.left = Math.random() * (window.innerWidth - 60) + "px";
  balloon.style.top = window.innerHeight + "px";

  // Assign a random value from -100 to 100 (excluding zero for more action)
  let value = Math.floor(Math.random() * 201) - 100;
  if (value === 0) value = 1;

  // 20% chance for a balloon to have no number (empty), which leads to game over if clicked
  let hasNumber = Math.random() > 0.2;
  let balloonText = document.createElement("span");
  balloonText.innerText = hasNumber ? value : "";
  balloonText.style.zIndex = "4";
  balloon.appendChild(balloonText);

  balloon.addEventListener("click", burstBalloon);
  balloon.addEventListener("touchstart", burstBalloon, {passive: false});

  function burstBalloon(e) {
    e.preventDefault();
    let popSound = document.getElementById("popSound");
    popSound.currentTime = 0;
    popSound.play().catch(() => {});
    balloon.classList.add("burst");
    setTimeout(() => balloon.remove(), 350); // Remove after burst animation

    if (!hasNumber) {
      endGame("💥 You clicked a balloon without a number!");
    } else if (value < 0) {
      score += value;
      if (score < 0) score = 0;
      document.getElementById("scoreBoard").innerText = "Score: " + score;
    } else if (value > 0) {
      score += value;
      document.getElementById("scoreBoard").innerText = "Score: " + score;
      if (score >= 10000) {
        winGame();
      }
    }
    updateHighScore();
  }

  game.appendChild(balloon);

  // Calculate elapsed time in seconds
  let elapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
  // Increase speed every 5 seconds
  let dynamicSpeed = balloonSpeedBase + level * 0.7 + Math.min(level * 0.2, 3) + Math.floor(elapsedSeconds / 5) * balloonSpeedIncrement;

  let rise = setInterval(() => {
    if (!document.getElementById(balloon.id)) {
      clearInterval(rise);
      return;
    }
    let y = parseInt(balloon.style.top);
    if (y < -80) {
      if (hasNumber && value > 0) {
        missedPositive++;
        if (missedPositive >= positiveMissLimit) {
          endGame("💨 Too many missed balloons!");
        }
      }
      balloon.remove();
      clearInterval(rise);
    } else {
      balloon.style.top = (y - dynamicSpeed) + "px";
    }
  }, 20);

  if (score >= level * 1000 && spawnSpeed > 350) {
    clearInterval(gameInterval);
    level++;
    spawnSpeed = Math.max(350, spawnSpeed - 180 - Math.floor(level * 10));
    document.getElementById("levelMeter").innerText = "Level: " + level;
    gameInterval = setInterval(spawnBalloon, spawnSpeed);
  }
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("clickgame_highscore", highScore);
    showHighScore();
  }
}

function endGame(msg) {
  isGameOver = true;
  clearInterval(gameInterval);
  document.getElementById("bgMusic").pause();
  document.getElementById("game").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("gameOverMsg").innerText = msg;
  removeAllBalloons();
  updateHighScore();
}

function winGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  document.getElementById("bgMusic").pause();
  document.getElementById("game").style.display = "none";
  document.getElementById("winScreen").style.display = "block";
  launchConfetti();
  removeAllBalloons();
  updateHighScore();
}

function resetGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("welcomeInstructions").style.display = "block";
  score = 0;
  missedPositive = 0;
  level = 1;
  spawnSpeed = 2000;
  document.getElementById("scoreBoard").innerText = "Score: 0";
  document.getElementById("levelMeter").innerText = "Level: 1";
}