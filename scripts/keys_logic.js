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
    var smallKeyCount = Math.max(guaranteedKeys.small, keys[smallKeyName]);
    var bigKeyCount = Math.max(guaranteedKeys.big, keys[bigKeyName]);
    if (smallKeyCount > items[smallKeyName] || bigKeyCount > items[bigKeyName]) {
        items[smallKeyName] = smallKeyCount;
        items[bigKeyName] = bigKeyCount;
        locationsAreAvailable = setLocations(isLocationAvailable);
        setGuaranteedKeysForDungeon(dungeonName, shortDungeonName); // we might be guaranteed more keys, so check recursively
        return;
    }
}

function getGuaranteedKeysForDungeon(dugeonName) {
    var guaranteedSmallKeys = 4;
    var guaranteedBigKeys = 1;
    Object.keys(locationsAreAvailable[dugeonName]).forEach(function (detailedLocation) {
        if (isValidForLocation(dugeonName, detailedLocation, true)
            && !locationsAreAvailable[dugeonName][detailedLocation]
            && !locationsChecked[dugeonName][detailedLocation]) {
            var keyReqs = getKeyRequirementsForLocation(dugeonName, detailedLocation);
            guaranteedSmallKeys = Math.min(guaranteedSmallKeys, keyReqs.small);
            guaranteedBigKeys = Math.min(guaranteedBigKeys, keyReqs.big);
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
    for (var i = 0; i < itemsReq.length; i++) {
        var curItem = itemsReq[i];
        if (!curItem.type) {
            if (curItem.includes("Small Key")) {
                smallReq = getProgressiveNumRequired(curItem);
            }
            if (curItem.includes("Big Key")) {
                bigReq = 1;
            }
        }
    }
    return { small: smallReq, big: bigReq };
}
