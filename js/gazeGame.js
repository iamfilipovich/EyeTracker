let currentDirection = null;
let arrowElement = null;
let score = 0;
let canScore = true;
const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
const TOLERANCE = 0.25; 
const scoreText = document.getElementById("scoreText");

export function initGazeGame() {
    score = 0;
    
    loadLeaderboard();
    const mainApp = document.getElementById("mainApp");

    if (!arrowElement) {
        arrowElement = document.createElement("div");
        arrowElement.style.cssText = `
            position:absolute;
            top:10%; left:50%;
            transform:translate(-50%, 0);
            font-size:80px;
        `;
        mainApp.appendChild(arrowElement);
    }

    const backButton = document.getElementById("backButton");
    backButton.style.display = "block";

    nextDirection();
}

function nextDirection() {
    const randomIndex = Math.floor(Math.random() * directions.length);
    currentDirection = directions[randomIndex];

    switch(currentDirection) {
        case "UP": arrowElement.textContent = "↑"; break;
        case "DOWN": arrowElement.textContent = "↓"; break;
        case "LEFT": arrowElement.textContent = "←"; break;
        case "RIGHT": arrowElement.textContent = "→"; break;
    }
}

export function checkGazeGame(dotX, dotY) {
    if (!currentDirection || dotX == null || dotY == null) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    let detected = false;

    switch(currentDirection){
        case "UP":
            if(dotY < height * TOLERANCE) detected = true;
            break;
        case "DOWN":
            if(dotY > height * (1 - TOLERANCE)) detected = true;
            break;
        case "LEFT":
            if(dotX < width * TOLERANCE) detected = true;
            break;
        case "RIGHT":
            if(dotX > width * (1 - TOLERANCE)) detected = true;
            break;
    }

    if(detected && canScore) {
        canScore = false;
        score++;
        scoreText.textContent = `Score: ${score}`;
        console.log("Current score:", score);
        nextDirection();
        
        setTimeout(() => {
            canScore = true;
        }, 500);
    }
}

export function stopGazeGame(){
    saveScore();
    if(arrowElement){
        arrowElement.remove();
        arrowElement = null;
        currentDirection = null;
    }

    const backButton = document.getElementById("backButton");
    backButton.style.display = "none";
}

async function saveScore() {
    try {
        const response = await fetch('http://localhost:3000/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'Player1',
                score: score
            })
        });

        const data = await response.json();

        console.log('Score saved:', data);
    }
    catch(error) {
        console.error('Error saving score:', error);
    }
}

async function loadLeaderboard() {
    try {
        const response = await fetch('http://localhost:3000/api/scores');

        const scores = await response.json();

        const leaderboardList = document.getElementById('leaderboardList');

        leaderboardList.innerHTML = '';

        scores.slice(0, 5).forEach(player => {
            const li = document.createElement('li');

            li.textContent = `${player.username} - ${player.score}`;

            leaderboardList.appendChild(li);
        });
    }
    catch(error) {
        console.error('Error loading leaderboard:', error);
    }
}