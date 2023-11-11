import { loadTiles, loadSprites, loadInterface, loadItems } from "./textureLoader.js";
import { loadJSONFile } from "./JSONLoader.js";
import { renderMap } from "./mapLoader.js";
import { renderEntity, moveEntity, clearEntities } from "./entityRenderer.js";
import { renderInventoryAll, renderUIBackground, renderDictionaryBackground } from "./UIRenderer.js";

import { constructEntity } from "./entityConstructor.js";

import { player } from "./playerObject.js";

export let tiles;
export let sprites;
export let interfaceImages;
export let itemSprites;
let map;
export let tileMap;
let collisionMap;
let entities = [];
export let itemList;
let currentMapName = "start";
let textureList;

function initControls() {
    var newEl = document.body.cloneNode(false);
    while (document.body.hasChildNodes()) newEl.appendChild(document.body.firstChild);
    document.body = newEl;
    document.body.addEventListener("keydown", function(event) {
        if (event.key == "w") {
            if (!player.isMoving && !player.cantMove) {
                player.isMoving = true;
                player.orientation = "Up";
                renderEntity(player, sprites);
                if (player.y > 0 && collisionMap[player.y-1][player.x] == false){
                    let canMove = true;
                    entities.forEach(entity => {
                        if (entity.y == player.y-1 && entity.x == player.x) {
                            entity.func()
                            canMove = false;
                        }
                    });
                    if (canMove) {
                        moveEntity(player, 0, -1, sprites);
                    } else {
                        player.isMoving = false;
                    }
                } else {
                    player.isMoving = false;
                }
            }
        }
        if (event.key == "s") {
            if (!player.isMoving && !player.cantMove) {
                player.isMoving = true;
                player.orientation = "Down";
                renderEntity(player, sprites);
                if (player.y < 19 && collisionMap[player.y+1][player.x] == false){
                    let canMove = true;
                    entities.forEach(entity => {
                        if (entity.y == player.y+1 && entity.x == player.x) {
                            entity.func()
                            canMove = false;
                        }
                    });
                    if (canMove) {
                        moveEntity(player, 0, 1, sprites);
                    } else {
                        player.isMoving = false;
                    }
                } else {
                    player.isMoving = false;
                }
            }
        }
        if (event.key == "a") {
            if (!player.isMoving && !player.cantMove) {
                player.isMoving = true;
                player.orientation = "Left";
                renderEntity(player, sprites);
                if (player.x > 0 && collisionMap[player.y][player.x-1] == false){
                    let canMove = true;
                    entities.forEach(entity => {
                        if (entity.y == player.y && entity.x == player.x-1) {
                            entity.func()
                            canMove = false;
                        }
                    });
                    if (canMove) {
                        moveEntity(player, -1, 0, sprites);
                    } else {
                        player.isMoving = false;
                    }
                } else {
                    player.isMoving = false;
                }
            }
        }
        if (event.key == "d") {
            if (!player.isMoving && !player.cantMove) {
                player.isMoving = true;
                player.orientation = "Right";
                renderEntity(player, sprites);
                if (player.x < 29 && collisionMap[player.y][player.x+1] == false){
                    let canMove = true;
                    entities.forEach(entity => {
                        if (entity.y == player.y && entity.x == player.x+1) {
                            entity.func()
                            canMove = false;
                        }
                    });
                    if (canMove) {
                        moveEntity(player, 1, 0, sprites);
                    } else {
                        player.isMoving = false;
                    }
                } else {
                    player.isMoving = false;
                }
            }
        }
    });
}

