let currentDirection = null;
let arrowElement = null;
const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
const TOLERANCE = 0.25; 

export function initGazeGame() {
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

// Ova funkcija se poziva svaki frame iz gazeListener-a
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

    if(detected) {
        nextDirection(); 
    }
}

export function stopGazeGame(){
    if(arrowElement){
        arrowElement.remove();
        arrowElement = null;
        currentDirection = null;
    }

    const backButton = document.getElementById("backButton");
    backButton.style.display = "none";
}