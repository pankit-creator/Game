const shootSound = new Audio("sounds/shoot.mp3");
const bgMusic = new Audio("sounds/background-music.mp3");

bgMusic.loop = true;

document.addEventListener("click", () => {
    bgMusic.play();
}, { once: true });
const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

let health = 100;
let kills = 0;

const keys = {};
const bullets = [];
const enemies = [];

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.code === "Space") {
        shoot();
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

function shoot() {
    const bullet = document.createElement("div");
    bullet.className = "bullet";

    bullet.x = playerX + 16;
    bullet.y = playerY;

    bullet.style.left = bullet.x + "px";
    bullet.style.top = bullet.y + "px";

    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

function spawnEnemy() {
    const enemy = document.createElement("div");
    enemy.className = "enemy";

    enemy.x = Math.random() * (window.innerWidth - 40);
    enemy.y = -40;

    enemy.style.left = enemy.x + "px";
    enemy.style.top = enemy.y + "px";

    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

setInterval(spawnEnemy, 1500);

function update() {

    if (keys["w"]) playerY -= 5;
    if (keys["s"]) playerY += 5;
    if (keys["a"]) playerX -= 5;
    if (keys["d"]) playerX += 5;

    playerX = Math.max(0, Math.min(window.innerWidth - 40, playerX));
    playerY = Math.max(0, Math.min(window.innerHeight - 40, playerY));

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    bullets.forEach((bullet, bi) => {
        bullet.y -= 10;
        bullet.style.top = bullet.y + "px";

        if (bullet.y < 0) {
            bullet.remove();
            bullets.splice(bi, 1);
        }
    });

    enemies.forEach((enemy, ei) => {

        let dx = playerX - enemy.x;
        let dy = playerY - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        enemy.x += dx / distance * 2;
        enemy.y += dy / distance * 2;

        enemy.style.left = enemy.x + "px";
        enemy.style.top = enemy.y + "px";

        if (distance < 30) {
            health -= 1;
            document.getElementById("health").innerText =
                "Health: " + health;

            if (health <= 0) {
                alert("Game Over! Kills: " + kills);
                location.reload();
            }
        }

        bullets.forEach((bullet, bi) => {
            const bRect = bullet.getBoundingClientRect();
            const eRect = enemy.getBoundingClientRect();

            if (
                bRect.left < eRect.right &&
                bRect.right > eRect.left &&
                bRect.top < eRect.bottom &&
                bRect.bottom > eRect.top
            ) {
                bullet.remove();
                enemy.remove();

                bullets.splice(bi, 1);
                enemies.splice(ei, 1);

                kills++;
                document.getElementById("score").innerText =
                    "Kills: " + kills;
            }
        });
    });

    requestAnimationFrame(update);
}

update();
