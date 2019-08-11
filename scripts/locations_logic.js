function getDetailedLocations(generalLocation, isDungeon) {
  var result = [];
  var allDetailedLocations = locationsAreProgress[generalLocation] || {};
  Object.keys(allDetailedLocations).forEach(function (detailedLocation) {
    if ((isValidForLocation(generalLocation, detailedLocation, isDungeon))
      && (showNonProgressLocations || locationsAreProgress[generalLocation][detailedLocation])) {
      result.push("[" + spheres[generalLocation][detailedLocation] + "] " + detailedLocation);
    }
  })
  return result;
}

function setLocationsAreProgress() {
  locationsAreProgress = setLocations(isLocationProgress);
}

function setLocationsAreAvailable() {
  if (hideLocationLogic) {
    locationsAreAvailable = setLocations(() => true);
  } else {
    transferKeys();
    locationsAreAvailable = setLocations(isLocationAvailable, items);
    setGuaranteedKeys(items, keys, false);
  }
}

function initializeLocationsChecked() {
  locationsChecked = setLocations(() => false);
}

function initializeItemsForLocations() {
  itemsForLocations = setLocations(() => "");
}

function isValidForLocation(generalLocation, detailedLocation, isDungeon) {
  if (islands.includes(generalLocation) && dungeons.includes(generalLocation)) {
    var fullName = getFullLocationName(generalLocation, detailedLocation);
    return isDungeon == itemLocations[fullName].Types.includes('Dungeon');
  }
  return true;
}

function getFullLocationName(generalLocation, detailedLocation) {
  return generalLocation + ' - ' + detailedLocation;
}

function getSplitLocationName(fullName) {
  var split = fullName.indexOf(' - ');
  return {
    general: fullName.substring(0, split),
    detailed: fullName.substring(split + 3)
  };
}

function getChestCountsForLocation(generalLocation, isDungeon) {
  var curChecked = 0;
  var curProgress = 0;
  var curAvailable = 0;
  var curTotalProgress = 0;
  var curTotalDisplayed = 0;
  var curLocation = locationsChecked[generalLocation] || {};
  Object.keys(curLocation).forEach(function (detailedLocation) {
    if (isValidForLocation(generalLocation, detailedLocation, isDungeon)) {
      var hasProgress = locationsAreProgress[generalLocation][detailedLocation];
      if (hasProgress || showNonProgressLocations) {
        if (locationsChecked[generalLocation][detailedLocation]) {
          curChecked++;
        } else {
          curTotalDisplayed++;
          if (hasProgress) {
            curTotalProgress++;
          }
          if (locationsAreAvailable[generalLocation][detailedLocation]) {
            curAvailable++;
            if (hasProgress) {
              curProgress++;
            }
          }
        }
      }
    }
  });
  return {
    checked: curChecked, // number of locations that have been checked
    progress: curProgress, // number of available locations that can contain progesss
    available: curAvailable, // number of available locations
    total: curTotalDisplayed, // total locations remaining
    totalProgress: curTotalProgress, // total locations remaining that can contain progress
  };
}

function setLocations(valueCallback, itemSet) {
  result = {};
  Object.keys(itemLocations).forEach(function (locationName) {
    var splitName = getSplitLocationName(locationName);
    var generalLocation = splitName.general;
    var detailedLocation = splitName.detailed;
    if (!(generalLocation in result)) {
      result[generalLocation] = {};
    }
    var locationValue = valueCallback(locationName, itemSet);
    result[generalLocation][detailedLocation] = locationValue;
  });
  return result;
}

function checkRequirementMet(reqName, itemSet) {
  if (isProgressiveRequirement(reqName)) {
    return checkProgressiveItemRequirementRemaining(reqName, itemSet) <= 0;
  }
  if (reqName.startsWith('Can Access Other Location "')) {
    return checkOtherLocationReq(reqName, itemSet);
  }
  if (reqName.startsWith('Option "')) {
    return checkOptionEnabledRequirement(reqName);
  }
  if (reqName in itemSet) {
    return itemSet[reqName] > 0;
  }
  if (reqName in macros) {
    var macro = macros[reqName];
    var splitExpression = getSplitExpression(macro);
    return checkLogicalExpressionReq(splitExpression, itemSet);
  }
  if (reqName == 'Nothing') {
    return true;
  }
  if (reqName == 'Impossible') {
    return false;
  }
  throw Error("Unrecognized reqName: " + reqName);
}

