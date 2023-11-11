import { openChest, renderUIBackground, renderUIMessage, renderUIChoice } from "./UIRenderer.js";
import { constructItem, constructChestInventory } from "./itemConstructor.js";
import { constructEvent } from "./eventConstructor.js";
import { tools } from "./tools.js";
import { player } from "./playerObject.js";
import { itemList } from "./main.js";
let keyListener = tools.singleKeyListener;

export const constructEntity = (type, args) => {
    return new Entity(type, args);
}

export class Entity{
    constructor(type, args) {
        this.type = type;
        this.x = args["x"];
        this.y = args["y"];
        this.sprite = args["sprite"];
        this.orientation = args["orientation"];
        this.getSprite = () => {
            return this.sprite + this.orientation;
        }
        this.eventIndex = args["eventIndex"];
        this.nextEvent = ()=>{
            this.currentEvent = constructEvent(this.eventList[this.eventIndex][0]);
        };
        if (type == "chest" || type == "door") {
            this.isLocked = args["isLocked"];
            this.key = args["key"];
        }
        if (type == "chest") {
            this.name = "poki";
            this.inventory = constructChestInventory(args["inventory"], itemList);
            this.eventList = [
                ["openChest", [this], [[0,false]]], 
                ["message", [this.name,"sina jo e " + constructItem(args["key"], itemList).name + " la sina open e ni."], [[2,true]]],
                ["checkKey", [this.key], [[4,true],[3,true]]],
                ["message", [this.name,"sina jo ala e " + constructItem(args["key"], itemList).name + "."], [[1,false]]],
                ["choice", ["sina wile ala wile open e ni kepeken " + constructItem(args["key"], itemList).name + "?", ["lon", "ala"]], [[5,true],[1,false]]],
                ["removeItem", [this.key], [[6,true]]],
                ["unlock", [this], [[0,false]]]
            ];
        }
        if (type == "door") {
            this.name = "lupa"
            this.destination = args["destination"];
            this.spawnX = args["spawnX"];
            this.spawnY = args["spawnY"];
            this.eventList = [
                ["newMap", [this.destination, this.spawnX, this.spawnY], [[0,false]]],
                ["message", [this.name,"sina jo e " + constructItem(args["key"], itemList).name + " la sina open e ni."], [[2,true]]],
                ["checkKey", [this.key], [[4,true],[3,true]]],
                ["message", [this.name,"sina jo ala e " + constructItem(args["key"], itemList).name + "."], [[1,false]]],
                ["choice", ["sina wile ala wile open e ni kepeken " + constructItem(args["key"], itemList).name + "?", ["lon", "ala"]], [[5,true],[1,false]]],
                ["removeItem", [this.key], [[6,true]]],
                ["unlock", [this], [[0,false]]]
            ];
        }
        if (type == "npc") {
            this.name = args["name"];
            this.eventList = args["eventList"];
        }
        this.func = async ()=>{
            console.log("doing stuff")
            let next = await this.currentEvent(...this.eventList[this.eventIndex][1]);
            if (typeof next != "number") {
                next = 0;
            }
            let executeInstantly = this.eventList[this.eventIndex][2][next][1];
            this.eventIndex = this.eventList[this.eventIndex][2][next][0];
            this.nextEvent();
            if (executeInstantly) {
                this.func();
            }
        }
    }
}