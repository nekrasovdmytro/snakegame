const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const soundToggle = document.getElementById('soundToggle');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const speedStat = document.getElementById('speedStat');
const lengthStat = document.getElementById('lengthStat');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10, z: 0}
];
let food = {x: 15, y: 15, z: 0};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 150;
let gameRunning = true;
let gamePaused = false;
let foodGlow = 0;
let particles = [];
let soundEnabled = true;
let audioContext;
let oscillators = {};
let time = 0;

// Sound system
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSound(frequency, duration, type = 'sine') {
    if (!soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playEatSound() {
    playSound(800, 0.1, 'square');
    setTimeout(() => playSound(1000, 0.1, 'square'), 50);
    setTimeout(() => playSound(1200, 0.1, 'square'), 100);
}

function playMoveSound() {
    playSound(200, 0.05, 'sine');
}

function playGameOverSound() {
    playSound(200, 0.2, 'sawtooth');
    setTimeout(() => playSound(150, 0.2, 'sawtooth'), 200);
    setTimeout(() => playSound(100, 0.3, 'sawtooth'), 400);
}

function playStartSound() {
    playSound(400, 0.1, 'triangle');
    setTimeout(() => playSound(600, 0.1, 'triangle'), 100);
    setTimeout(() => playSound(800, 0.1, 'triangle'), 200);
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

function drawGame() {
    clearCanvas();
    if (!gamePaused) {
        moveSnake();
    }
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
    updateFoodGlow();
    drawGrid3D();
    updateStats();
    time += 0.016;
}

function clearCanvas() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.7, '#0f3460');
    gradient.addColorStop(1, '#0a1929');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid3D() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    
    // Draw grid with depth perspective
    for (let i = 0; i <= tileCount; i++) {
        const alpha = 0.03 + (i / tileCount) * 0.02;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw depth lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        const z = segment.z;
        
        if (index === 0) {
            drawSnakeHead3D(x, y, z);
        } else {
            drawSnakeBody3D(x, y, z, index);
        }
    });
}

function drawSnakeHead3D(x, y, z) {
    const time = Date.now() * 0.01;
    const glowIntensity = Math.sin(time) * 0.3 + 0.7;
    const depth = Math.sin(time * 2) * 2;
    
    ctx.save();
    ctx.translate(x + gridSize/2, y + gridSize/2);
    ctx.scale(1 + z * 0.01, 1 + z * 0.01);
    
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15 * glowIntensity;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gridSize/2);
    gradient.addColorStop(0, '#00ff88');
    gradient.addColorStop(0.6, '#00cc66');
    gradient.addColorStop(0.8, '#00994d');
    gradient.addColorStop(1, '#006633');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 2;
    ctx.strokeRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    // 3D eyes with depth
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-gridSize/2 + 5, -gridSize/2 + 5, 3, 3);
    ctx.fillRect(-gridSize/2 + 12, -gridSize/2 + 5, 3, 3);
    ctx.shadowBlur = 0;
    
    // Pupils with 3D effect
    ctx.fillStyle = '#000000';
    ctx.fillRect(-gridSize/2 + 6, -gridSize/2 + 6, 1, 1);
    ctx.fillRect(-gridSize/2 + 13, -gridSize/2 + 6, 1, 1);
    
    ctx.restore();
}

function drawSnakeBody3D(x, y, z, index) {
    const intensity = Math.max(0.3, 1 - index * 0.06);
    const green = Math.floor(255 * intensity);
    const blue = Math.floor(136 * intensity);
    
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time + index * 0.5) * 0.1 + 0.9;
    const depth = Math.sin(time + index * 0.3) * 1;
    
    ctx.save();
    ctx.translate(x + gridSize/2, y + gridSize/2);
    ctx.scale(1 + depth * 0.005, 1 + depth * 0.005);
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gridSize/2);
    gradient.addColorStop(0, `rgba(0, ${green}, ${blue}, ${pulse})`);
    gradient.addColorStop(0.7, `rgba(0, ${Math.floor(green * 0.7)}, ${Math.floor(blue * 0.7)}, ${pulse * 0.8})`);
    gradient.addColorStop(1, `rgba(0, ${Math.floor(green * 0.4)}, ${Math.floor(blue * 0.4)}, ${pulse * 0.6})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    ctx.strokeStyle = `rgba(0, ${green}, ${blue}, 0.8)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    ctx.restore();
}

