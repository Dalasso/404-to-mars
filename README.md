# 404 – Mars Not Found

Este proyecto consiste en una página de error 404 personalizada con una temática espacial. La idea es que un astronauta (Major Tom) intenta aterrizar en Marte, pero las comunicaciones fallan y aparece un mensaje “**404 – Mars not found**”.  
Como último entretenimiento antes de perder contacto, la interfaz muestra un minijuego inspirado en el dinosaurio de Google, Space invaders y los shooter vertical scroll.

El proyecto incluye:
- Pantalla de inicio / Error 404.
- Minijuego programado en JavaScript dentro de un `<canvas>`.
- Pantalla final de **Game Over**.
- Animaciones y efectos visuales estilo monitor antiguo (CRT).

---

# Descripción del proyecto

La página se divide en tres estados principales:

# 1. **Pantalla de inicio**
Muestra el mensaje de error 404 y la pequeña historia de Major Tom usando efectos de texto (máquina de escribir y puntos de carga).  
Al pulsar **ENTER**, comienza el juego.

# 2. **Juego (canvas)**
Aquí aparece el minijuego tipo *runner* o *shooter vertical scroll*:
- El jugador controla una nave que se mueve horizontalmente.
- Puede disparar pulsando **Space**.
- Caen enemigos / asteroides desde la parte superior.
- El marcador de puntuación va aumentando al destruirlos.

# 3. **Pantalla de Game Over**
Se muestra cuando un enemigo colisiona con la nave.  
Al pulsar ENTER se puede volver a jugar. No hay límite de partidas.

---

# Cómo se juega:

- **Mover nave**:  
  ➡️ Flecha derecha  
  ⬅️ Flecha izquierda  

- **Disparar**:  
  Barra espaciadora (`Space`)

- **Empezar / Reiniciar**:  
  `ENTER`

---

# Tecnologías utilizadas

- **HTML5** para la estructura.
- **CSS3** para el estilo retro, efectos CRT, animaciones visuales (“typewriter”, scanlines, flicker).
- **JavaScript** para la lógica del juego: movimiento, colisiones, spawn de enemigos, puntuación, control de estados, etc.

---

# Lógica del juego 

# Entidades principales
- **Jugador**: definido como una constante con su posición, tamaño y velocidad.
- **Estrellas de fondo**: aparecen continuamente y tienen un bucle infinito para simular movimiento espacial.
- **Enemigos**: aparecen cada 120 frames y tienen una aceleración progresiva que aumenta la dificultad con el tiempo.
- **Disparos**: se crean cuando el jugador pulsa la barra espaciadora.

# Colisiones
- **Jugador–enemigo** → muerte inmediata → *Game Over*.  
- **Disparo–enemigo** → enemigo destruido → +100 puntos.

# Scoreboard
El marcador aparece solo durante la partida y se resetea al terminar.  
Esto permite jugar todas las veces que se quiera.

# Responsive
El juego está pensado **solo para ordenador**, por decisión propia del equipo.  
No se ha preparado para móvil porque la jugabilidad y los controles están diseñados para teclado.

---

#  Experiencia visual (CSS)

Este ha sido uno de los puntos más complejos del proyecto.

- **Efecto CRT**: curvatura, ruido, líneas de escaneo, parpadeo del monitor.  
- **Animación de encendido** del monitor al cargar la página.
- **Línea naranja descendente** (scanline) sincronizada en todas las pantallas.
- **Texto con efecto máquina de escribir**, con control manual del tiempo y del ancho exacto del texto.
- **Puntos de carga animados** (`...`) en bucle.

---

#  Problemas encontrados y cómo los solucionamos

Este apartado recoge nuestra experiencia real desarrollando el proyecto:

# 1. Efectos de líneas que no se aplicaban en todas las pantallas
Nos pasó que la **línea naranja** solo aparecía en una capa, y no entendíamos por qué. Después de varias pruebas, descubrimos que **ciertos elementos tenían modos de mezcla (mix-blend-mode)** que hacían que el efecto no se aplicara.  
Lo solucionamos revisando capa por capa y adaptando el CSS para que todas las pantallas respondieran igual.

# 2. Compatibilidad de efectos de texto (typewriter)
El efecto “máquina de escribir” no cuadraba con el tamaño real del texto:
- El contenedor no se ajustaba
- El cursor se desalineaba
- Los tiempos no coincidían

La solución fue medir dinámicamente el ancho del texto con JavaScript y aplicar una variable CSS personalizada (`--text-width`), además de ajustar los `data-delay`.

# 3. Integrar el diseño propio con un juego ya funcional
La estructura del juego estaba hecha, pero adaptarla al diseño retro fue lo más complicado:
- Capas superpuestas
- Transparencias
- Animaciones simultáneas
- Efecto CRT que debía aplicarse a todo

Tuvimos que reorganizar algunas capas y reescribir partes del CSS.

# 4. Debugging con `console.log`
Aprendimos a usar `console.log()` para:
- Ver el flujo del juego
- Detectar colisiones
- Comprobar posiciones, velocidades y estados
- Encontrar errores lógicos y de carga

# 5. Llamada de funciones
Tuvimos situaciones en las que una función no se ejecutaba porque la estábamos llamando antes de estar definida o fuera del flujo adecuado.  
Con práctica y ordenando el código, fuimos solucionando estos problemas.

---

# Aprendizaje del proyecto

Este trabajo nos ha servido para:

- Entender cómo funciona un juego en `canvas`.
- Trabajar estados de juego (inicio → juego → fin).
- Gestionar eventos de teclado.
- Aplicar colisiones y movimiento frame a frame.
- Crear animaciones complejas solo con CSS.
- Depurar código con herramientas del navegador.
- Resolver problemas nuevos mediante razonamiento y trabajo en equipo.

---

# Conclusión

El proyecto combina programación, diseño y creatividad.  
No es solo una página 404: es una pequeña experiencia interactiva con historia, estética retro y un minijuego funcional.  

Ha sido un reto integrar nuestro propio diseño en un sistema que ya funcionaba, pero gracias al trabajo en equipo y a ir resolviendo paso a paso, hemos conseguido un resultado del que estamos orgullosos.

---

## 👥 Autores
Nuestro equipo está formado por:
- David Lasso
- Javier Perea
- Lorena García
- Sara Love
- Carlota Fernández

