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
        console.log(JSON.stringify(pngFileNames))
        return pngFileNames;
    } catch (error) {
        console.error('Error fetching directory:', error);
        return [];
    }
}

export const loadTiles = (tileList) => {
    return new Promise(async (resolve)=>{
        let tiles={};
        let tilesLoaded=0;
        for (let i=0; i<tileList.length; i++){
            tiles[tileList[i]]=new Image();
            tiles[tileList[i]].src="./resources/textures/tiles/" + tileList[i] + ".png";
            tiles[tileList[i]].onload=()=>{
                tilesLoaded++;
                if (tilesLoaded===tileList.length){
                    resolve(tiles);
                }
            }
        }
    })
}

export const loadSprites = (spriteList) => {
    return new Promise(async (resolve)=>{
        let sprites={};
        let spritesLoaded=0;
        for (let i=0; i<spriteList.length; i++){
            sprites[spriteList[i]]=new Image();
            sprites[spriteList[i]].src="./resources/textures/entities/" + spriteList[i] + ".png";
            sprites[spriteList[i]].onload=()=>{
                spritesLoaded++;
                if (spritesLoaded===spriteList.length){
                    resolve(sprites);
                }
            }
        }
    })
}

export const loadInterface = (interfaceImageList) => {
    return new Promise(async (resolve)=>{
        let interfaceImages={};
        let interfaceImagesLoaded=0;
        for (let i=0; i<interfaceImageList.length; i++){
            interfaceImages[interfaceImageList[i]]=new Image();
            interfaceImages[interfaceImageList[i]].src="./resources/textures/interface/" + interfaceImageList[i] + ".png";
            interfaceImages[interfaceImageList[i]].onload=()=>{
                interfaceImagesLoaded++;
                if (interfaceImagesLoaded===interfaceImageList.length){
                    resolve(interfaceImages);
                }
            }
        }
    })
}

export const loadItems = (itemList) => {
    return new Promise(async (resolve)=>{
        let items={};
        let itemsLoaded=0;
        for (let i=0; i<itemList.length; i++){
            items[itemList[i]]=new Image();
            items[itemList[i]].src="./resources/textures/items/" + itemList[i] + ".png";
            items[itemList[i]].onload=()=>{
                itemsLoaded++;
                if (itemsLoaded===itemList.length){
                    resolve(items);
                }
            }
        }
    })
}