function drawFood() {
    const x = food.x * gridSize;
    const y = food.y * gridSize;
    const z = food.z;
    
    const glowIntensity = Math.sin(foodGlow) * 0.4 + 0.6;
    const pulse = Math.sin(foodGlow * 2) * 0.2 + 0.8;
    const depth = Math.sin(foodGlow * 3) * 3;
    
    ctx.save();
    ctx.translate(x + gridSize/2, y + gridSize/2);
    ctx.scale(1 + depth * 0.01, 1 + depth * 0.01);
    
    ctx.shadowColor = '#ff4757';
    ctx.shadowBlur = 25 * glowIntensity;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gridSize/2);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.4, '#ff4757');
    gradient.addColorStop(0.7, '#ff3838');
    gradient.addColorStop(1, '#ff1a1a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-gridSize/2 + 2, -gridSize/2 + 2, gridSize - 4, gridSize - 4);
    
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-gridSize/2 + 2, -gridSize/2 + 2, gridSize - 4, gridSize - 4);
    
    // 3D animated eyes
    const eyeGlow = Math.sin(foodGlow * 3) * 0.5 + 0.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 5 * eyeGlow;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-gridSize/2 + 6, -gridSize/2 + 6, 2, 2);
    ctx.fillRect(-gridSize/2 + 12, -gridSize/2 + 6, 2, 2);
    ctx.shadowBlur = 0;
    
    ctx.restore();
}

function updateFoodGlow() {
    foodGlow += 0.15;
}

function moveSnake() {
    if (dx === 0 && dy === 0) return;
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy, z: snake[0].z};
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        generateFood();
        score += 10;
        gameSpeed = Math.max(50, gameSpeed - 2);
        createEatEffect3D(head.x * gridSize, head.y * gridSize, head.z);
        playEatSound();
    } else {
        snake.pop();
        playMoveSound();
    }
}

function createEatEffect3D(x, y, z) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x + gridSize/2,
            y: y + gridSize/2,
            z: z,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            vz: (Math.random() - 0.5) * 5,
            life: 1,
            color: `hsl(${Math.random() * 60 + 330}, 100%, 60%)`,
            size: Math.random() * 5 + 3
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        particle.life -= 0.015;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.vz *= 0.98;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 8;
        
        const scale = 1 + particle.z * 0.01;
        ctx.translate(particle.x, particle.y);
        ctx.scale(scale, scale);
        
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        z: Math.random() * 10 - 5
    };
    
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            z: Math.random() * 10 - 5
        };
    }
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    gameRunning = false;
    playGameOverSound();
    
    const overlay = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    overlay.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    overlay.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 40px Orbitron';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15;
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Orbitron';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
    
    ctx.font = '16px Orbitron';
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 40);
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateStats() {
    const speedMultiplier = Math.max(1, (150 - gameSpeed) / 10 + 1);
    speedStat.textContent = speedMultiplier.toFixed(1) + 'x';
    lengthStat.textContent = snake.length;
}

function resetGame() {
    snake = [{x: 10, y: 10, z: 0}];
    food = {x: 15, y: 15, z: 0};
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 150;
    gameRunning = true;
    gamePaused = false;
    particles = [];
    time = 0;
    playStartSound();
    updatePauseButton();
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    updatePauseButton();
}

function updatePauseButton() {
    if (gamePaused) {
        pauseBtn.textContent = '▶️ RESUME';
        pauseBtn.classList.add('active');
    } else {
        pauseBtn.textContent = '⏸️ PAUSE';
        pauseBtn.classList.remove('active');
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('active', soundEnabled);
    soundToggle.querySelector('.sound-icon').textContent = soundEnabled ? '🔊' : '🔇';
}

function gameLoop() {
    if (gameRunning) {
        drawGame();
        updateParticles();
        drawParticles();
        setTimeout(gameLoop, gameSpeed);
    }
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (!gameRunning) {
        if (event.code === 'Space') {
            resetGame();
            gameLoop();
        }
        return;
    }
    
    if (event.code === 'Space') {
        togglePause();
        return;
    }
    
    if (gamePaused) return;
    
    switch (event.code) {
        case 'ArrowUp':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);
soundToggle.addEventListener('click', toggleSound);

// Initialize
initAudio();
createParticles();
resetGame();
gameLoop();
