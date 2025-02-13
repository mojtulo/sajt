window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    const player = {
        x: 0,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        speed: 3,
        jumpForce: -12,
        gravity: 0.6,
        velocityY: 0,
        velocityX: 0,
        isJumping: false,
        isDead: false
    };

    const enemies = [
        { x: 200, y: 450, width: 40, height: 20, speed: 2, direction: 1 },
        { x: 400, y: 350, width: 40, height: 20, speed: 3, direction: -1 },
        { x: 300, y: 250, width: 40, height: 20, speed: 4, direction: 1 },
        { x: 150, y: 150, width: 40, height: 20, speed: 3, direction: -1 }
    ];

    const platforms = [
        { x: 300, y: 550, width: 100, height: 20 },
        { x: 100, y: 500, width: 100, height: 20 },
        { x: 500, y: 450, width: 100, height: 20 },
        { x: 300, y: 400, width: 100, height: 20 },
        { x: 100, y: 350, width: 100, height: 20 },
        { x: 500, y: 300, width: 100, height: 20 },
        { x: 300, y: 250, width: 100, height: 20 },
        { x: 100, y: 200, width: 100, height: 20 },
        { x: 500, y: 150, width: 100, height: 20 },
        { x: 300, y: 100, width: 100, height: 20 },
        { x: 200, y: 50, width: 100, height: 20 }
    ];

    const goal = {
        x: canvas.width / 2 - 25,
        y: 50,
        width: 50,
        height: 50
    };

    let keys = {
        left: false,
        right: false,
        space: false
    };

    let gameRunning = true;

    document.addEventListener('keydown', function(e) {
        if(e.key === 'ArrowLeft') keys.left = true;
        if(e.key === 'ArrowRight') keys.right = true;
        if(e.key === ' ') {
            keys.space = true;
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', function(e) {
        if(e.key === 'ArrowLeft') keys.left = false;
        if(e.key === 'ArrowRight') keys.right = false;
        if(e.key === ' ') keys.space = false;
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        resetGame();
    });

    document.getElementById('nextButton').addEventListener('click', function() {
        window.location.href = 'nextpage.html';
    });

    function checkPlatformCollision(platform) {
        const playerBottom = player.y + player.height;
        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        const playerRight = player.x + player.width;
        const platformRight = platform.x + platform.width;

        if (playerBottom > platformTop && player.y < platformTop && 
            playerRight > platform.x && player.x < platformRight) {
            return 'top';
        }

        if (player.y < platformBottom && playerBottom > platformBottom && 
            playerRight > platform.x && player.x < platformRight) {
            return 'block';
        }

        return 'none';
    }

    function updateEnemies() {
        enemies.forEach(enemy => {
            enemy.x += enemy.speed * enemy.direction;
            
            if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
                enemy.direction *= -1;
            }

            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                player.isDead = true;
            }
        });
    }

    function update() {
        if (!gameRunning) return;

        if (player.isDead) {
            endGame();
            return;
        }

        player.velocityX = 0;
        if (keys.left) player.velocityX = -player.speed;
        if (keys.right) player.velocityX = player.speed;
        
        player.x += player.velocityX;

        if (keys.space && !player.isJumping) {
            player.velocityY = player.jumpForce;
            player.isJumping = true;
        }

        player.velocityY += player.gravity;
        player.y += player.velocityY;

        platforms.forEach(platform => {
            const collision = checkPlatformCollision(platform);
            if (collision === 'top') {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            } else if (collision === 'block') {
                player.velocityY = 1;
            }
        });

        updateEnemies();

        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y + player.height > canvas.height) {
            resetGame();
        }

        if (player.x < goal.x + goal.width &&
            player.x + player.width > goal.x &&
            player.y < goal.y + goal.height &&
            player.y + player.height > goal.y) {
            endGame();
        }
    }

    function draw() {
        ctx.fillStyle = 'rgba(255, 192, 203, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff69b4';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        ctx.fillStyle = '#ff0000';
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
        
        ctx.fillStyle = player.isDead ? '#666' : '#ff1493';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        ctx.fillStyle = '#ff0000';
        ctx.font = '50px Arial';
        ctx.fillText('❤️', goal.x, goal.y + goal.height);
    }

    function endGame() {
        gameRunning = false;
        document.getElementById('winMessage').style.display = 'block';
        document.getElementById('resetButton').style.display = 'block';
        document.getElementById('nextButton').style.display = 'block';
    }

    window.resetGame = function() {
        player.x = platforms[0].x + platforms[0].width / 2 - player.width / 2;
        player.y = platforms[0].y - player.height;
        player.velocityY = 0;
        player.velocityX = 0;
        player.isJumping = false;
        player.isDead = false;
        document.getElementById('winMessage').style.display = 'none';
        document.getElementById('resetButton').style.display = 'none';
        document.getElementById('nextButton').style.display = 'none';
        gameRunning = true;
    }

    resetGame();

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
};
