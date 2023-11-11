import { interfaceImages, itemSprites } from "./main.js";
import { player } from "./playerObject.js";

let canvasI = document.getElementById('inventory');
let ctxI = canvasI.getContext('2d');
ctxI.imageSmoothingEnabled = false;
let canvasIB = document.getElementById('inventoryBackground');
let ctxIB = canvasIB.getContext('2d');
ctxIB.imageSmoothingEnabled = false;
let canvasU = document.getElementById('ui');
let ctxU = canvasU.getContext('2d');
ctxU.imageSmoothingEnabled = false;
let canvasD = document.getElementById('dictionary');
let ctxD = canvasD.getContext('2d');
ctxD.imageSmoothingEnabled = false;

export const renderInventoryBackground = function() {
    ctxIB.drawImage(interfaceImages['inventory'], 0, 0, 320, 960);
    ctxIB.strokeRect(0, 0, 320, 960);
    ctxIB.font = "16px lunchds";
    ctxIB.fillStyle = "black";
    ctxIB.fillText("pona sijelo:", 10, 20);
    ctxIB.fillText("wawa sewi:", 10, 40);
    ctxIB.globalAlpha = 0.25;
    ctxIB.drawImage(interfaceImages['playerInventory'], 0, 0, 32, 32, 0, 48, 240, 240);
    ctxIB.globalAlpha = 1;
    ctxIB.fillText("poki ilo:", 10, 320);
}

const renderPlayerStats = function() {
    let hpBarWidth = 180 * (player.hp / player.maxHp);
    let mpBarWidth = 180 * (player.mp / player.maxMp);
    ctxI.fillStyle = "white";
    ctxI.fillRect(120, 5, 180, 20);
    ctxI.fillRect(120, 25, 180, 20);
    ctxI.fillStyle = "red";
    ctxI.fillRect(120, 5, hpBarWidth, 20);
    ctxI.fillStyle = "blue";
    ctxI.fillRect(120, 25, mpBarWidth, 20);
    ctxI.strokeStyle = "black";
    ctxI.strokeRect(120, 5, 180, 20);
    ctxI.strokeRect(120, 25, 180, 20);
}

const renderInventorySlots = function() {
    ctxIB.strokeStyle = "black";
    for (const [key, value] of Object.entries(player.inventory)) {
        if (value.accessible == true) {
            ctxIB.strokeRect(value.x, value.y, 64, 64);
        }
    }
}

const renderInventory = function() {
    for (const [key, value] of Object.entries(player.inventory)) {
        if (value.item != null) {
            ctxI.drawImage(itemSprites[value.item.sprite], value.x, value.y, 64, 64);
        } else if (!key.includes("slot")) {
            ctxI.drawImage(interfaceImages[key+"Empty"], value.x, value.y, 64, 64);
        }
    }
}

let selectedSlot = null;

