1. Download repository
2. Open with VS Code
3. Install Live Server extension
4. Start project by right clicking index.html and starting it with Live Server 

1️⃣ Camera Access
After starting the application:
  - You will be asked to allow camera access
  - The camera is used to track eye movement

2️⃣ Calibration (Model Training)
25 points will appear on the screen
  - The user must:
    - look at each point
    - click each point 7 times
   
3️⃣ Gaze Tracking
After calibration:
  - A yellow dot appears on the screen
  - The dot moves in real-time based on where the user is looking

4️⃣ Starting the Game
A Start Game button appears on the screen
The game starts when the user:
  - focuses their gaze on the button for a short time

5️⃣ Gameplay
A random arrow direction is displayed (↑ ↓ ← →)
The user must:
  - look in the direction of the arrow
👉 If the direction is correct:
  - a new random direction is generated
  - the game continues
