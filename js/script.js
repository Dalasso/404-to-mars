// =====================
// CONFIGURACIÓN BÁSICA
// =====================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const scoreDisplay = document.getElementById("scoreDisplay");

let gameStarted = false;
let gameOver = false;
let score = 0;

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
  speed: 6, // velocidad fija
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
  scoreDisplay.classList.remove("hidden"); // mostrar puntuación

  gameStarted = true;
  gameOver = false;
  score = 0; // reset score

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
  scoreDisplay.classList.add("hidden"); // ocultar puntuación
  gameOverScreen.classList.remove("hidden");

  // Resetear y reiniciar animación typewriter
  resetTypewriter();
  setTimeout(() => {
    initTypewriter();
  }, 100);
}

function backToStart() {
  gameOver = false;
  startScreen.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
  score = 0; // reiniciar puntuación
  updateScore();

  // Resetear y reiniciar animación typewriter
  resetTypewriter();
  setTimeout(() => {
    initTypewriter();
  }, 100);
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
    baseSpeed: 1.5 + Math.random(),
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
// SCORE SYSTEM
// =====================
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
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

  // Crear enemigos (cada 120 frames ≈ 2 segundos)
  if (frame % 120 === 0) createEnemy();

  // Enemigos aceleran con el tiempo
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
        score += 100; // +100 puntos por enemigo
        updateScore();
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

// =====================
// TYPEWRITER ANIMATION
// =====================
function initTypewriter() {
  const typewriterLines = document.querySelectorAll(".typewriter-line");
  const loadingDots = document.querySelectorAll(".loading-dots");

  // Procesar líneas de typewriter normal
  typewriterLines.forEach((line) => {
    // Calcular el ancho exacto del texto
    const tempSpan = document.createElement("span");
    tempSpan.style.visibility = "hidden";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.style.fontSize = window.getComputedStyle(line).fontSize;
    tempSpan.style.fontFamily = window.getComputedStyle(line).fontFamily;
    tempSpan.innerHTML = line.innerHTML;
    document.body.appendChild(tempSpan);

    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // Aplicar el ancho exacto como variable CSS
    line.style.setProperty("--text-width", textWidth + "px");

    // Obtener el delay desde el atributo data-delay
    const delay = parseInt(line.getAttribute("data-delay")) || 2000;

    // Iniciar animación después del delay
    setTimeout(() => {
      line.classList.add("active");

      // Terminar animación después de 3s
      setTimeout(() => {
        line.classList.remove("active");
        line.classList.add("finished");
      }, 3000);
    }, delay);
  });

  // Procesar puntos de carga
  loadingDots.forEach((dots) => {
    const delay = parseInt(dots.getAttribute("data-delay")) || 2000;

    setTimeout(() => {
      dots.classList.add("active");
    }, delay);
  });
}

// Función para resetear animaciones
function resetTypewriter() {
  const typewriterLines = document.querySelectorAll(".typewriter-line");
  const loadingDots = document.querySelectorAll(".loading-dots");

  typewriterLines.forEach((line) => {
    line.classList.remove("active", "finished");
    line.style.removeProperty("--text-width");
  });

  loadingDots.forEach((dots) => {
    dots.classList.remove("active");
  });
}

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
});
