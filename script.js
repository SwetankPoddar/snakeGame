
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});


var canvas, ctx, scoreBoard , rewardBoard, videoPlayer, paused = false;

//// Colors
var fillColor = "#172554"; // body color
var strokeColor = "white"; // spacing color
var foodColor = "red" // food color


var onePartSize = 10; // one block size
var snakeSize = 5; // inital size
var canvasHeight = 150; // canvas height
var canvasWidth = 300; // canvas width
var increasedSize = false; // has eatned food?

var snake; // the snake

food = {x:-5, y:-5}; // food position (not reachable at start)

var startingX = 50; // starting x point
var startingY = 50; // starting y point

var direction = 38; //Key code for down (but it goes up lol)

//Game over function
function gameOver() {
    ctx.font = "30px Arial";
    snake = [];
    drawSnake();
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", 10, 50);
    clearInterval(moving);
}

//Draw snake
function drawSnakePart(snakePart){
    // If crosses either of the axis transfer the snake on the other size
    if(snakePart.x >= canvasWidth){
        snakePart.x = 0; 
    }else if(snakePart.x < 0 ){
        snakePart.x = canvasWidth - 10;
    }

    if(snakePart.y >= canvasHeight){
        snakePart.y = 0;
    }else if(snakePart.y < 0){
        snakePart.y = canvasHeight - 10;
    }
    /////////////////////////////

    // Set the colors
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    
    //Draw the snake at this cordinate
    ctx.fillRect(snakePart.x,snakePart.y, onePartSize,onePartSize);
    // ctx.strokeRect(snakePart.x, snakePart.y, onePartSize, onePartSize);
}

// Increase the size of the snake
function increaseSize(){

    lastPart = snake[snakeSize - 1];
    secondLastPart = snake[snakeSize - 2];

    //Add the new tail at the correct position
    // if going up
    if(lastPart.x == secondLastPart.x){
        if(lastPart.y - secondLastPart.y < 0){
            // Going down
            part = {x:currentPosition.x, y:currentPosition.y - onePartSize};
        }else {
            //Going Up
            part = {x:currentPosition.x, y:currentPosition.y + onePartSize};
        }
    } else if(lastPart.y == secondLastPart.y){
        if(lastPart.x - secondLastPart.x < 0){
            // Going Right
            part = {x:currentPosition.x - onePartSize, y:currentPosition.y};
        } else {
            // Going Left
            part = {x:currentPosition.x + onePartSize, y:currentPosition.y};
            
        }
    }

    // Insert the new snake tail
    snake.push(part);

    var currentScore = snake.length - snakeSize;
    // Update score
    scoreBoard.innerHTML = currentScore;

    var nextReward = null; 

    if(currentScore < 5) {
        nextReward = 5; 
    } else if(currentScore < 10) {
        nextReward = 10;
    }

    if(currentScore == 5 || currentScore == 10) {
        var video = $('<video />', {
            id: 'video-element',
            src: '/videos/'+ currentScore.toString() +'.mp4',
            type: 'video/mp4',
            controls: true
        });
        video.appendTo($('#video-container'));
        $("#video-container").modal();
    }

    if(nextReward == null) {
        document.getElementById('points-left').innerHTML = "You have received all the rewards, <span style='color:red'>happy birthday</span>!";
    } else {
        // Update reward
        rewardBoard.innerHTML = nextReward - currentScore;
    }
    
}

function drawSnake() {
    //check if collided otherwise draw
    snake.forEach(function(snakePart){
        var counter = 0
        snake.forEach(function(otherSnakePart){
            // check the number of parts which equal to this snake part
            if(snakePart.x == otherSnakePart.x && snakePart.y == otherSnakePart.y){
                counter++;
            }
        });
        // check if the food is eatned and mark appropriate flags
        if(!increasedSize && snakePart.x == food.x && snakePart.y == food.y){
            ctx.clearRect(food.x,food.y, 10,10);
            food = {x: -5, y: -5};
            increasedSize = true;
        }
        // if not colided anywhere draw the snake, otherwise game over.
        if(counter == 1){
            drawSnakePart(snakePart);
        } else {
            gameOver();
        }        
    });

    // if food is eatned increase size
    if(increasedSize){
        increaseSize();
        increasedSize = false;
        //console.log("increased size");
        getNewFood();
    }
}

// move the snake according to the key pressed
window.onkeydown = function(event){

    // Prevent backfires
    if((direction == 40 && event.keyCode == 38) || (direction == 38 && event.keyCode == 40)){
        return;
    }else if( (direction == 37 && event.keyCode == 39) || (direction == 39 && event.keyCode == 37)){
        return;
    }

    ////
    let part = null;
    currentPosition = snake[0];
    switch(event.keyCode){
        case 37:
            // Left
            part = {x:currentPosition.x - onePartSize, y:currentPosition.y};
            direction = 37;
            break;
        case 39:
            // Right
            part = {x:currentPosition.x + onePartSize, y:currentPosition.y};
            direction = 39;
            break;
        case 38:
            // Down
            part = {x:currentPosition.x, y:currentPosition.y - onePartSize};
            direction = 38;
            break;
        case 40:
            // Up
            part = {x:currentPosition.x, y:currentPosition.y + onePartSize};
            direction = 40;
            break;
    }
    if(part != null){
        snake.unshift(part);
        lastPart = snake.pop();
        ctx.clearRect(lastPart.x,lastPart.y, onePartSize,onePartSize);
        drawSnake();
    }
}

// Place new food
function getNewFood(){
    // Get new random location on the canvas
    randomX = Math.ceil(Math.floor(Math.random() * (canvasWidth-10) + 1) / 10) * 10;
    randomY = Math.ceil(Math.floor(Math.random() * (canvasHeight-10) + 1) / 10) * 10;
    /////
    
    food.x = randomX;
    food.y = randomY;

    // Set food color
    ctx.fillStyle = foodColor;
    
    // Place the food on canvas
    ctx.fillRect(randomX, randomY, 10,10);

    //console.log("New food placed");
}

// go one step more in the current direction every 300 miliseconds
var moving = setInterval(function(){
    if(paused) return;
    simulateKey(direction)
},200);

function initializeGame(canvasId, score, rewards, initalSnakeSize  = 5){
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext('2d');

    scoreBoard = document.getElementById(score);
    rewardBoard = document.getElementById(rewards);

    snakeSize = initalSnakeSize;
    snake = [];
    
    // Initalize the sname from the start point
    for(i = 0; i<snakeSize; i++){
        snake.push({x:startingX,y:startingY});
        startingY += onePartSize; 
    }

    drawSnake();
    getNewFood();
    console.log("Game initilized");

    $("#video-container").on('modal:open', () => paused = true);
    $("#video-container").on('modal:close', () => {
        paused = false;
        $('#video-element').remove();
    });    
    
}

// Controller for mobile phones
function simulateKey(key){
    e = $.Event('keydown');
    e.keyCode= key; 
    $(canvas).trigger(e);
}