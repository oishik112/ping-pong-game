// DOM Manipulation Entries
var ball = document.getElementById('ball');
var rodOne = document.getElementById('rodOne');
var rodTwo = document.getElementById('rodTwo');

// Variable declaration
const storeName = "PPID"; // Key to store the player name in localStorage
const storeScore = "PPScore"; // Key to store the maximum score in localStorage
const rodOneName = "Rod One"; // Name for rod one
const rodTwoName = "Rod Two"; // Name for rod two

// Setter
let score,
  maxScore,
  movement,
  rod,
  ballSpeedX = 2,
  ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;

// Function to start and reset the game
(function () {
  rod = localStorage.getItem(storeName);
  maxScore = localStorage.getItem(storeScore);

  if (rod === null || maxScore === null) {
    alert("It's your first try, play with your heart");
    maxScore = 0;
    rod = rodOneName;
  } else {
    alert(rod + " has a max score of " + maxScore * 100);
  }

  resetSet(rod);
})();

// Reset Board Function
function resetSet(rodName) {
  rodOne.style.left = (windowWidth - rodOne.offsetWidth) / 2 + 'px';
  rodTwo.style.left = (windowWidth - rodTwo.offsetWidth) / 2 + 'px';
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';

  if (rodName === rodTwoName) {
    ball.style.top = (rodOne.offsetTop + rodOne.offsetHeight) + 'px';
    ballSpeedY = 2;
  } else if (rodName === rodOneName) {
    ball.style.top = (rodTwo.offsetTop - rodTwo.offsetHeight) + 'px';
    ballSpeedY = -2;
  }

  score = 0;
  gameOn = false;
}

// Logic to handle winning condition
function setWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(storeName, rod);
    localStorage.setItem(storeScore, maxScore);
  }

  clearInterval(movement);
  resetSet(rod);

  alert('Try again');
}

// Update the score display
function updateScoreDisplay() {
  document.getElementById('score').textContent = score;
}

// Function to handle scoring logic
function handleScoring(rod) {
  score++;

  // Update the score display
  updateScoreDisplay();
}

// Add event listeners for keypress
window.addEventListener('keydown', function (event) {
  var rodSpeed = 20;

  var rodRect = rodOne.getBoundingClientRect();

  if (event.code === 'ArrowRight' && rodRect.right < window.innerWidth) {
    rodOne.style.left = rodRect.left + rodSpeed + 'px';
    rodTwo.style.left = rodOne.style.left;
  } else if (event.code === 'ArrowLeft' && rodRect.left > 0) {
    rodOne.style.left = rodRect.left - rodSpeed + 'px';
    rodTwo.style.left = rodOne.style.left;
  }

  // Check if the ball hits a rod
  var ballRect = ball.getBoundingClientRect();
  if (ballRect.bottom >= rodOne.getBoundingClientRect().top && ballRect.left >= rodOne.getBoundingClientRect().left && ballRect.right <= rodOne.getBoundingClientRect().right) {
    handleScoring(rodOne);
  } else if (ballRect.top <= rodTwo.getBoundingClientRect().bottom && ballRect.left >= rodTwo.getBoundingClientRect().left && ballRect.right <= rodTwo.getBoundingClientRect().right) {
    handleScoring(rodTwo);
  }
});

// Add event listener for keypress
window.addEventListener('keypress', function (event) {
  let rodSpeed = 20;

  // Check if the pressed key is 'D' and if the rod can move further to the right
  if (event.code === "KeyD" && (rodRect.x + rodRect.width) < windowWidth) {
    rodOne.style.left = (rodRect.x + rodSpeed) + 'px';
    rodTwo.style.left = rodOne.style.left;
  }
  // Check if the pressed key is 'A' and if the rod can move further to the left
  else if (event.code === "KeyA" && rodRect.x > 0) {
    rodOne.style.left = (rodRect.x - rodSpeed) + 'px';
    rodTwo.style.left = rodOne.style.left;
  }

  // Check if the pressed key is 'Enter'
  if (event.code === "Enter") {
    // Check if the game is not already in progress
    if (!gameOn) {
      gameOn = true;
      
      // Get initial ball position and dimensions
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      // Get rod heights and widths
      let rod1Height = rodOne.offsetHeight;
      let rod2Height = rodTwo.offsetHeight;
      let rod1Width = rodOne.offsetWidth;
      let rod2Width = rodTwo.offsetWidth;

      // Start ball movement
      movement = setInterval(function () {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        rod1X = rodOne.getBoundingClientRect().x;
        rod2X = rodTwo.getBoundingClientRect().x;

        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';

        // Check if the ball hits the side walls
        if ((ballX + ballDia) > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX;
        }

        let ballPos = ballX + ballDia / 2;

        // Check if the ball hits the top rod
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY;
          score++;

          // Check if the ball is outside the top rod's range
          if (ballPos < rod1X || ballPos > (rod1X + rod1Width)) {
            setWin(rodTwoName, score);
          }
        }
        // Check if the ball hits the bottom rod
        else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
          ballSpeedY = -ballSpeedY;
          score++;

          // Check if the ball is outside the bottom rod's range
          if (ballPos < rod2X || ballPos > (rod2X + rod2Width)) {
            setWin(rodOneName, score);
          }
        }
      }, 10);
    }
  }
});