const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 150;
let gameRunning = true;
let foodGlow = 0;
let particles = [];

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
    updateFoodGlow();
}

function clearCanvas() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#34495e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        
        if (index === 0) {
            drawSnakeHead(x, y);
        } else {
            drawSnakeBody(x, y, index);
        }
    });
}

function drawSnakeHead(x, y) {
    const gradient = ctx.createRadialGradient(x + gridSize/2, y + gridSize/2, 0, x + gridSize/2, y + gridSize/2, gridSize/2);
    gradient.addColorStop(0, '#00ff88');
    gradient.addColorStop(1, '#00cc66');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, y + 5, 3, 3);
    ctx.fillRect(x + 12, y + 5, 3, 3);
}

function drawSnakeBody(x, y, index) {
    const intensity = Math.max(0.3, 1 - index * 0.1);
    const green = Math.floor(255 * intensity);
    const blue = Math.floor(136 * intensity);
    
    const gradient = ctx.createRadialGradient(x + gridSize/2, y + gridSize/2, 0, x + gridSize/2, y + gridSize/2, gridSize/2);
    gradient.addColorStop(0, `rgb(0, ${green}, ${blue})`);
    gradient.addColorStop(1, `rgb(0, ${Math.floor(green * 0.7)}, ${Math.floor(blue * 0.7)})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    
    ctx.strokeStyle = `rgba(0, ${green}, ${blue}, 0.8)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
}

function drawFood() {
    const x = food.x * gridSize;
    const y = food.y * gridSize;
    
    const glowIntensity = Math.sin(foodGlow) * 0.3 + 0.7;
    
    ctx.shadowColor = '#ff4757';
    ctx.shadowBlur = 15 * glowIntensity;
    
    const gradient = ctx.createRadialGradient(x + gridSize/2, y + gridSize/2, 0, x + gridSize/2, y + gridSize/2, gridSize/2);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.7, '#ff4757');
    gradient.addColorStop(1, '#ff3838');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
    
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, y + 6, 2, 2);
    ctx.fillRect(x + 12, y + 6, 2, 2);
}

function updateFoodGlow() {
    foodGlow += 0.2;
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        generateFood();
        score += 10;
        gameSpeed = Math.max(50, gameSpeed - 2);
        createEatEffect(head.x * gridSize, head.y * gridSize);
    } else {
        snake.pop();
    }
}

function createEatEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x + gridSize/2,
            y: y + gridSize/2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            color: `hsl(${Math.random() * 60 + 330}, 100%, 60%)`
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        
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
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
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
    
    const overlay = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    overlay.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    overlay.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 40px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Orbitron';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
    
    ctx.font = '16px Orbitron';
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 40);
}

function updateScore() {
    scoreElement.textContent = score;
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15};
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 150;
    gameRunning = true;
    particles = [];
}

function gameLoop() {
    if (gameRunning) {
        drawGame();
        updateParticles();
        drawParticles();
        setTimeout(gameLoop, gameSpeed);
    }
}

document.addEventListener('keydown', (event) => {
    if (!gameRunning) {
        if (event.code === 'Space') {
            resetGame();
            gameLoop();
        }
        return;
    }
    
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

createParticles();
gameLoop();
