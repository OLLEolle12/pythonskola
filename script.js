const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 400, y: 550, radius: 20, speed: 5 };
let enemy = { x: 400, y: 50, radius: 20, speed: 3, dir: 1 };
let bullets = [];
let keys = {};
let gameOver = false;

document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function drawCircle(obj, color) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function update() {
    if(gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! F5 för att starta om', 200, 300);
        return;
    }

    // Rörelse
    if(keys['ArrowLeft'] && player.x - player.radius > 0) player.x -= player.speed;
    if(keys['ArrowRight'] && player.x + player.radius < canvas.width) player.x += player.speed;

    // Skjut
    if(keys['Space'] && bullets.length < 5) {
        bullets.push({ x: player.x, y: player.y - player.radius, radius: 5, speed: 7 });
        keys['Space'] = false; // Förhindra kontinuerligt skjutande
    }

    // Fiende rör sig
    enemy.x += enemy.speed * enemy.dir;
    if(enemy.x + enemy.radius > canvas.width || enemy.x - enemy.radius < 0) enemy.dir *= -1;

    // Flytta kulor
    bullets = bullets.filter(b => b.y + b.radius > 0);
    bullets.forEach(b => b.y -= b.speed);

    // Kolla kollision fiende-skott
    bullets.forEach((b, i) => {
        let dx = b.x - enemy.x;
        let dy = b.y - enemy.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < b.radius + enemy.radius) {
            gameOver = true;
        }
    });

    // Rita
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(player, 'lime');
    drawCircle(enemy, 'red');
    bullets.forEach(b => drawCircle(b, 'white'));

    requestAnimationFrame(update);
}

update();