function isProgressiveRequirement(reqName) {
  return reqName.startsWith('Progressive')
    || reqName.includes('Small Key x')
    || reqName.startsWith('Triforce Shard')
    || reqName.startsWith('Tingle Statue');
}

function checkProgressiveItemRequirementRemaining(reqName, itemSet) {
  var itemName = getProgressiveItemName(reqName);
  var numRequired = getProgressiveNumRequired(reqName);
  return numRequired - itemSet[itemName];
}

function getProgressiveItemName(reqName) {
  return reqName.substring(0, reqName.length - 3);
}

function getProgressiveNumRequired(reqName) {
  return parseInt(reqName.charAt(reqName.length - 1));
}

function getProgressiveRequirementName(itemName, numRequired) {
  return `${itemName} x${numRequired}`;
}

function checkOtherLocationReq(reqName, itemSet) {
  var otherLocation = reqName.substring('Can Access Other Location "'.length, reqName.length - 1);
  var requirements = getLocationRequirements(otherLocation);
  return checkLogicalExpressionReq(requirements, itemSet);
}

function checkHasAccessedOtherLocationReq(reqName) {
  var otherLocation = getOtherLocationName(reqName);
  var split = getSplitLocationName(otherLocation);
  return locationsChecked[split.general][split.detailed] || checkOtherLocationReq(reqName);
}

function checkOptionEnabledRequirement(reqName) {
  var positiveBooleanMatch = reqName.match(/^Option "([^"]+)" Enabled$/);
  var negativeBooleanMatch = reqName.match(/^Option "([^"]+)" Disabled$/);
  var positiveDropdownMatch = reqName.match(/^Option "([^"]+)" Is "([^"]+)"$/);
  var negativeDropdownMatch = reqName.match(/^Option "([^"]+)" Is Not "([^"]+)"$/);
  var positiveListMatch = reqName.match(/^Option "([^"]+)" Contains "([^"]+)"$/);
  var negativeListMatch = reqName.match(/^Option "([^"]+)" Does Not Contain "([^"]+)"$/);
  if (positiveBooleanMatch) {
    var optionName = positiveBooleanMatch[1];
    return options[optionName];
  }
  if (negativeBooleanMatch) {
    var optionName = negativeBooleanMatch[1];
    return !options[optionName];
  }
  if (positiveDropdownMatch) {
    var optionName = positiveDropdownMatch[1];
    var expectedValue = positiveDropdownMatch[2];
    return options[optionName] == expectedValue;
  }
  if (negativeDropdownMatch) {
    var optionName = negativeDropdownMatch[1];
    var expectedValue = negativeDropdownMatch[2];
    return options[optionName] != expectedValue;
  }
  if (positiveListMatch) {
    var optionName = positiveListMatch[1];
    var expectedValue = positiveListMatch[2];
    return options[optionName].includes(expectedValue);
  }
  if (negativeListMatch) {
    var optionName = negativeListMatch[1];
    var expectedValue = negativeListMatch[2];
    return !options[optionName].includes(expectedValue);
  }
}

function getSplitExpression(expression) {
  return expression.split(/\s*([(&\|)])\s*/g);
}

function checkLogicalExpressionReq(splitExpression, itemSet) {
  var expressionType = '';
  var subexpressionResults = [];
  while (splitExpression.length > 0) {
    var cur = splitExpression[0];
    splitExpression.shift();
    if (cur.length > 0) {
      if (cur == '|') {
        expressionType = 'OR';
      } else if (cur == '&') {
        expressionType = 'AND';
      } else if (cur == '(') {
        var result = checkLogicalExpressionReq(splitExpression, itemSet);
        subexpressionResults.push(result);
      } else if (cur == ')') {
        break;
      } else {
        result = checkRequirementMet(cur, itemSet);
        subexpressionResults.push(result);
      }
    }
  }
  if (expressionType == 'OR') {
    return subexpressionResults.some(element => element);
  }
  return subexpressionResults.every(element => element);
}

function isLocationAvailable(locationName, itemSet) {
  var requirements = getLocationRequirements(locationName);
  return checkLogicalExpressionReq(requirements, itemSet);
}

function isLocationProgress(locationName) {
  var types = itemLocations[locationName].Types.split(',').map(x => x.trim());
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    if (!options.randomize_charts
      && type == 'Sunken Treasure'
      && itemLocations[locationName]['Original item'].startsWith('Triforce Shard')) {
      return flags.includes('Sunken Triforce');
    } else if (!flags.includes(type)) {
      return false;
    }
  }
  return true;
}

function getLocationRequirements(locationName) {
  return getSplitExpression(itemLocations[locationName].Need);
}
