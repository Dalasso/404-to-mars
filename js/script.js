// =====================
// CONFIGURACIÓN BÁSICA
// =====================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

let gameStarted = false;
let gameOver = false;

let frame = 0;
let keys = {};
let stars = [];
let enemies = [];
let bullets = [];
let startTime;

// Ajuste responsivo
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// =====================
// ENTIDADES
// =====================
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 80,
  width: 40,
  height: 20,
  color: "#00ff88",
  speed: 6, // Velocidad fija del jugador
};

// =====================
// CONTROLES
// =====================
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  if (!gameStarted && !gameOver && e.code === "Enter") startGame();
  else if (gameOver && e.code === "Enter") backToStart();
});

window.addEventListener("keyup", (e) => (keys[e.code] = false));

// =====================
// FUNCIONES DE ESTADO
// =====================
function startGame() {
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameStarted = true;
  gameOver = false;

  frame = 0;
  startTime = performance.now();
  stars = [];
  enemies = [];
  bullets = [];

  player.x = canvas.width / 2 - player.width / 2;
  requestAnimationFrame(update);
}

function triggerGameOver() {
  gameStarted = false;
  gameOver = true;
  gameOverScreen.classList.remove("hidden");
}

function backToStart() {
  gameOver = false;
  startScreen.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
}

// =====================
// CREACIÓN DE ENTIDADES
// =====================
function createStar() {
  stars.push({
    x: Math.random() * canvas.width,
    y: -5,
    size: Math.random() * 2,
    speed: 2 + Math.random() * 2,
  });
}

function createEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 20,
    color: "#ff3333",
    baseSpeed: 1.5 + Math.random(), // velocidad base
  });
}

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y,
    width: 4,
    height: 10,
    color: "#00ffcc",
    speed: 8,
  });
}

// =====================
// BUCLE PRINCIPAL
// =====================
function update() {
  if (!gameStarted) return;

  frame++;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fondo estrellado
  if (frame % 3 === 0) createStar();
  ctx.fillStyle = "white";
  stars.forEach((s) => (s.y += s.speed));
  stars.forEach((s) => ctx.fillRect(s.x, s.y, s.size, s.size));
  stars = stars.filter((s) => s.y < canvas.height);

  // Movimiento jugador
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width)
    player.x += player.speed;

  // Disparo
  if (keys["Space"] && frame % 10 === 0) shoot();

  // Actualizar balas
  bullets.forEach((b) => (b.y -= b.speed));
  bullets = bullets.filter((b) => b.y > -b.height);

  // Crear enemigos (uno cada 120 frames ≈ 2s)
  if (frame % 120 === 0) createEnemy();

  // Enemigos se aceleran progresivamente con el tiempo
  const elapsed = (performance.now() - startTime) / 1000;
  const enemySpeedMultiplier = 1 + elapsed * 0.04;
  enemies.forEach((e) => (e.y += e.baseSpeed * enemySpeedMultiplier));

  // Colisión bala-enemigo
  bullets.forEach((b) => {
    enemies.forEach((e) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        e.hit = true;
        b.remove = true;
      }
    });
  });

  enemies = enemies.filter((e) => !e.hit);
  bullets = bullets.filter((b) => !b.remove);

  // Colisión jugador-enemigo → GAME OVER
  for (const e of enemies) {
    if (
      e.x < player.x + player.width &&
      e.x + e.width > player.x &&
      e.y < player.y + player.height &&
      e.y + e.height > player.y
    ) {
      triggerGameOver();
      return;
    }
  }

  // Dibujar jugador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Dibujar balas
  bullets.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  // Dibujar enemigos
  enemies.forEach((e) => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });

  requestAnimationFrame(update);
}
