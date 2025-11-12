const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");

let gameStarted = false;
let keys = {};

// Jugador
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 80,
  width: 50,
  height: 20,
  color: "lime",
  speed: 6
};

// Disparos
let bullets = [];

// Meteoritos
let meteors = [];
let meteorSpeed = 3;
let spawnRate = 120; // cada 60 frames

// Fondo animado
let bgOffset = 0;

// EVENTOS DE TECLADO
document.addEventListener("keydown", e => {
  keys[e.code] = true;
  if (!gameStarted && e.code === "Space") {
    startScreen.style.display = "none";
    gameStarted = true;
  }
});
document.addEventListener("keyup", e => {
  keys[e.code] = false;
});

// Crear un meteorito
function createMeteor() {
  const size = 20 + Math.random() * 30;
  meteors.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    width: size,
    height: size,
    color: "orange"
  });
}

// Dibujar jugador
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dibujar balas
function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

// Dibujar meteoritos
function drawMeteors() {
  ctx.fillStyle = "red";
  meteors.forEach(m => ctx.fillRect(m.x, m.y, m.width, m.height));
}

// Actualizar lógica
let frameCount = 0;
function update() {
  if (!gameStarted) return requestAnimationFrame(update);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo desplazable
  bgOffset += 2;
  ctx.fillStyle = "#050510";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#090918";
  for (let i = 0; i < canvas.height / 20; i++) {
    ctx.fillRect(0, (i * 20 + bgOffset) % canvas.height, canvas.width, 2);
  }

  // Movimiento jugador
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width)
    player.x += player.speed;

  // Disparo
  if (keys["Space"]) {
    if (frameCount % 15 === 0) {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10
      });
    }
  }

  // Mover balas
  bullets.forEach(b => (b.y -= 10));
  bullets = bullets.filter(b => b.y > -b.height);

  // Crear meteoritos
  if (frameCount % spawnRate === 0) createMeteor();

  // Mover meteoritos
  meteors.forEach(m => (m.y += meteorSpeed));
  meteors = meteors.filter(m => m.y < canvas.height + m.height);

  // Colisiones bala-meteorito
  bullets.forEach(b => {
    meteors.forEach(m => {
      if (
        b.x < m.x + m.width &&
        b.x + b.width > m.x &&
        b.y < m.y + m.height &&
        b.y + b.height > m.y
      ) {
        m.y = canvas.height + 100; // “eliminar” meteorito
        b.y = -100; // eliminar bala
      }
    });
  });

  // Dibujar todo
  drawPlayer();
  drawBullets();
  drawMeteors();

  frameCount++;
  requestAnimationFrame(update);
}

update();
ZZZ