import { sprites } from "./main.js";
import { tools } from "./tools.js";

const canvas = document.getElementById('entities');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const tileSize = 32;

export function renderEntity(entity) {
    let sprite = entity.getSprite();
    sprite = sprites[sprite];
    let x = entity.x * tileSize;
    let y = entity.y * tileSize;
    ctx.clearRect(x, y, tileSize, tileSize);
    ctx.drawImage(sprite, x, y, tileSize, tileSize);
}

export function moveEntity(entity, dx, dy) {
    let sprite = entity.getSprite();
    sprite = sprites[sprite];
    let px = entity.x * tileSize;
    let py = entity.y * tileSize;
    entity.x += dx;
    entity.y += dy;
    let speed = Math.pow(2, entity.speed);
    tools.delayedFor(tileSize/speed, 10, function(i) {
        ctx.clearRect(px+(dx*i*speed), py+(dy*i*speed), tileSize, tileSize);
        ctx.drawImage(sprite, px+(dx*i*speed)+dx*speed, py+(dy*i*speed)+dy*speed, tileSize, tileSize);
        if (i==tileSize/speed-1) {
            entity.isMoving=false;
        }
    });
}

export function clearEntities() {
    ctx.clearRect(0, 0, 960, 640);
}