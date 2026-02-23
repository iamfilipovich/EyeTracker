import { initGazeGame } from './gazeGame.js'; // uvezi funkciju za igru
import {  getAppState, setAppState } from './app.js';

const centerButton = document.getElementById("centerButton");
const GAZE_HOVER_TIME_BUTTON = 300; // ms
let gazeTimerButton = null;
let gazeTargetButton = null;

export function checkGazeOnCenterButton(dotX, dotY){
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

// Promjena ovdje: klik na button pokreće igru
export function initCenterButton(){
    centerButton.addEventListener("click", () => {
        if(getAppState() !== "MENU") return;

        setAppState("GAME");
        initGazeGame();

        //Onemoguci klik
        centerButton.disabled = true;
        centerButton.style.opacity = 0.5;
    });
}
