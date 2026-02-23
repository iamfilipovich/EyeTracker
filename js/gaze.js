export let smoothX = window.innerWidth / 2;
export let smoothY = window.innerHeight / 2;
export let lastX = smoothX;
export let lastY = smoothY;

const SMOOTH_FACTOR = 0.15;
const MIN_MOVE = 2;

const dot = document.getElementById("dot");

// gaze listener koji se importira u app.js
export function gazeListener(data, gazeButtonHandler){
    if(!data) return;

    smoothX += (data.x - smoothX) * SMOOTH_FACTOR;
    smoothY += (data.y - smoothY) * SMOOTH_FACTOR;

    if(Math.abs(smoothX - lastX) < MIN_MOVE && Math.abs(smoothY - lastY) < MIN_MOVE) return;

    lastX = smoothX;
    lastY = smoothY;

    dot.style.left = smoothX + "px";
    dot.style.top = smoothY + "px";

    if(gazeButtonHandler){
        gazeButtonHandler(smoothX, smoothY);
    }
}
