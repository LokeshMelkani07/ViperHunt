console.log('This is snake game');
// All Variables and constant
// object for snake direction
let inputDirection = { x: 0, y: 0 };
// All sound initialised
const backGround = new Audio('gameNewSound.mp3');
const gameOver = new Audio('gameOver.mp3');
const coinSound = new Audio('coin.mp3');
let speed = 5;
let Score = document.getElementById('score');
let score = 0;
let LastPaintTime = 0;
let snakeArray = [
    { x: 13, y: 15 }
]
food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
    // again call it to make a loop
    window.requestAnimationFrame(main);
    // console.log(ctime);
    // Improving the fps
    if ((ctime - LastPaintTime) / 1000 < 1 / speed) {
        // if ctime is more than 0.5s then only paint screen else do not paint
        return;
    }
    LastPaintTime = ctime;
    gameEngine();

}

// When snake collides
function isCollide(snake) {
    for (let index = 1; index < snakeArray.length; index++) {
        // when snake bump into itself
        if (snake[index].x === snake[0].x && snake[index].y === snake[0].y) {
            return true;
        }
    }
    // if we bump into wall
    // our grid is from 0 to 18 so if snakeHead goes from 0 to 18 means it bumped into wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
}

function gameEngine() {
    // part 1 : Updating the snake array
    if (isCollide(snakeArray)) {
        gameOver.play();
        backGround.pause();
        inputDirection = { x: 0, y: 0 };
        if (confirm('Game Over. Press Ok to play Again.')) {
            // if user press any key means play again
            snakeArray = [{ x: 13, y: 15 }];  // set the head again at previous position
            backGround.play();
            score = 0;
            Score.innerHTML = "Score : " + score;
        }
        else {
            backGround.pause();
            location.reload();
        }
    }

    // If snake has eaten the food increment the score and change corrdinate of food
    // Snake will successfully eat the food when coordinate of snake head is equal to coordinate of food
    if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
        // Add one more body to snake head if it eats the food
        snakeArray.unshift({ x: snakeArray[0].x + inputDirection.x, y: snakeArray[0].y + inputDirection.y });
        score += 1;
        if (score > highScoreValue) {
            highScoreValue = score;
            localStorage.setItem('highScore', JSON.stringify(highScoreValue));
            high.innerHTML = "High Score : " + highScoreValue;
        }
        Score.innerHTML = "Score : " + score;
        coinSound.play();
        // Changing the location of food randomly
        // our grid is of 0 to 18 so we generate random between 2 and 16
        let max = 16;
        let min = 2;
        food = { x: 2 + Math.floor(Math.random() * (max - min)) + min, y: 2 + Math.floor(Math.random() * (max - min)) + min }
    }

    // Moving the snake
    // To move the snake put each segament one position ahead its current position
    for (let i = snakeArray.length - 2; i >= 0; --i) {
        snakeArray[i + 1] = { ...snakeArray[i] };  // Destructing because snakeArr[i] is fresh new object
    }
    snakeArray[0].x += inputDirection.x;
    snakeArray[0].y += inputDirection.y;


    // part 2 : Display the snake
    let board = document.getElementById('board');
    board.innerHTML = '';
    snakeArray.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    })

    // part 3 : Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}


// Game Loop , Main Logic
// Why is requestAnimationFrame better than setInterval or setTimeout ?
let highScore = localStorage.getItem('highScore');
let highScoreValue;
let high = document.getElementById('highScore');
if (highScore === null) {
    highScoreValue = 0;
    localStorage.setItem('highScore', JSON.stringify(highScoreValue));
}
else {
    highScoreValue = JSON.parse(highScore);
    high.innerHTML = "High Score : " + highScoreValue;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDirection = { x: 0, y: 1 };  // Start the game
    backGround.play();
    switch (e.key) {
        case 'ArrowUp':
            console.log('ArrowUp');
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case 'ArrowDown':
            console.log('ArrowDown');
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case 'ArrowLeft':
            console.log('ArrowLeft');
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case 'ArrowRight':
            console.log('ArrowRight');
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
    }
})