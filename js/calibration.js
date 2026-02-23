import { setAppState } from './app.js';

export const GRID_ROWS = 5;
export const GRID_COLS = 5;

export const calibrationPoints = [];
for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
        const x = 10 + (col * 80) / (GRID_COLS - 1); 
        const y = 10 + (row * 80) / (GRID_ROWS - 1);
        calibrationPoints.push({ x, y });
    }
}

let currentPoint = 0;
let clicksPerPoint = 0;
const REQUIRED_CLICKS = 7;

const calibrationDot = document.getElementById("calibrationDot");
const calibrationContainer = document.getElementById("calibrationContainer");
const mainApp = document.getElementById("mainApp");

const calibrationData = [];

export function moveCalibrationDot() {
    if(currentPoint >= calibrationPoints.length){
        finishCalibration();
        return;
    }

    const point = calibrationPoints[currentPoint];
    calibrationDot.style.left = (point.x/100 * window.innerWidth) + "px";
    calibrationDot.style.top = (point.y/100 * window.innerHeight) + "px";
    clicksPerPoint = 0;
}

calibrationDot.addEventListener("click", () => {
    clicksPerPoint++;

    const point = calibrationPoints[currentPoint];

    // Spremi u lokalni array
    calibrationData.push({
        x: point.x/100 * window.innerWidth,
        y: point.y/100 * window.innerHeight
    });
    
    webgazer.recordScreenPosition(
        calibrationPoints[currentPoint].x/100 * window.innerWidth,
        calibrationPoints[currentPoint].y/100 * window.innerHeight,
        "click"
    );

    if(clicksPerPoint >= REQUIRED_CLICKS){
        currentPoint++;
        moveCalibrationDot();
    }
});

export function finishCalibration(){
    document.getElementById("calibrationContainer").style.display = "none";
    document.getElementById("mainApp").style.display = "block";

    calibrationData.forEach(p => {
        webgazer.recordScreenPosition(p.x, p.y, "click");
    });
    
    setAppState("MENU");
}
