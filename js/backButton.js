import { setAppState } from './app.js';
import { stopGazeGame } from './gazeGame.js';

const backButton = document.getElementById("backButton");
const GAZE_HOVER_TIME_BACK = 300; // ms

let gazeTimerBack = null; 

// Hover logika za back button
export function checkGazeOnBackButton(dotX, dotY){
    const rect = backButton.getBoundingClientRect();
    const isHovering = dotX >= rect.left && dotX <= rect.right &&
                       dotY >= rect.top && dotY <= rect.bottom;

    if(isHovering){
        if(!gazeTimerBack){
            gazeTimerBack = setTimeout(() => {
                backButton.click();
                gazeTimerBack = null;
            }, GAZE_HOVER_TIME_BACK);
        }
    } else{
        clearTimeout(gazeTimerBack);
        gazeTimerBack = null;
    }
}

export function initBackButton(){
    backButton.addEventListener("click", () => {
        stopGazeGame(); 
        backButton.style.display = "none"; 

        const centerButton = document.getElementById("centerButton");
        centerButton.disabled = false;
        centerButton.style.opacity = 1;

        document.getElementById("menuContainer");

        setAppState("MENU");
    });
}