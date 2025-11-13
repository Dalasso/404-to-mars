// =====================
// CONFIGURACIÓN BÁSICA
// =====================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");

let gameStarted = false;
let frame = 0;
let keys = {};
let stars = [];
let enemies = [];
let bullets = [];
let playerSpeed = 6;
let startTime;

// Ajuste dinámico del canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// =====================
// ENTIDADES DEL JUEGO
// =====================
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 80,
  width: 40,
  height: 20,
  color: "#00ff88",
};

// =====================
// CONTROLES
// =====================
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (!gameStarted && e.code === "Enter") startGame();
});
window.addEventListener("keyup", (e) => (keys[e.code] = false));

function startGame() {
  startScreen.classList.add("hidden");
  gameStarted = true;
  frame = 0;
  playerSpeed = 2;
  startTime = performance.now();
  stars = [];
  enemies = [];
  bullets = [];
  requestAnimationFrame(update);
}

// =====================
// FUNCIONES AUXILIARES
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
    speed: 1 + Math.random() * 2,
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

  // === Fondo de estrellas ===
  if (frame % 3 === 0) createStar();
  ctx.fillStyle = "white";
  stars.forEach((s) => (s.y += s.speed));
  stars.forEach((s) => ctx.fillRect(s.x, s.y, s.size, s.size));
  stars = stars.filter((s) => s.y < canvas.height);

  // === Velocidad del jugador aumenta progresivamente ===
  const elapsed = (performance.now() - startTime) / 1000;
  playerSpeed = 2 + elapsed * 0.05;

  // === Movimiento del jugador ===
  if (keys["ArrowLeft"] && player.x > 0) player.x -= playerSpeed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width)
    player.x += playerSpeed;

  // === Disparo ===
  if (keys["Space"] && frame % 10 === 0) shoot();

  // === Actualizar balas ===
  bullets.forEach((b) => (b.y -= b.speed));
  bullets = bullets.filter((b) => b.y > -b.height);

  // === Generar enemigos ===
  if (frame % 60 === 0) createEnemy();
  enemies.forEach((e) => (e.y += e.speed));
  enemies = enemies.filter((e) => e.y < canvas.height);

  // === Colisiones bala-enemigo ===
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

  // === Dibujar jugador ===
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // === Dibujar balas ===
  bullets.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  // === Dibujar enemigos ===
  enemies.forEach((e) => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });

  requestAnimationFrame(update);
}