async function init() {
    textureList = await loadJSONFile("./resources/textureList.json");
    console.log("Texture list loaded:");
    console.log(textureList);
    tiles = await loadTiles(textureList.tiles);
    console.log("Tiles loaded:");
    console.log(tiles);
    sprites = await loadSprites(textureList.entities);
    console.log("Sprites loaded:");
    console.log(sprites);
    interfaceImages = await loadInterface(textureList.interface);
    console.log("Interface loaded:");
    console.log(interfaceImages);
    itemSprites = await loadItems(textureList.items);
    console.log("Item sprites loaded:");
    console.log(itemSprites);
    map = await loadJSONFile("./resources/maps/"+currentMapName+"/tileMap.json");
    tileMap = map.tiles;
    collisionMap = map.collision;
    console.log("Map loaded:");
    console.log(map);
    itemList = await loadJSONFile("./resources/itemList.json");
    console.log("Item list loaded:");
    console.log(itemList);
    let tempEntities = await loadJSONFile("./resources/maps/"+currentMapName+"/entityArr.json");
    tempEntities.forEach(entity => {
        entities.push(constructEntity(entity.type, entity));
    });
    entities.forEach(entity => {
        entity.nextEvent();
    });
    console.log("Entities loaded:");
    console.log(entities);
}

async function main() {
    localStorage.clear();
    await init();
    renderMap();
    renderUIBackground();
    renderDictionaryBackground();
    renderInventoryAll();
    renderEntity(player);
    entities.forEach(entity => {
        renderEntity(entity);
    });
    initControls();
    console.log("Game started");
}

export function newMap(mapName, spawnX, spawnY) {
    return new Promise(async (resolve)=>{
        let entityArr = [];
        entities.forEach(entity => {
            let tempEntity;
            if (entity.type == "chest") {
                tempEntity = {
                    type: entity.type,
                    x: entity.x,
                    y: entity.y,
                    sprite: entity.sprite,
                    orientation: entity.orientation,
                    isLocked: entity.isLocked,
                    key: entity.key,
                    inventory,
                    eventIndex: entity.eventIndex
                }
                for (let i = 1; i < 10; i++) {
                    if (entity.inventory["slot"+i] != null) {
                        tempEntity.inventory["slot"+i] = entity.inventory["slot"+i].id;
                    } else {
                        tempEntity.inventory["slot"+i] = null;
                    }
                }
            }
            if (entity.type == "door") {
                tempEntity = {
                    type: entity.type,
                    x: entity.x,
                    y: entity.y,
                    sprite: entity.sprite,
                    orientation: entity.orientation,
                    isLocked: entity.isLocked,
                    key: entity.key,
                    destination: entity.destination,
                    spawnX: entity.spawnX,
                    spawnY: entity.spawnY,
                    eventIndex: entity.eventIndex
                }
            }
            if (entity.type == "npc") {
                tempEntity = {
                    type: entity.type,
                    x: entity.x,
                    y: entity.y,
                    sprite: entity.sprite,
                    orientation: entity.orientation,
                    name: entity.name,
                    eventList: entity.eventList,
                    eventIndex: entity.eventIndex
                }
            }
            entityArr.push(tempEntity);
        });
        let obj = {
            entities: entityArr
        }
        localStorage.setItem(currentMapName, JSON.stringify(obj));
        currentMapName = mapName;
        player.cantMove = true;
        player.x = spawnX;
        player.y = spawnY;
        map = await loadJSONFile("./resources/maps/" + mapName + "/tileMap.json");
        tileMap = map.tiles;
        collisionMap = map.collision;
        console.log("Map loaded:");
        console.log(map);
        entities = [];
        if (localStorage.getItem(mapName) != null) {
            let tempEntities = JSON.parse(localStorage.getItem(mapName)).entities;
            tempEntities.forEach(entity => {
                entities.push(constructEntity(entity.type, entity));
            });
        } else {
            let tempEntities = await loadJSONFile("./resources/maps/" + mapName + "/entityArr.json");
            tempEntities.forEach(entity => {
                entities.push(constructEntity(entity.type, entity));
            });
        }
        entities.forEach(entity => {
            entity.nextEvent();
        });
        console.log("Entities loaded:");
        console.log(entities);
        renderMap();
        clearEntities();
        renderEntity(player);
        entities.forEach(entity => {
            renderEntity(entity);
        });
        player.cantMove = false;
        resolve();
    })
}

main();