function transferKeys() {
  Object.keys(keys).forEach(function (keyName) {
    items[keyName] = keys[keyName];
  });
}

function setGuaranteedKeys(itemSet, keySet, onlyInLogic) {
  if (!options.key_lunacy) {
    for (var i = 0; i < dungeons.length; i++) {
      var dungeonName = dungeons[i];
      var shortDungeonName = shortDungeonNames[i];
      if (isMainDungeon(dungeonName)) {
        setGuaranteedKeysForDungeon(itemSet, keySet, dungeonName, shortDungeonName, onlyInLogic);
      }
    }
  }
}

function setGuaranteedKeysForDungeon(itemSet, keySet, dungeonName, shortDungeonName, onlyInLogic) {
  var guaranteedKeys = getGuaranteedKeysForDungeon(itemSet, dungeonName, onlyInLogic);
  var smallKeyName = shortDungeonName + ' Small Key';
  var bigKeyName = shortDungeonName + ' Big Key';
  itemSet[smallKeyName] = Math.max(guaranteedKeys.small, keySet[smallKeyName]);
  itemSet[bigKeyName] = Math.max(guaranteedKeys.big, keySet[bigKeyName]);
  locationsAreAvailable = setLocations(isLocationAvailable, itemSet);
}

// guaranteed keys are the minimum keys required to access any location that is blocked by non-key requirements
function getGuaranteedKeysForDungeon(itemSet, dungeonName, onlyInLogic) {
  var guaranteedSmallKeys = 4;
  var guaranteedBigKeys = 1;
  Object.keys(locationsAreAvailable[dungeonName]).forEach(function (detailedLocation) {
    if (isPotentialUnavailableKeyLocation(dungeonName, detailedLocation, onlyInLogic)) {
      var keyReqs = getKeyRequirementsForLocation(itemSet, dungeonName, detailedLocation);
      if (!keyReqs.nonKeyReqs) {
        guaranteedBigKeys = Math.min(guaranteedBigKeys, keyReqs.big);
        if (keyReqs.big === 0) { // bosses can't drop small keys
          guaranteedSmallKeys = Math.min(guaranteedSmallKeys, keyReqs.small);
        }
      }
    }
  });
  return { small: guaranteedSmallKeys, big: guaranteedBigKeys };
}

function isPotentialUnavailableKeyLocation(dungeonName, detailedLocation, onlyInLogic) {
  if (!isValidForLocation(dungeonName, detailedLocation, true)) {
    return false;
  }
  var fullLocationName = getFullLocationName(dungeonName, detailedLocation);
  if (itemLocations[fullLocationName].Types.includes('Tingle Chest')
    && !flags.includes('Tingle Chest')) {
    return false; // small keys can only appear in tingle chests if the tingle chests flag is set
  }
  return !locationsAreAvailable[dungeonName][detailedLocation]
    && (onlyInLogic || !locationsChecked[dungeonName][detailedLocation]);
}

function getKeyRequirementsForLocation(itemSet, dungeonName, detailedLocation) {
  var fullName = getFullLocationName(dungeonName, detailedLocation);
  var requirements = getLocationRequirements(fullName);
  var expression = itemsRequiredForExpression(itemSet, requirements);
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
      if (itemName.includes('Small Key')) {
        smallReq = getProgressiveNumRequired(itemName);
        continue;
      }
      if (itemName.includes('Big Key')) {
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
