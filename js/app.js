import {moveCalibrationDot, finishCalibration} from './calibration.js';
import {checkGazeOnCenterButton, initCenterButton} from './gazeButton.js';
import {checkGazeOnBackButton, initBackButton} from './backButton.js';
// import {initGazeMenu} from './gazeMenu.js';
import {checkGazeGame} from './gazeGame.js';

let appState = "CALIBRATION";

export function getAppState(){
    return appState;
}

export function setAppState(newState){
    appState = newState;
}

async function initWebGazerAndCalibration() {
    await webgazer.clearData();
    webgazer.saveDataAcrossSessions(true);

    await webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener((data) => {
            if(!data) return;

            const dotX = data.x;
            const dotY = data.y;

            const gazeDot = document.getElementById("dot");
            if(gazeDot){
                gazeDot.style.left = dotX + "px";
                gazeDot.style.top = dotY + "px";
            }

            if(getAppState() === "MENU"){
                checkGazeOnCenterButton(dotX, dotY);
            }

            if(getAppState() === "GAME"){
                checkGazeGame(dotX, dotY);
                checkGazeOnBackButton(dotX, dotY);
            }
        })
        .begin();

    webgazer.showVideo(false);
    webgazer.showPredictionPoints(false);
    webgazer.showFaceOverlay(false);

    const checkReady = setInterval(() => {
        const video = document.querySelector("video");
        if(video && video.readyState >= 2){ 
            clearInterval(checkReady);
            console.log("Camera ready, starting calibration...");
            document.getElementById("calibrationContainer").style.display = "block";
            moveCalibrationDot();
        }
    }, 100);
}

window.onload = () => {
    document.getElementById("mainApp").style.display = "none";
    document.getElementById("calibrationContainer").style.display = "none";
    initCenterButton();
    initWebGazerAndCalibration();
    initBackButton();
};
