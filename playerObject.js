import { renderInventoryAll } from "./UIRenderer.js";

export let player = {
    x: 0,
    y: 0,
    sprite: "player",
    orientation: "Down",
    getSprite() {
        return this.sprite + this.orientation;
    },
    isMoving: false,
    cantMove: false,
    canMoveInventory: true,
    speed: 2,
    hp: 8,
    maxHp: 10,
    mp: 5,
    maxMp: 10,
    inventory: {
        head: {
            x: 88,
            y: 50,
            item: null,
            type: "head",
            accessible: true
        },
        body: {
            x: 88,
            y: 130,
            item: null,
            type: "body",
            accessible: true
        },
        hand1: {
            x: 8,
            y: 130,
            item: null,
            type: "hand",
            accessible: true
        },
        hand2: {
            x: 168,
            y: 130,
            item: null,
            type: "hand",
            accessible: true
        },
        boots: {
            x: 88,
            y: 210,
            item: null,
            type: "boots",
            accessible: true
        },
        ring1: {
            x: 248,
            y: 130,
            item: null,
            type: "ring",
            accessible: true
        },
        ring2: {
            x: 248,
            y: 210,
            item: null,
            type: "ring",
            accessible: true
        },
        necklace: {
            x: 248,
            y: 50,
            item: null,
            type: "necklace",
            accessible: true
        },
        slot1: {
            x: 8,
            y: 340,
            item: null,
            type: "any",
            accessible: true
        },
        slot2: {
            x: 88,
            y: 340,
            item: null,
            type: "any",
            accessible: true
        },
        slot3: {
            x: 168,
            y: 340,
            item: null,
            type: "any",
            accessible: true
        },
        slot4: {
            x: 248,
            y: 340,
            item: null,
            type: "any",
            accessible: true
        },
        slot5: {
            x: 8,
            y: 420,
            item: null,
            type: "any",
            accessible: true
        },
        slot6: {
            x: 88,
            y: 420,
            item: null,
            type: "any",
            accessible: true
        },
        slot7: {
            x: 168,
            y: 420,
            item: null,
            type: "any",
            accessible: true
        },
        slot8: {
            x: 248,
            y: 420,
            item: null,
            type: "any",
            accessible: true
        },
        slot9: {
            x: 8,
            y: 500,
            item: null,
            type: "any",
            accessible: true
        },
        slot10: {
            x: 88,
            y: 500,
            item: null,
            type: "any",
            accessible: true
        },
        slot11: {
            x: 168,
            y: 500,
            item: null,
            type: "any",
            accessible: true
        },
        slot12: {
            x: 248,
            y: 500,
            item: null,
            type: "any",
            accessible: true
        },
        slot13: {
            x: 8,
            y: 580,
            item: null,
            type: "any",
            accessible: true
        },
        slot14: {
            x: 88,
            y: 580,
            item: null,
            type: "any",
            accessible: true
        },
        slot15: {
            x: 168,
            y: 580,
            item: null,
            type: "any",
            accessible: true
        },
        slot16: {
            x: 248,
            y: 580,
            item: null,
            type: "any",
            accessible: true
        },
        slotChest1: {
            x: 48,
            y: 700,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest2: {
            x: 128,
            y: 700,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest3: {
            x: 208,
            y: 700,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest4: {
            x: 48,
            y: 780,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest5: {
            x: 128,
            y: 780,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest6: {
            x: 208,
            y: 780,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest7: {
            x: 48,
            y: 860,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest8: {
            x: 128,
            y: 860,
            item: null,
            type: "any",
            accessible: false
        },
        slotChest9: {
            x: 208,
            y: 860,
            item: null,
            type: "any",
            accessible: false
        }
    },
    dictionary: {

    },
    checkItem(item) {
        for (const [key, value] of Object.entries(this.inventory) ) {
            if (value.item != null && value.item.id == item) {
                return {slot: key, bool: true};
            }
        }
        return {slot: null, bool: false};
    },
    removeItem(slot) {
        this.inventory[slot].item = null;
        renderInventoryAll();
    }
}