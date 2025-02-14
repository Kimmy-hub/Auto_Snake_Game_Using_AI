const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // Size of each grid cell
const tileCount = canvas.width / gridSize; // Number of tiles in each row/column

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let isAI = true; // Set to true to enable AI

function gameLoop() {
    if (isAI) {
        moveAI(); // Let the AI decide the direction
    }
    update();
    draw();
    setTimeout(gameLoop, 100);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap around the screen
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    // Check for collision with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    drawGrid();

    // Draw the snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw the score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function drawGrid() {
    ctx.strokeStyle = "#333"; // Grid line color
    ctx.lineWidth = 1;

    for (let i = 0; i < tileCount; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Ensure food doesn't spawn on the snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    placeFood();
}

// A* Pathfinding Algorithm
function aStar(start, goal, obstacles) {
    const openSet = new Set([`${start.x},${start.y}`]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(`${start.x},${start.y}`, 0);
    fScore.set(`${start.x},${start.y}`, heuristic(start, goal));

    let iterations = 0;
    const maxIterations = 1000; // Prevent infinite loops

    while (openSet.size > 0) {
        iterations++;
        if (iterations > maxIterations) {
            return null; // Timeout to prevent freezing
        }

        let current = null;
        let lowestFScore = Infinity;

        for (const node of openSet) {
            const score = fScore.get(node) || Infinity;
            if (score < lowestFScore) {
                lowestFScore = score;
                current = node;
            }
        }

        if (current === `${goal.x},${goal.y}`) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);

        const [currentX, currentY] = current.split(",").map(Number);
        const neighbors = getNeighbors({ x: currentX, y: currentY });

        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.x},${neighbor.y}`;

            if (obstacles.some(obstacle => obstacle.x === neighbor.x && obstacle.y === neighbor.y)) {
                continue; // Skip obstacles
            }

            const tentativeGScore = (gScore.get(current) || 0) + 1;

            if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal));
                if (!openSet.has(neighborKey)) {
                    openSet.add(neighborKey);
                }
            }
        }
    }

    return null; // No path found
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan distance
}

function getNeighbors(node) {
    const neighbors = [];
    if (node.x > 0) neighbors.push({ x: node.x - 1, y: node.y });
    if (node.x < tileCount - 1) neighbors.push({ x: node.x + 1, y: node.y });
    if (node.y > 0) neighbors.push({ x: node.x, y: node.y - 1 });
    if (node.y < tileCount - 1) neighbors.push({ x: node.x, y: node.y + 1 });
    return neighbors;
}

function reconstructPath(cameFrom, current) {
    const path = [];
    while (current) {
        const [x, y] = current.split(",").map(Number);
        path.unshift({ x, y });
        current = cameFrom.get(current);
    }
    return path;
}

function moveAI() {
    const head = snake[0];
    const path = aStar(head, food, snake.slice(1));

    if (path && path.length > 1) {
        const next = path[1];
        direction = { x: next.x - head.x, y: next.y - head.y };
    } else {
        // If no path is found, move randomly to avoid freezing
        const neighbors = getNeighbors(head).filter(neighbor =>
            !snake.some(segment => segment.x === neighbor.x && segment.y === neighbor.y)
        );
        if (neighbors.length > 0) {
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            direction = { x: randomNeighbor.x - head.x, y: randomNeighbor.y - head.y };
        }
    }
}

document.addEventListener("keydown", event => {
    if (!isAI) {
        switch (event.key) {
            case "ArrowUp":
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case "ArrowDown":
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }
});

placeFood();
gameLoop();