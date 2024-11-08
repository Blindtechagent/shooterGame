const startBtn = document.getElementById("start-btn");
const controls = document.getElementById("controls");
const enemyDiv = document.getElementById("enemy");
const gameResult = document.getElementById("game-result");
const playerScoreDisplay = document.getElementById("player-score");
const enemyScoreDisplay = document.getElementById("enemy-score");

// Audio files for different events
const sounds = {
    backgroundMusic: new Audio('https://www.myinstants.com/media/sounds/delivery-lethal-company.mp3'),
    userShoot: new Audio('https://www.myinstants.com/media/sounds/m4a1_single-kibblesbob-8540445.mp3'),
    enemyShoot: new Audio('https://www.myinstants.com/media/sounds/gunshotjbudden.mp3'),
    success: new Audio('https://www.myinstants.com/media/sounds/sfx_point.mp3'),
    start: new Audio('https://www.myinstants.com/media/sounds/gun-load_abJphmJ.mp3'),
    missShot: new Audio('miss-shot.mp3'),
    milestone: new Audio('https://www.myinstants.com/media/sounds/point-drop.mp3'),
    victory: new Audio('https://www.myinstants.com/media/sounds/magikarp-jump-coins.mp3'),
    defeat: new Audio('https://www.myinstants.com/media/sounds/tf_nemesis.mp3')
};

// Set background music to loop and play softly

sounds.backgroundMusic.volume = 0.2;
sounds.backgroundMusic.loop = true;

let playerScore = 0;
let enemyScore = 0;
let enemyDirection = "";
let gameInterval;

function startGame() {
    playerScore = 0;
    enemyScore = 0;
    updateScores();
    gameResult.textContent = "";
    controls.hidden = false;
    startBtn.hidden = true;
    enemyDiv.textContent = "Get Ready!";

    sounds.backgroundMusic.play();
    sounds.start.play();  // Start game sound

    gameInterval = setInterval(spawnEnemy, 4000);
}

function endGame() {
    clearInterval(gameInterval);
    controls.hidden = true;
    startBtn.hidden = false;
    sounds.backgroundMusic.pause();

    if (playerScore >= 10) {
        gameResult.textContent = "Victory! You defeated the enemy!";
        sounds.victory.play();
    } else {
        gameResult.textContent = "You lose! The enemy defeated you.";
        sounds.defeat.play();
    }

    startBtn.innerHTML = "Play Again";
}

function updateBackground(hit) {
    document.body.classList.toggle(hit ? "hit-bg" : "miss-bg");
    setTimeout(() => document.body.classList.remove(hit ? "hit-bg" : "miss-bg"), 300);
}

function spawnEnemy() {
    const directions = ["left", "center", "right"];
    enemyDirection = directions[Math.floor(Math.random() * directions.length)];
    enemyDiv.textContent = `Enemy approaching from: ${enemyDirection.toUpperCase()}!`;
    enemyDiv.classList.add("appear");

    const timeoutId = setTimeout(() => {
        if (enemyDirection) {
            enemyScore++;
            updateBackground(false);
            enemyDiv.textContent = "No shot fired! Enemy hits you.";
            enemyDiv.classList.remove("appear");

            // Play enemy shoot sound
            sounds.enemyShoot.play();

            updateScores();
            checkGameEnd();
        }
    }, 3000);

    document.querySelectorAll(".shoot-btn").forEach(button => {
        button.onclick = () => shootEnemy(button.dataset.direction, timeoutId);
    });
}

function shootEnemy(direction, timeoutId) {
    clearTimeout(timeoutId);

    // Play user shoot sound
    sounds.userShoot.play();

    if (direction === enemyDirection) {
        playerScore++;
        updateBackground(true);

        // Play success sound after user shoot
        sounds.success.play();

        if (playerScore === 5 || playerScore === 8) {
            sounds.milestone.play();  // Milestone sound
        }

        if (playerScore === 5) {
            enemyDiv.textContent = "Solid attack! Enemy's health is now Half.";
        } else if (playerScore === 8) {
            enemyDiv.textContent = "Great shot! Enemy health critical, Enemy is almost dead!";
        } else {
            enemyDiv.textContent = "Nice shot! Enemy Injured!";
        }
    } else {
        enemyScore++;
        updateBackground(false);

        // Play enemy shoot sound after miss shot
        sounds.enemyShoot.play();

        if (enemyScore === 5 || enemyScore === 8) {
            sounds.milestone.play();  // Milestone sound
        }

        if (enemyScore === 5) {
            enemyDiv.textContent = "Bad shot! Warning, Half health remaining!";
        } else if (enemyScore === 8) {
            enemyDiv.textContent = "Bad shot! You are dying! Act fast.";
        } else {
            enemyDiv.textContent = "Bad shot! Enemy hits you!";
        }
    }

    enemyDiv.classList.remove("appear");
    enemyDirection = "";
    updateScores();
    checkGameEnd();
}

function updateScores() {
    playerScoreDisplay.textContent = playerScore;
    enemyScoreDisplay.textContent = enemyScore;
}

function checkGameEnd() {
    if (playerScore >= 10 || enemyScore >= 10) {
        endGame();
    }
}

startBtn.addEventListener("click", startGame);

// Keyboard shortcuts for shooting with arrows
document.addEventListener("keydown", (event) => {
    if (controls.hidden) return;

    const keyMap = {
        "ArrowLeft": "left",
        "ArrowUp": "center",
        "ArrowRight": "right"
    };

    if (keyMap[event.key]) {
        shootEnemy(keyMap[event.key]);
    }
});
