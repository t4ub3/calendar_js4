const rootStyles = getComputedStyle(document.documentElement);

let colorSurface = window.getComputedStyle(document.body).getPropertyValue('--surface');
let colorSurfaceVariant = window.getComputedStyle(document.body).getPropertyValue('--surface-variant');

let colorCellDead = parseHexToRgbObject(colorSurface);
let colorCellAlive = parseHexToRgbObject(colorSurfaceVariant);

const columns = 50;
const canvas = document.getElementById("background-canvas");
const width = window.innerWidth;
const height = window.innerHeight;
const ctx = canvas.getContext("2d");
const cellSize = Math.round(width / columns);
const rows = Math.round(height / cellSize);

const generationDelay = 2000;
const animationDuration = 1500;

const dpr = window.devicePixelRatio || 1;

canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

ctx.scale(dpr, dpr);

let currentGrid = Array.from({ length: columns }, () => new Array(rows));
let nextGrid = Array.from({ length: columns }, () => new Array(rows));

function drawBackground() {
    initGrid();
    computeNextGrid();
    requestAnimationFrame(loop);
}

function initGrid() {
    for (let i = 0; i < currentGrid.length; i++) {
        for (let j = 0; j < currentGrid[i].length; j++) {
            var rndBool = Math.random() < 0.3;
            currentGrid[i][j] = rndBool;
            var color = rndBool ? colorCellAlive : colorCellDead;
            ctx.fillStyle = color;
            ctx.fillRect(i * cellSize, j * cellSize, cellSize + 1, cellSize + 1);
        }
    }
}

function computeNextGrid() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            nextGrid[i][j] = checkNewState(currentGrid[i][j], i, j);
        }
    }
}

function drawGrid(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {

            let from = currentGrid[i][j] ? 1 : 0;
            let to = nextGrid[i][j] ? 1 : 0;

            let transitionFactor = from + (to - from) * progress;

            let r = colorCellDead.r + (colorCellAlive.r - colorCellDead.r) * transitionFactor;
            let g = colorCellDead.g + (colorCellAlive.g - colorCellDead.g) * transitionFactor;
            let b = colorCellDead.b + (colorCellAlive.b - colorCellDead.b) * transitionFactor;

            ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;

            ctx.fillRect(
                i * cellSize,
                j * cellSize,
                cellSize + 1,
                cellSize + 1
            );
        }
    }
}

let lastGenerationTime = 0;
let transitionStart = 0;

function loop(timestamp) {

    if (timestamp - lastGenerationTime > generationDelay) {

        [currentGrid, nextGrid] = [nextGrid, currentGrid];

        computeNextGrid();

        transitionStart = timestamp;
        lastGenerationTime = timestamp;
    }

    let progress = Math.min(
        (timestamp - transitionStart) / animationDuration,
        1
    );

    drawGrid(progress);

    requestAnimationFrame(loop);
}

function checkNewState(currentState, i, j) {
    let aliveNeighbours = countNeighbors(i, j);
    if (aliveNeighbours === 2) {
        return currentState;
    } else if (aliveNeighbours === 3) {
        return true;
    }
    return false;
}

function wrap(value, max) {
    return (value + max) % max;
}

function countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {

            if (dx === 0 && dy === 0) continue;

            const nx = wrap(x + dx, columns);
            const ny = wrap(y + dy, rows);

            if (currentGrid[nx][ny]) {
                count++;
            }
        }
    }
    return count;
}

function parseHexToRgbObject(hex) {
    if (isValidSixDigitHex(hex)) {
        let color = {
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
        };
        return color;
    }
    throw new Error('Invalid Hex. Has to be 6 digit!');
}

function isValidSixDigitHex(hexString) {
    const hexRegex = /^#([0-9A-Fa-f]{6})$/;
    return hexRegex.test(hexString);
}



