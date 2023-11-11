import { openChest, renderUIMessage, renderUIBackground, renderUIChoice } from "./UIRenderer.js";
import { newMap } from "./main.js";
import { tools } from "./tools.js";
import { player } from "./playerObject.js";

let keyListener = tools.singleKeyListener;
let multiKeyListener = tools.multiKeyListener;

export const constructEvent = (type) => {
    switch (type) {
        case "openChest":
            return openChest;
        case "message":
            return function(source,message){
                return new Promise((resolve)=>{
                    renderUIMessage(source,message);
                    player.canMoveInventory = false;
                    player.cantMove = true;
                    keyListener("Enter", ()=>{
                        renderUIBackground();
                        player.canMoveInventory = true;
                        player.cantMove = false;
                        resolve();
                    }, [])
                })
            };
        case "newMap":
            return newMap;
        case "checkKey":
            return function(key){
                return new Promise((resolve)=>{
                    if (player.checkItem(key).bool) {
                        resolve(0);
                    } else {
                        resolve(1);
                    }
                })
            };
        case "removeItem":
            return function(key){
                return new Promise((resolve)=>{
                    player.removeItem(player.checkItem(key).slot);
                    resolve();
                })
            };
        case "choice":
            return function(message, choiceArray){
                return new Promise(async (resolve)=>{
                    player.canMoveInventory = false;
                    player.cantMove = true;
                    renderUIChoice(message, choiceArray);
                    let keys = [];
                    for (let i = 0; i < choiceArray.length; i++) {
                        keys.push((i+1).toString());
                    }
                    multiKeyListener(keys, (keyIndex)=>{
                        renderUIBackground();
                        keyIndex += 0;
                        player.canMoveInventory = true;
                        player.cantMove = false;
                        resolve(keyIndex);
                    })
                })
            };
        case "unlock":
            return function(entity){
                return new Promise((resolve)=>{
                    entity.isLocked = false;
                    resolve();
                })
            }
    }
}