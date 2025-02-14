# Snake Game with AI


A classic Snake game implemented in HTML, CSS, and JavaScript, featuring an AI that uses the A* pathfinding algorithm to play the game automatically.

## Features
- **Classic Snake Gameplay**: Move the snake around the grid, eat food, and grow longer.
- **AI Player**: The snake can be controlled by an AI that uses the A* algorithm to find the optimal path to the food.
- **Grid Visualization**: The game grid is displayed with visible lines for better visualization.
- **Responsive Design**: The game canvas adjusts to fit the screen size.

## How to Play
1. **Manual Mode**:
   - Use the arrow keys (`↑`, `↓`, `←`, `→`) to control the snake.
   - Avoid colliding with the walls or the snake's own body.

2. **AI Mode**:
   - The AI will automatically control the snake and try to find the optimal path to the food.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Kimmy-hub/Auto_Snake_Game_Using_AI.git

2. Navigate to the project directory:
   ```bash
   cd snake-game

3. Open index.html in your web browser:
   ```bash
   open index.html


# AI Implementation

The AI uses the **A\* pathfinding algorithm** to find the shortest path to the food. Key features of the AI:

- **Heuristic Function**: Uses the Manhattan distance to estimate the cost to reach the food.
- **Obstacle Avoidance**: The AI avoids collisions with the snake's body.
- **Fallback to Random Moves**: If no path is found, the AI makes random valid moves to avoid freezing.

---

# Code Structure

- `index.html`: The main HTML file that sets up the game canvas.
- `styles.css`: Contains the styles for the game.
- `script.js`: The JavaScript file with the game logic and AI implementation.

---

# Screenshots

<!-- Add screenshots of the game here if available -->
1. **Gameplay**: ![Gameplay Screenshot](screenshot1.png)
2. **AI in Action**: ![AI Screenshot](screenshot2.png)

---

# Future Improvements

- **Hamiltonian Cycle**: Implement a Hamiltonian cycle to ensure the snake can always find a path without trapping itself.
- **Dynamic Obstacle Handling**: Predict the snake's future positions to avoid collisions.
- **Performance Optimization**: Use a priority queue for the A* algorithm to improve efficiency.

---

# Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.
