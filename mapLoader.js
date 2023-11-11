import { tiles, tileMap } from "./main.js";

const canvas = document.getElementById('tiles');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const tileSize = 32;

function renderTile(tile, x, y) {
    ctx.drawImage(tile, 0, 0, 16, 16, x, y, tileSize, tileSize);
}

export function renderMap() {
    for (let i = 0; i < tileMap.length; i++) {
        for (let j = 0; j < tileMap[i].length; j++) {
            renderTile(tiles[tileMap[i][j]], j * tileSize, i * tileSize);
        }
    }
    ctx.strokeRect(0, 0, 960, 640);
}