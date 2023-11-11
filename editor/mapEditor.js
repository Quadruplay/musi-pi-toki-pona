async function fetchPNGFilesInDirectory(path) {
    try {
        const response = await fetch(path);
        const data = await response.text();

        // Parse the HTML response to extract file names
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const links = doc.querySelectorAll('a');
        const pngFileNames = [];

        for (const link of links) {
            const fileName = link.title;
            const isPNGFile = fileName.toLowerCase().endsWith('.png');

            if (isPNGFile) {
                // Remove the file extension (.png) and add the name to the array
                const nameWithoutExtension = fileName.slice(0, -4);
                pngFileNames.push(nameWithoutExtension);
            }
        }

        return pngFileNames;
    } catch (error) {
        console.error('Error fetching directory:', error);
        return [];
    }
}

const loadTiles = () => {
    return new Promise(async (resolve)=>{
        let tiles={};
        let tilesLoaded=0;
        let tileList = await fetchPNGFilesInDirectory('../resources/textures/tiles/');
        for (let i=0; i<tileList.length; i++){
            tiles[tileList[i]]=new Image();
            tiles[tileList[i]].src="../resources/textures/tiles/" + tileList[i] + ".png";
            tiles[tileList[i]].onload=()=>{
                tilesLoaded++;
                if (tilesLoaded===tileList.length){
                    resolve(tiles);
                }
            }
        }
    })
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tileSize = 32;

let tileArray = []
let tileArrayColumn = []
let tileArrayRow = []
for (let i=0; i<30; i++){
    tileArrayRow.push("grass")
}
for (let i=0; i<20; i++){
    tileArrayColumn.push(tileArrayRow)
}
tileArray = tileArrayColumn

let tool = document.getElementById("toolType").value;
let toolType = document.getElementById("toolType");
toolType.addEventListener("change", (e)=>{
    tool = e.target.value;
})

let tiles = await loadTiles();
console.log("Tiles loaded:");
console.log(tiles);
let tileList = Object.keys(tiles);
tileList.forEach((tile)=>{
    let option = document.createElement("option");
    option.value = tile;
    option.innerHTML = tile;
    document.getElementById("tileSelector").appendChild(option);
})
for (let i=0; i<30; i++){
    for (let j=0; j<20; j++){
        ctx.drawImage(tiles[tileArray[j][i]], 0, 0, 16, 16, i*tileSize, j*tileSize, tileSize, tileSize);
    }
}
document.getElementById("tileCanvas").getContext("2d").drawImage(tiles[tileList[0]], 0, 0, 16, 16, 0, 0, 4*tileSize, 4*tileSize);
document.getElementById("tileSelector").addEventListener("change", (e)=>{
    let canvas = document.getElementById("tileCanvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tiles[e.target.value], 0, 0, 16, 16, 0, 0, 4*tileSize, 4*tileSize);
})

let fillButton = document.getElementById("fillButton");
fillButton.addEventListener("click", ()=>{
    let tile = document.getElementById("tileSelector").value;
    for (let i=0; i<30; i++){
        for (let j=0; j<20; j++){
            tileArray[j][i] = tile;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i=0; i<30; i++){
        for (let j=0; j<20; j++){
            ctx.drawImage(tiles[tileArray[j][i]], 0, 0, 16, 16, i*tileSize, j*tileSize, tileSize, tileSize);
        }
    }
})

let isPainting = false;

canvas.addEventListener("mousedown", (e) => {
    isPainting = true;
    if (tool==="draw"){
        paintTile(e);
    } else if (tool==="fill"){
        fillTiles(e, document.getElementById("tileSelector").value);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i=0; i<30; i++){
            for (let j=0; j<20; j++){
                ctx.drawImage(tiles[tileArray[j][i]], 0, 0, 16, 16, i*tileSize, j*tileSize, tileSize, tileSize);
            }
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (isPainting && tool==="draw") {
        paintTile(e);
    }
});

canvas.addEventListener("mouseup", () => {
    isPainting = false;
});

function paintTile(e) {
    if (isPainting) {
        let x = Math.floor(e.offsetX / tileSize)
        let y = Math.floor(e.offsetY / tileSize)
        let tile = document.getElementById("tileSelector").value;
        let tileArrayCopy = tileArray.map((row) => [...row]);
        tileArrayCopy[y][x] = tile;
        tileArray = tileArrayCopy;
        ctx.drawImage(
            tiles[tile],
            0,
            0,
            16,
            16,
            Math.floor(e.offsetX / tileSize) * tileSize,
            Math.floor(e.offsetY / tileSize) * tileSize,
            tileSize,
            tileSize
        );
    }
}

function fillTiles(e, newTile) {
    let x = Math.floor(e.offsetX / tileSize)
    let y = Math.floor(e.offsetY / tileSize)
    let tileArrayCopy = tileArray.map((row) => [...row]);
    let oldTile = tileArrayCopy[y][x];
    if (oldTile == newTile) {
        return;
    }
    tileArrayCopy[y][x] = newTile;
    tileArray = tileArrayCopy;
    if (x!=0){
        if (tileArray[y][x-1]===oldTile){
            fillTiles({offsetX: (x-1)*tileSize, offsetY: y*tileSize}, newTile);
        }
    }
    if (x!=29){
        if (tileArray[y][x+1]===oldTile){
            fillTiles({offsetX: (x+1)*tileSize, offsetY: y*tileSize}, newTile);
        }
    }
    if (y!=0){
        if (tileArray[y-1][x]===oldTile){
            fillTiles({offsetX: x*tileSize, offsetY: (y-1)*tileSize}, newTile);
        }
    }
    if (y!=19){
        if (tileArray[y+1][x]===oldTile){
            fillTiles({offsetX: x*tileSize, offsetY: (y+1)*tileSize}, newTile);
        }
    }
}

const collisionCanvas = document.getElementById("collisionCanvas");
let collisionCtx = collisionCanvas.getContext("2d");
collisionCtx.globalAlpha = 0.25;
const collisionButton = document.getElementById("collisionButton");

let collisionArray = []
let collisionArrayColumn = []
let collisionArrayRow = []

for (let i=0; i<30; i++){
    collisionArrayRow.push(false)
}
for (let i=0; i<20; i++){
    collisionArrayColumn.push(collisionArrayRow)
}
collisionArray = collisionArrayColumn

collisionCanvas.style.display = "none";
collisionCanvas.style.pointerEvents = "none";

collisionButton.addEventListener("click", () => {
    if (collisionCanvas.style.display === "none") {
        // Bring "collisionCanvas" to the front
        collisionCanvas.style.display = "block";
        collisionCanvas.style.pointerEvents = "auto";
        collisionButton.textContent = "Hide Collision";
    } else {
        // Bring "canvas" to the front
        collisionCanvas.style.display = "none";
        collisionCanvas.style.pointerEvents = "none";
        collisionButton.textContent = "Show Collision";
    }
});

let collisionChangeElement = document.getElementById("collision");
let collisionChange;
if (collisionChangeElement.value==="1"){
    collisionChange = true;
} else {
    collisionChange = false;
}
collisionChangeElement.addEventListener("change", (e)=>{
    if (e.target.value==="1"){
        collisionChange = true;
    } else {
        collisionChange = false;
    }
    console.log(collisionChange);
})

let isPaintingCollision = false;

collisionCanvas.addEventListener("mousedown", (e) => {
    isPaintingCollision = true;
    paintCollision(e);
});

collisionCanvas.addEventListener("mousemove", (e) => {
    if (isPaintingCollision) {
        paintCollision(e);
    }
});

collisionCanvas.addEventListener("mouseup", () => {
    isPaintingCollision = false;
});

for (let i=0; i<30; i++){
    for (let j=0; j<20; j++){
        if (collisionArray[j][i]){
            collisionCtx.fillStyle = "red"
        } else {
            collisionCtx.fillStyle = "white"
        }
        collisionCtx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
    }
}

function paintCollision(e) {
    if (isPaintingCollision) {
        let x = Math.floor(e.offsetX / tileSize)
        let y = Math.floor(e.offsetY / tileSize)
        let collisionArrayCopy = collisionArray.map((row) => [...row]);
        collisionArrayCopy[y][x] = collisionChange;
        collisionArray = collisionArrayCopy;
        collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
        for (let i=0; i<30; i++){
            for (let j=0; j<20; j++){
                if (collisionArray[j][i]){
                    collisionCtx.fillStyle = "red"
                } else {
                    collisionCtx.fillStyle = "white"
                }
                collisionCtx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
            }
        }
    }
}

function compileMap(){
    let map = {
        tiles: tileArray,
        collision: collisionArray
    }
    return map;
}

function clearMap(){
    for (let i=0; i<30; i++){
        for (let j=0; j<20; j++){
            tileArray[j][i] = "grass";
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i=0; i<30; i++){
        for (let j=0; j<20; j++){
            ctx.drawImage(tiles[tileArray[j][i]], 0, 0, 16, 16, i*tileSize, j*tileSize, tileSize, tileSize);
        }
    }
    collisionArray = collisionArrayColumn;
    collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
    for (let i=0; i<30; i++){
        for (let j=0; j<20; j++){
            if (collisionArray[j][i]){
                collisionCtx.fillStyle = "red"
            } else {
                collisionCtx.fillStyle = "white"
            }
            collisionCtx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
        }
    }
}

let saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", ()=>{
    let map = compileMap();
    localStorage.setItem("map", JSON.stringify(map));
})

let loadButton = document.getElementById("loadButton");
loadButton.addEventListener("click", ()=>{
    let map = JSON.parse(localStorage.getItem("map"));
    tileArray = map.tiles;
    collisionArray = map.collision;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i=0; i<30; i++){
        for (let j=0; j<20; j++){
            ctx.drawImage(tiles[tileArray[j][i]], 0, 0, 16, 16, i*tileSize, j*tileSize, tileSize, tileSize);
        }
    }
    collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
    for (let i=0; i<30; i++){
        for (let j=0; j<20; j++){
            if (collisionArray[j][i]){
                collisionCtx.fillStyle = "red"
            } else {
                collisionCtx.fillStyle = "white"
            }
            collisionCtx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
        }
    }
})

let clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", ()=>{
    clearMap();
})

function download(map,filename,type){
    const file=new Blob([JSON.stringify(map)],{type:type});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(file);
    a.download=filename;
    a.click();
}

let downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", ()=>{
    let map = compileMap();
    download(map,"tileMap.json","application/json");
})