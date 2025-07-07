const gameScreen = document.getElementById("game-screen");
const scoreValue = document.getElementById("score-value");
const timeValue = document.getElementById("time-value");
const highscoreValue = document.getElementById("highscore-value");
const startButton = document.getElementById("start-button");
const endModal = document.getElementById("end-modal");
const finalScore = document.getElementById("final-score");
const playAgainButton = document.getElementById("play-again-button");

// Game State Variables
const GAME_DURATION = 30; // seconds
let score = 0;
let timer = GAME_DURATION;
let highScore = 0;
let gameInterval = null;
let timerInterval = null;
let isGameRunning = false;

/**
 * @function createAnt
 * Creates a new ant element and sets its initial position and movement.
 */
function createAnt() {
  const ant = document.createElement("div");
  ant.classList.add("ant-smasher__ant");

  const screenWidth = gameScreen.clientWidth;
  const screenHeight = gameScreen.clientHeight;

  const startX = Math.random() * screenWidth;
  const startY = Math.random() < 0.5 ? -50 : screenHeight + 50;

  ant.style.left = `${startX}px`;
  ant.style.top = `${startY}px`;

  gameScreen.appendChild(ant);

  setTimeout(() => {
    const endX = Math.random() * screenWidth;
    const endY = startY > 0 ? -50 : screenHeight + 50;
    const duration = Math.random() * 2000 + 3000; // 3 - 5 seconds
    const rotation = Math.random() * 180 - 90;

    ant.style.transition = `all ${duration / 1000}s linear`;
    ant.style.transform = `rotate(${rotation}deg)`;
    ant.style.left = `${endX}px`;
    ant.style.top = `${endY}px`;
  }, 10);

  ant.addEventListener("click", smashAnt);

  setTimeout(() => {
    if (ant.parentElement) {
      gameScreen.removeChild(ant);
    }
  }, 5500);
}

/**
 * @function smashAnt
 * Handles the logic when an ant is clicked (squashed).
 * @param {MouseEvent} event - The click event object.
 */
function smashAnt(event) {
  const ant = event.currentTarget;

  ant.removeEventListener("click", smashAnt);
  score++;
  scoreValue.textContent = score;

  ant.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50,10 C 25,15 15,35 20,60 C 25,85 45,95 70,85 C 95,75 90,45 80,25 C 70,5 55,5 50,10 Z" fill="#8B4513" opacity="0.8"/><line x1="20" y1="60" x2="5" y2="70" stroke="#333" stroke-width="3" /><line x1="80" y1="25" x2="95" y2="15" stroke="#333" stroke-width="3" /><line x1="70" y1="85" x2="80" y2="95" stroke="#333" stroke-width="3" /></svg>`;

  ant.style.transition = "all 0.3s ease-out";
  ant.style.transform += " scale(1.1)";

  setTimeout(() => {
    if (ant.parentElement) {
      gameScreen.removeChild(ant);
    }
  }, 500);
}

/**
 * @function updateTimer
 * Decrements the timer and ends the game when it reaches 0.
 */
function updateTimer() {
  timer--;
  timeValue.textContent = timer;
  if (timer <= 0) {
    endGame();
  }
}

/**
 * @function startGame
 * Initializes the game state and starts the intervals.
 */
function startGame() {
  if (isGameRunning) return;
  isGameRunning = true;

  // Initial state
  score = 0;
  timer = GAME_DURATION;
  scoreValue.textContent = score;
  timeValue.textContent = timer;
  gameScreen.innerHTML = "";
  endModal.classList.remove("ant-smasher__end-modal--visible");

  gameInterval = setInterval(createAnt, 1000);
  timerInterval = setInterval(updateTimer, 1000);

  startButton.style.display = "none";
}

/**
 * @function endGame
 * Stops the game and displays the final score.
 */
function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("antSmasherHighScore", highScore);
    highscoreValue.textContent = highScore;
  }

  finalScore.textContent = score;
  endModal.classList.add("ant-smasher__end-modal--visible");
  startButton.style.display = "block";
}

/**
 * @function loadHighScore
 * Loads the high score from localStorage on page load.
 */
function loadHighScore() {
  const savedHighScore = localStorage.getItem("antSmasherHighScore");
  if (savedHighScore) {
    highScore = parseInt(savedHighScore, 10);
    highscoreValue.textContent = highScore;
  }
}

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

window.addEventListener("load", loadHighScore);
