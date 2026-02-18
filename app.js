let smoothX = window.innerWidth / 2;
let smoothY = window.innerHeight / 2;
let lastX = smoothX;
let lastY = smoothY;
const SMOOTH_FACTOR = 0.15;
const MIN_MOVE = 2;

const calibrationPoints = [
    {x: 10, y: 10},
    {x: 50, y: 10},
    {x: 90, y: 10},
    {x: 10, y: 50},
    {x: 50, y: 50},
    {x: 90, y: 50},
    {x: 10, y: 90},
    {x: 50, y: 90},
    {x: 90, y: 90},
];

let currentPoint = 0;
let clicksPerPoint = 0;
const REQUIRED_CLICKS = 5;

const calibrationDot = document.getElementById("calibrationDot");
const calibrationContainer = document.getElementById("calibrationContainer");
const mainApp = document.getElementById("mainApp");
const dot = document.getElementById("dot");

const centerButton = document.getElementById("centerButton");
const GAZE_HOVER_TIME_BUTTON = 400; // ms
let gazeTimerButton = null;
let gazeTargetButton = null;

function moveCalibrationDot() {
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

function finishCalibration(){
    calibrationContainer.style.display = "none";
    mainApp.style.display = "block";
}

function gazeListener(data){
    if(!data) return;

    smoothX += (data.x - smoothX) * SMOOTH_FACTOR;
    smoothY += (data.y - smoothY) * SMOOTH_FACTOR;

    if(Math.abs(smoothX - lastX) < MIN_MOVE && Math.abs(smoothY - lastY) < MIN_MOVE) return;

    lastX = smoothX;
    lastY = smoothY;

    dot.style.left = smoothX + "px";
    dot.style.top = smoothY + "px";

    checkGazeOnCenterButton(smoothX, smoothY);
}

function checkGazeOnCenterButton(dotX, dotY) {
    const rect = centerButton.getBoundingClientRect();
    const isHovering = dotX >= rect.left && dotX <= rect.right &&
                       dotY >= rect.top && dotY <= rect.bottom;

    if(isHovering && gazeTargetButton !== centerButton){
        gazeTargetButton = centerButton;
        clearTimeout(gazeTimerButton);
        gazeTimerButton = setTimeout(() => {
            centerButton.click(); 
            gazeTimerButton = null;
        }, GAZE_HOVER_TIME_BUTTON);
    } 
    else if(!isHovering){
        gazeTargetButton = null;
        clearTimeout(gazeTimerButton);
        gazeTimerButton = null;
    }
}

centerButton.addEventListener("click", () => {
    alert("Button activated by gaze!");
});

async function initWebGazerAndCalibration() {
    await webgazer.clearData();
    webgazer.saveDataAcrossSessions(false);

    await webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener(gazeListener)
        .begin();

    webgazer.showVideo(false);
    webgazer.showPredictionPoints(false);
    webgazer.showFaceOverlay(false);

    const checkReady = setInterval(() => {
        const video = document.querySelector("video");
        if(video && video.readyState >= 2){ 
            clearInterval(checkReady);
            console.log("Camera ready, starting calibration...");
            calibrationContainer.style.display = "block";
            moveCalibrationDot();
        }
    }, 100);
}

window.onload = () => {
    mainApp.style.display = "none";
    calibrationContainer.style.display = "none";
    initWebGazerAndCalibration();
};