const initInventory = function() {
    canvasI.addEventListener('mousedown', function(e) {
        for (const [key, value] of Object.entries(player.inventory)) {
            if (value.accessible == true) {
                if (player.canMoveInventory == true) {
                    if (e.offsetX >= value.x && e.offsetX <= value.x + 64 && e.offsetY >= value.y && e.offsetY <= value.y + 64) {
                        if (selectedSlot == null) {
                            ctxI.strokeStyle = "red";
                            for (let i = -1; i < 2; i++) {
                                ctxI.strokeRect(value.x-i, value.y-i, 64+2*i, 64+2*i);
                            }
                            selectedSlot = key;
                        } else if (selectedSlot == key) {
                                ctxI.clearRect(value.x-2, value.y-2, 68, 68);
                                if (value.item != null) {
                                    ctxI.drawImage(itemSprites[value.item.sprite], value.x, value.y, 64, 64);
                                } else if (!key.includes("slot")) {
                                    ctxI.drawImage(interfaceImages[key+"Empty"], value.x, value.y, 64, 64);
                                }
                                selectedSlot = null;
                        } else {
                            let slot1 = selectedSlot;
                            let slot2 = key;
                            let item1 = player.inventory[slot1].item;
                            let item2 = player.inventory[slot2].item;
                            if (item1 == null && item2 == null) {
                                ctxI.clearRect(player.inventory[slot1].x-2, player.inventory[slot1].y-2, 68, 68);
                                ctxI.clearRect(player.inventory[slot2].x-2, player.inventory[slot2].y-2, 68, 68);
                                if (!slot1.includes("slot")) {
                                    ctxI.drawImage(interfaceImages[slot1+"Empty"], player.inventory[slot1].x, player.inventory[slot1].y, 64, 64);
                                }
                                if (!slot2.includes("slot")) {
                                    ctxI.drawImage(interfaceImages[slot2+"Empty"], player.inventory[slot2].x, player.inventory[slot2].y, 64, 64);
                                }
                            } else if (item1 == null && (item2.type == player.inventory[slot1].type || player.inventory[slot1].type == "any")) {
                                player.inventory[slot1].item = item2;
                                player.inventory[slot2].item = null;
                                ctxI.clearRect(player.inventory[slot1].x-2, player.inventory[slot1].y-2, 68, 68);
                                ctxI.clearRect(player.inventory[slot2].x-2, player.inventory[slot2].y-2, 68, 68);
                                ctxI.drawImage(itemSprites[player.inventory[slot1].item.sprite], player.inventory[slot1].x, player.inventory[slot1].y, 64, 64);
                                if (!slot2.includes("slot")) {
                                    ctxI.drawImage(interfaceImages[slot2+"Empty"], player.inventory[slot2].x, player.inventory[slot2].y, 64, 64);
                                }
                            } else if (item2 == null && (item1.type == player.inventory[slot2].type || player.inventory[slot2].type == "any")) {
                                player.inventory[slot2].item = item1;
                                player.inventory[slot1].item = null;
                                ctxI.clearRect(player.inventory[slot1].x-2, player.inventory[slot1].y-2, 68, 68);
                                ctxI.clearRect(player.inventory[slot2].x-2, player.inventory[slot2].y-2, 68, 68);
                                ctxI.drawImage(itemSprites[player.inventory[slot2].item.sprite], player.inventory[slot2].x, player.inventory[slot2].y, 64, 64);
                                if (!slot1.includes("slot")) {
                                    ctxI.drawImage(interfaceImages[slot1+"Empty"], player.inventory[slot1].x, player.inventory[slot1].y, 64, 64);
                                }
                            } else if ((item1.type == player.inventory[slot2].type || player.inventory[slot2].type == "any") && (item2.type == player.inventory[slot1].type || player.inventory[slot1].type == "any")) {
                                player.inventory[slot1].item = item2;
                                player.inventory[slot2].item = item1;
                                ctxI.clearRect(player.inventory[slot1].x-2, player.inventory[slot1].y-2, 68, 68);
                                ctxI.clearRect(player.inventory[slot2].x-2, player.inventory[slot2].y-2, 68, 68);
                                ctxI.drawImage(itemSprites[player.inventory[slot1].item.sprite], player.inventory[slot1].x, player.inventory[slot1].y, 64, 64);
                                ctxI.drawImage(itemSprites[player.inventory[slot2].item.sprite], player.inventory[slot2].x, player.inventory[slot2].y, 64, 64);
                            } else {
                                ctxI.clearRect(player.inventory[slot1].x-2, player.inventory[slot1].y-2, 68, 68);
                                ctxI.clearRect(player.inventory[slot2].x-2, player.inventory[slot2].y-2, 68, 68);
                                if (item1 != null) {
                                    ctxI.drawImage(itemSprites[player.inventory[slot1].item.sprite], player.inventory[slot1].x, player.inventory[slot1].y, 64, 64);
                                } else if (!slot1.includes("slot")) {
                                    ctxI.drawImage(interfaceImages[slot1+"Empty"], player.inventory[slot1].x, player.inventory[slot1].y, 64, 64);
                                }
                                if (item2 != null) {
                                    ctxI.drawImage(itemSprites[player.inventory[slot2].item.sprite], player.inventory[slot2].x, player.inventory[slot2].y, 64, 64);
                                } else if (!slot2.includes("slot")) {
                                    ctxI.drawImage(interfaceImages[slot2+"Empty"], player.inventory[slot2].x, player.inventory[slot2].y, 64, 64);
                                }
                            }
                            selectedSlot = null;
                        }
                    }
                    if (selectedSlot == null) {
                        renderUIBackground();
                    } else {
                        renderItemDesc(player.inventory[selectedSlot].item);
                    }
                }
            }
        }
    })
}

