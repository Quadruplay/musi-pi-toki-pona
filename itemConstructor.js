export const constructItem = (ID, itemList) => {
    if (ID == null) {
        return {name: "nothing"};
    }
    let item = itemList[ID];
    return item
}

export const constructChestInventory = (args, itemList) => {
    let inventory = {};
    for (let i = 1; i < 10; i++) {
        if (args["slot"+i] != null) {
            inventory["slot"+i] = constructItem(args["slot"+i], itemList);
        } else {
            inventory["slot"+i] = null;
        }
    }
    return inventory;
}