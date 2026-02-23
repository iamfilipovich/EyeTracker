export let menuButtons = []; 

export function initGazeMenu() {
    const mainApp = document.getElementById("mainApp");
    
    // Home button
    const homeButton = document.createElement("button");
    homeButton.textContent = "Home";
    homeButton.style.cssText = "position:absolute; top:20px; left:20px; padding:30px 60px; font-size:30px;";
    mainApp.appendChild(homeButton);
    
    homeButton.addEventListener("click", () => {
        location.reload(); 
    });

    // Game button
    const gameButton = document.createElement("button");
    gameButton.textContent = "Start Game";
    gameButton.style.cssText = "position:absolute; top:20px; right:20px; padding:30px 60px; font-size:30px;";
    mainApp.appendChild(gameButton);

    gameButton.addEventListener("click", () => {
        import('./gazeGame.js').then(module => module.initGazeGame());
        gameButton.disabled = true;
        gameButton.style.opacity = 0.5;
    });

    menuButtons = [homeButton, gameButton];
    return menuButtons;
}

// Funkcija koju gaze listener poziva
export function checkGazeOnMenu(dotX, dotY) {
    menuButtons.forEach(button => {
        const rect = button.getBoundingClientRect();
        const isHovering = dotX >= rect.left && dotX <= rect.right &&
                           dotY >= rect.top && dotY <= rect.bottom;
        
        if(isHovering && button !== undefined){
            button.click(); 
        }
    });
}