export const openChest = function(chest) {
    for (let i=1; i<10; i++) {
        player.inventory["slotChest"+i].accessible = true;
        player.inventory["slotChest"+i].item = chest.inventory["slot"+i];
    }
    var newEl = canvasI.cloneNode(false);
    while (canvasI.hasChildNodes()) newEl.appendChild(canvasI.firstChild);
    canvasI.replaceWith(newEl);
    canvasI = document.getElementById('inventory');
    ctxI = canvasI.getContext('2d');
    ctxI.imageSmoothingEnabled = false;
    ctxI.clearRect(0, 0, 320, 960);
    ctxIB.clearRect(0, 0, 320, 960);
    renderInventoryBackground();
    renderInventoryAll(player);
    player.cantMove = true;
    ctxI.drawImage(interfaceImages['exit'], 278, 668, 32, 32);
    canvasI.addEventListener('mousedown', function(e) {
        if (e.offsetX >= 278 && e.offsetX <= 310 && e.offsetY >= 668 && e.offsetY <= 700) {
            closeChest(chest);
        }
    })
}

const closeChest = function(chest) {
    for (let i=1; i<10; i++) {
        player.inventory["slotChest"+i].accessible = false;
        chest.inventory["slot"+i] = player.inventory["slotChest"+i].item;
        player.inventory["slotChest"+i].item = null;
    }
    var newEl = canvasI.cloneNode(false);
    while (canvasI.hasChildNodes()) newEl.appendChild(canvasI.firstChild);
    canvasI.replaceWith(newEl);
    canvasI = document.getElementById('inventory');
    ctxI = canvasI.getContext('2d');
    ctxI.imageSmoothingEnabled = false;
    ctxI.clearRect(0, 0, 320, 960);
    ctxIB.clearRect(0, 0, 320, 960);
    renderInventoryBackground();
    renderInventoryAll();
    player.cantMove = false;
}

export const renderInventoryAll = function(){
    ctxI.clearRect(0, 0, 320, 960);
    renderInventoryBackground();
    renderPlayerStats();
    renderInventorySlots();
    renderInventory();
    initInventory();
}

export const renderUIBackground = function() {
    ctxU.drawImage(interfaceImages['ui'], 0, 0, 960, 320);
    ctxU.strokeRect(0, 0, 960, 640);
}

export const renderUIMessage = function(source, message) {
    renderUIBackground();
    ctxU.font = "20px lunchds";
    ctxU.fillStyle = "black";
    ctxU.fillText(source, 10, 20);
    ctxU.font = "16px lunchds";
    let textWidth;
    textWidth = ctxU.measureText(message).width;
    if (textWidth > 940) {
        let messageArray = message.split(" ");
        let lines = [];
        while (messageArray.length > 0) {
            let messageLine = "";
            while (ctxU.measureText(messageLine+messageArray[0]).width < 940 && messageArray.length > 0) {
                messageLine += messageArray[0] + " ";
                messageArray.shift();
            }
            lines.push(messageLine);
        }
        console.log(lines)
        for (let i = 0; i < lines.length; i++) {
            ctxU.fillText(lines[i], 10, 40 + 20*i);
        }
    } else {
        ctxU.fillText(message, 10, 40);
    }
}

export const renderUIChoice = function(message, choiceArray) {
    renderUIBackground();
    ctxU.font = "16px lunchds";
    let choice = 0;
    let textWidth;
    let amount = choiceArray.length;
    ctxU.fillStyle = "black";
    ctxU.fillText(message, 10, 20);
    for (let i = 0; i < amount; i++) {
        ctxU.fillText("(" + (i+1).toString() + ") " + choiceArray[i], 10, 40 + 20*i);
    }
}

export const renderItemDesc = function(item) {
    if (item == null) {
        return;
    }
    renderUIBackground();
    ctxU.font = "20px lunchds";
    ctxU.fillStyle = "black";
    ctxU.fillText(item.name, 10, 20);
    ctxU.font = "16px lunchds";
    let message = item.desc;
    let textWidth = ctxU.measureText(message).width;
    if (textWidth > 940) {
        let messageArray = message.split(" ");
        let lines = [];
        while (messageArray.length > 0) {
            let messageLine = "";
            while (ctxU.measureText(messageLine+messageArray[0]).width < 940 && messageArray.length > 0) {
                messageLine += messageArray[0] + " ";
                messageArray.shift();
            }
            lines.push(messageLine);
        }
        console.log(lines)
        for (let i = 0; i < lines.length; i++) {
            ctxU.fillText(lines[i], 10, 40 + 20*i);
        }
    } else {
        ctxU.fillText(message, 10, 40);
    }
}

export const renderDictionaryBackground = function() {
    ctxD.drawImage(interfaceImages['dictionary'], 0, 0, 320, 960);
    ctxD.strokeRect(0, 0, 320, 960);
    ctxD.font = "16px lunchds";
    ctxD.fillStyle = "black";
    ctxD.fillText("nimi ale:", 10, 20);
}
