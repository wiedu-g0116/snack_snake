// 遊戲變數
let canvas;
let ctx;
let gameLoop;
let snake = [];
let cellSize = 10;
let direction = "right";
let food = null;
let keyPressCount = 0;
let firework = null;
let restartButton = document.getElementById('restart-button');
let score = 0;


// 初始化遊戲
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    snake = [{ top: 50, left: 50 }];
    direction = "right";
    food = null;
    gameLoop = setInterval(draw, 150);
    restartButton.disabled = true;
}

// 繪製遊戲畫面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    let head = Object.assign({}, snake[0]); // 複製蛇頭
    switch(direction) {
        case "left":
            head.left -= cellSize;
            break;
        case "up":
            head.top -= cellSize;
            break;
        case "right":
            head.left += cellSize;
            break;
        case "down":
            head.top += cellSize;
            break;
    }
    snake.unshift(head);

    if(food && food.top === head.top && food.left === head.left) {
        score++;
        document.getElementById('score').textContent = '分數: ' + score;
        food = null; // 吃到食物
        firework = { ...head, counter: 6 }; // 煙火的位置和計數器
    } else {
        snake.pop(); // 沒有吃到食物，移除蛇尾
    }

    if(!food) {
        food = { // 新的食物
            top: Math.floor(Math.random() * canvas.height / cellSize) * cellSize,
            left: Math.floor(Math.random() * canvas.width / cellSize) * cellSize
        };
    }
    if(firework) {
        if(firework.counter % 2 === 0) {
            ctx.fillStyle = "rgb(251,245,122)"; // 煙火的顏色
            ctx.fillRect(firework.left, firework.top, cellSize*10, cellSize); // 繪製煙火
            ctx.fillRect(firework.left, firework.top, cellSize, cellSize*10); // 繪製煙火
            ctx.fillRect(firework.left, firework.top, -cellSize*10, cellSize); // 繪製煙火
            ctx.fillRect(firework.left, firework.top, cellSize, -cellSize*10); // 繪製煙火
            ctx.fillStyle = "rgb(251,122,122)"; // 煙火的顏色
            ctx.fillRect(firework.left, firework.top, cellSize, cellSize); // 繪製煙火
        }
        firework.counter--;
        if(firework.counter === 0) {
            firework = null;
        }
    }

    ctx.fillStyle = "rgb(255,198,113)"; // 設定食物的顏色為綠
    ctx.fillRect(food.left, food.top, cellSize, cellSize); // 繪製食物

    ctx.fillStyle = "rgb(216, 191, 216)"; // 設定蛇的顏色為紅色
    ctx.fillRect(snake[0].left, snake[0].top, cellSize, cellSize)

    for(let i = 1; i < snake.length; i++) {
        ctx.fillStyle = "rgb(173, 216, 230)"; // 設定蛇的身體顏色為藍色
        ctx.fillRect(snake[i].left, snake[i].top, cellSize, cellSize); // 繪製蛇
        if(i > 0 && head.left === snake[i].left && head.top === snake[i].top) {
            gameOver(); // 蛇頭碰到自己，遊戲結束
        }
    }

    if(head.left < 0 || head.top < 0 || head.left >= canvas.width || head.top >= canvas.height) {
        gameOver(); // 蛇頭碰到邊界，遊戲結束
    }
}

// 遊戲結束
function gameOver() {
    restartButton.disabled = false;
    document.getElementById('score').innerHTML += '<strong>，遊戲結束</strong>';
    clearInterval(gameLoop);
}

// 鍵盤事件
window.addEventListener("keydown", function(e) {
    switch(e.key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
        // while space pressed reset keypress count
        case " ":
            keyPressCount = 0;
            break;
    }
    keyPressCount += 5;
    clearInterval(gameLoop);
    gameLoop = setInterval(draw, Math.max(50 ,150 - keyPressCount));
});

restartButton.addEventListener('click', function() {
    score = 0;
    document.getElementById('score').textContent = '分數: ' + score;
    clearInterval(gameLoop);
    init();
});

// 啟動遊戲
init();
