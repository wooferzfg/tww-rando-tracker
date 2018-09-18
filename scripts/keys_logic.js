function transferKeys() {
    Object.keys(keys).forEach(function (keyName) {
        items[keyName] = keys[keyName];
    });
}

function setGuaranteedKeys() {
    if (!isKeyLunacy) {
        for (var i = 0; i < dungeons.length; i++) {
            var dungeonName = dungeons[i];
            var shortDungeonName = shortDungeonNames[i];
            if (isMainDungeon(dungeonName)) {
                setGuaranteedKeysForDungeon(dungeonName, shortDungeonName);
            }
        }
    }
}

function setGuaranteedKeysForDungeon(dungeonName, shortDungeonName) {
    var guaranteedKeys = getGuaranteedKeysForDungeon(dungeonName);
    var smallKeyName = shortDungeonName + " Small Key";
    var bigKeyName = shortDungeonName + " Big Key";
    items[smallKeyName] = Math.max(guaranteedKeys.small, keys[smallKeyName]);
    items[bigKeyName] = Math.max(guaranteedKeys.big, keys[bigKeyName]);
    locationsAreAvailable = setLocations(isLocationAvailable);
}

// guaranteed keys are the minimum keys required to access any location that is blocked by non-key requirements
function getGuaranteedKeysForDungeon(dugeonName) {
    var guaranteedSmallKeys = 4;
    var guaranteedBigKeys = 1;
    Object.keys(locationsAreAvailable[dugeonName]).forEach(function (detailedLocation) {
        if (isValidForLocation(dugeonName, detailedLocation, true)
            && !locationsAreAvailable[dugeonName][detailedLocation]
            && !locationsChecked[dugeonName][detailedLocation]) {
            var keyReqs = getKeyRequirementsForLocation(dugeonName, detailedLocation);
            if (!keyReqs.nonKeyReqs) {
                guaranteedSmallKeys = Math.min(guaranteedSmallKeys, keyReqs.small);
                guaranteedBigKeys = Math.min(guaranteedBigKeys, keyReqs.big);
            }
        }
    });
    return { small: guaranteedSmallKeys, big: guaranteedBigKeys };
}

function getKeyRequirementsForLocation(dungeonName, detailedLocation) {
    var expression = itemsRequiredForLocation(dungeonName, detailedLocation);
    var itemsReq = expression.items;
    if (!itemsReq) {
        itemsReq = [];
    }
    if (!Array.isArray(itemsReq)) {
        itemsReq = [expression];
    }

    var smallReq = 0;
    var bigReq = 0;
    var nonKeyReqsMet = true;
    for (var i = 0; i < itemsReq.length; i++) {
        var curItem = itemsReq[i];
        if (!curItem.type) {
            var itemName = curItem.items;
            if (itemName.includes("Small Key")) {
                smallReq = getProgressiveNumRequired(itemName);
                continue;
            }
            if (itemName.includes("Big Key")) {
                bigReq = 1;
                continue;
            }
        }
        if (!curItem.eval) {
            nonKeyReqsMet = false;
        }
    }
    return { small: smallReq, big: bigReq, nonKeyReqs: nonKeyReqsMet };
}
