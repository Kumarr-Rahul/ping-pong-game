let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let rod1 = document.getElementById('rod1');
let rod2 = document.getElementById('rod2');
let ball = document.getElementById('ball');

let Rod1score, Rod2score, maxScore, maxScorePlayer, movement, colorChange;
let gameStatus = false;


/* for local storage */
const highScorePlayerName = "Name";
const highScoreValue = "Score";
const player1Name = "Rod 1";
const player2Name = "Rod 2";


/* IFEE function for getting maximum score and playername */
(function () {

    /* getting high score playername and score from local storage */
    maxScorePlayer = localStorage.getItem(highScorePlayerName);
    maxScore = localStorage.getItem(highScoreValue);

    /* checking condition for new player */
    if (maxScorePlayer === null || maxScore === null) {
        alert("This is your first game. BEST OF LUCK");
        maxScore = 0;
        maxScorePlayer = "Rod 1";
    } else {
        alert(maxScorePlayer + " has maximum score of " + (maxScore * 100));
    }

    /* player name of max score will pass argument */
    resetGame(maxScorePlayer);

})();

/* reset game to new start------------------- */
function resetGame(playerName) {

    /* setting the initial positions */
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';

    // Lossing player gets the ball
    if (playerName === player2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
    } else if (playerName === player1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) - 5 + 'px'; /* -5 to place ball above rod2 accuratel y */
    }

    Rod1score = 0;
    Rod2score = 0;

    gameStatus = false;

}


/* storage for winning player and score */
function storeWin(player, Currscore) {

    if (Currscore > maxScore) {
        maxScore = Currscore;
        localStorage.setItem(highScorePlayerName, player);
        localStorage.setItem(highScoreValue, maxScore);
    }

    /* BALL MOTION STOP */
    clearInterval(movement);

    /* color change set interval stop */
    clearInterval(colorChange);

    resetGame(player);

    alert(player + " wins with a score of " + (Currscore * 100) + ". Max score is: " + (maxScore * 100));

}

/* Movement of rods */
window.addEventListener('keypress', move);

/* function for movement*/
function move() {

    /* rod movement */
    let rod_dimension = rod1.getBoundingClientRect();

    let rod_X = rod_dimension.x; /* distance of rod's first point of contact from left wall */

    let rod_speed = 20;

    if (event.code === "KeyD" && rod_dimension.right < windowWidth) {
        rod1.style.left = rod_X + rod_speed + 'px';
        rod2.style.left = rod1.style.left
    } else if (event.code === "KeyA" && rod_dimension.left > 0) {
        rod1.style.left = rod_X - rod_speed + 'px';
        rod2.style.left = rod1.style.left;
    }

    /* ball movement and game start */
    if (event.code === "Enter") {

        /* change color start after enter key pressed */
        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"));
        let hueVal = 0;

        colorChange = setInterval(hueChange, 50);

        function hueChange() {
            hueVal += 1;
            document.documentElement.style.setProperty("--hue", hue + hueVal);
        }
        /* change color starts ends */

        /* main code of ball motion start here --------------------- */
        if (!gameStatus) {

            gameStatus = true;

            let ball_dimension = ball.getBoundingClientRect();
            let ball_X = ball_dimension.x; /* distance from left wall */
            let ball_Y = ball_dimension.y; /* distance from top wall */
            let ball_width = ball_dimension.width;

            /* height width of rod 1 */
            let rod1_height = rod1.offsetHeight;
            let rod1_width = rod1.offsetWidth;

            /* height width of rod 1 */
            let rod2_height = rod2.offsetHeight;
            let rod2_width = rod2.offsetWidth;

            /* speed of ball */
            let ball_speedX = 2;
            let ball_speedY = 2;

            /* interval for ball movement */
            movement = setInterval(ball_move, 10);
            
            /* movement of ball function */
            function ball_move() {

                /* x distance of rod 1 */
                let rod1_dimension = rod1.getBoundingClientRect();
                let rod1_X = rod1_dimension.x;

                /* x distance of rod 2 */
                let rod2_dimension = rod2.getBoundingClientRect();
                let rod2_X = rod2_dimension.x;

                /* updating position of ball from X and Y */
                ball_X += ball_speedX;
                ball_Y += ball_speedY;

                /* changing ball positon from left and top with every interval */
                ball.style.left = ball_X + 'px';
                ball.style.top = ball_Y + 'px';

                /* collison from left and right wall */
                if ((ball_X + ball_width) > windowWidth || ball_X < 0) {
                    ball_speedX = -ball_speedX;
                }

                /* find centre of ball for precise collison from rods */
                let ball_pos = ball_X + ball_width / 2;

                /* collision from rod 1 */
                if (ball_Y <= rod1_height) {
                    ball_speedY = -ball_speedY;
                    Rod1score++;
                    /* rod 2 wins */
                    if (ball_pos < rod1_X || ball_pos > (rod1_X + rod1_width)) {
                        storeWin(player2Name, Rod2score);
                    }

                }

                /* collision from rod 2 */
                if ((ball_Y + ball_width) >= (windowHeight - rod2_height)) {
                    ball_speedY = -ball_speedY;
                    Rod2score++;
                    /* rod 1 wins */
                    if (ball_pos < rod2_X || ball_pos > (rod2_X + rod2_width)) {
                        storeWin(player1Name, Rod1score);
                    }
                }
            }
        }

    }
}

