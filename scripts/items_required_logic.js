function itemsRequiredForOtherLocation(reqName) {
  var otherLocation = reqName.substring('Can Access Other Location "'.length, reqName.length - 1);
  var requirements = getLocationRequirements(otherLocation);
  return itemsRequiredForLogicalExpression(requirements);
}

function itemsForRequirement(reqName) {
  if (impossibleItems.includes(reqName) || reqName == 'Impossible') {
    var requiredItems = 'Impossible';
    var reqMet = false;
    var remainingProgress = NaN;
  } else if (isProgressiveRequirement(reqName)) {
    var progressCheck = checkProgressiveItemRequirementRemaining(reqName, items);
    var reqMet = progressCheck <= 0;
    var remainingProgress = Math.max(0, progressCheck);
    if (reqMet && checkProgressiveItemRequirementRemaining(reqName, startingItems) <= 0) {
      var requiredItems = 'None';
    } else {
      var requiredItems = reqName; // don't replace names yet. we do some logic with them and then replace them later
    }
  } else if (reqName.startsWith('Can Access Other Location "')) {
    return itemsRequiredForOtherLocation(reqName);
  } else if (reqName.startsWith('Has Accessed Other Location "')) {
    var otherLocation = reqName.substring('Has Accessed Other Location "'.length, reqName.length - 1);
    var reqMet = checkHasAccessedOtherLocationReq(reqName);
    var requiredItems = otherLocation;
    var remainingProgress = reqMet ? 0 : 1;
  } else if (reqName.startsWith('Option "')) {
    var reqMet = checkOptionEnabledRequirement(reqName);
    var requiredItems = reqMet ? 'None' : 'Impossible';
    var remainingProgress = reqMet ? 0 : NaN;
  } else if (reqName in items) {
    var reqMet = items[reqName] > 0;
    if (reqMet && startingItems[reqName] > 0) {
      var requiredItems = 'None';
    } else {
      var requiredItems = reqName;
    }
    var remainingProgress = reqMet ? 0 : 1;
  }
  else if (reqName in macros) {
    var macro = macros[reqName];
    var splitExpression = getSplitExpression(macro);
    return itemsRequiredForLogicalExpression(splitExpression);
  }
  else if (reqName == 'Nothing') {
    var requiredItems = 'None';
    var reqMet = true;
    var remainingProgress = 0;
  }
  else {
    throw Error("Unrecognized reqName: " + reqName);
  }
  return { items: requiredItems, eval: reqMet, countdown: remainingProgress };
}

function itemsRequiredForLogicalExpression(splitExpression) {
  var expressionType = '';
  var subexpressionResults = [];
  while (splitExpression.length > 0) {
    var cur = splitExpression[0].trim();
    splitExpression.shift();
    if (cur && cur.length > 0) {
      if (cur == '|') {
        expressionType = 'OR';
      } else if (cur == '&') {
        expressionType = 'AND';
      } else if (cur == '(') {
        var result = itemsRequiredForLogicalExpression(splitExpression);
        if (result) {
          subexpressionResults.push(result);
        }
      } else if (cur == ')') {
        break;
      } else {
        var result = itemsForRequirement(cur);
        if (result) {
          subexpressionResults.push(result);
        }
      }
    }
  }
  return getFlatSubexpression(subexpressionResults, expressionType);
}

function getFlatSubexpression(itemsReq, expressionType) {
  var expression = getSubexpression(itemsReq, expressionType);
  return flattenArrays(expression);
}

function getSubexpression(itemsReq, expressionType) {
  if (itemsReq.length > 1) {
    if (expressionType == 'OR') {
      var isExpressionTrue = itemsReq.some(item => item.eval);
    } else {
      var isExpressionTrue = itemsReq.every(item => item.eval);
    }

    if (isExpressionTrue) {
      var groupCountdown = 0;
    } else {
      var groupCountdown = itemsReq.reduce((acc, cur) => acc + cur.countdown, 0);
    }
    return { type: expressionType, items: itemsReq, eval: isExpressionTrue, countdown: groupCountdown };
  }
  if (itemsReq.length === 1) {
    var isExpressionTrue = itemsReq[0].eval;
    return { items: itemsReq[0], eval: isExpressionTrue, countdown: (isExpressionTrue ? 0 : 1) };
  }
  return { items: null };
}

function flattenArrays(expression) {
  var itemsReq = expression.items;
  if (!itemsReq) {
    return expression;
  }
  if (!Array.isArray(itemsReq)) {
    return itemsReq;
  }
  if (itemsReq.length === 1) {
    return itemsReq[0];
  }

  var newItems = [];
  for (var i = 0; i < itemsReq.length; i++) {
    var curItem = itemsReq[i];
    var subExpression = flattenArrays(curItem);
    if (subExpression) {
      if (!subExpression.type) {
        var fullExpr = { items: subExpression, eval: curItem.eval, countdown: curItem.countdown };
        newItems.push(fullExpr);
      } else if (subExpression.type == expression.type) {
        newItems.push.apply(newItems, subExpression.items);
      } else {
        newItems.push(subExpression);
      }
    }
  }
  return getSubexpression(newItems, expression.type);
}

function indexOfItem(expressionItems, item) {
  for (var i = 0; i < expressionItems.length; i++) {
    var curItem = expressionItems[i];
    if (curItem.items == item.items) {
      return i;
    }
  }
  return -1;
}

function removeDuplicateItems(expression) {
  if (!expression || (!expression.type)) {
    return expression;
  }
  var itemsReq = expression.items;
  var newItems = [];
  for (var i = 0; i < itemsReq.length; i++) {
    var curItem = itemsReq[i];
    if (curItem.type) {
      var subExpression = removeDuplicateItems(curItem);
      if (subExpression.items) {
        newItems.push(subExpression);
      }
    } else if (i == indexOfItem(itemsReq, curItem)) {
      newItems.push(curItem);
    }
  }
  return getFlatSubexpression(newItems, expression.type);
}

function removeChildren(expression) {
  if (!expression) {
    return null;
  }
  const impossible = [{ items: 'Impossible', eval: false, countdown: NaN }];
  const none = [{ items: 'None', eval: true, countdown: 0 }];
  if (expression.type == 'AND') {
    if (indexOfItem(expression.items, impossible[0]) > -1) {
      return getFlatSubexpression(impossible, 'AND'); // if there is an impossible item in the top level, the whole expression is impossible
    }
    return removeChildExpressions(expression, impossible, none);
  }
  return removeChildExpressions(expression, none, impossible);
}

// remove duplicates that are in lower levels, including progressive items that are obsolete by a higher or lower level item of the same type
function removeChildExpressions(expression, oppositeExprItems, sameExprItems) {
  if (!expression.type) {
    return expression;
  }
  var itemsReq = expression.items;
  var newItems = [];
  for (var i = 0; i < itemsReq.length; i++) {
    var curItem = itemsReq[i];
    var progressiveChildren = getProgressiveItemChildren(itemsReq, expression.type);
    if (indexOfItem(oppositeExprItems, curItem) > -1) { // when there is a parent with an opposite expression that contains the current item, we remove the whole child expression
      return null;
    } else if (indexOfItem(sameExprItems, curItem) == -1  // when there is a parent with the same expression that contains the current item, we just remove the current item
      && indexOfItem(progressiveChildren, curItem) == -1) { // we don't add any items that are subsumed by another progressive item in the same level
      if (curItem.type) {
        var newSameExprItems = sameExprItems.concat(itemsReq).concat(progressiveChildren);
        var subExpression = removeChildExpressions(curItem, newSameExprItems, oppositeExprItems);
        if (subExpression) { // if the subexpression is null, then that means we've explicitly removed it for containing an opposite expression item
          if (subExpression.items) {
            newItems.push(subExpression);
          } else if (expression.type == 'OR') { // if we have an OR expression with at least one subexpression where there are no items left, the OR expression is guaranteed to be true, so we remove it
            return { items: null };
          }
        }
      } else {
        newItems.push(curItem);
      }
    }
  }
  return getFlatSubexpression(newItems, expression.type);
}

// gets all the progressive item children that are subsumed by this list of items
function getProgressiveItemChildren(itemsReq, expressionType) {
  var newItems = [];
  for (var i = 0; i < itemsReq.length; i++) {
    var curItem = itemsReq[i];
    var curReq = curItem.items;
    if (!Array.isArray(curReq)) {
      addProgressiveChildrenForReq(newItems, curReq, expressionType);
    }
  }
  return newItems;
}

function addProgressiveChildrenForReq(newItems, curReq, expressionType) {
  if (curReq.startsWith('Progressive') || curReq.includes('Small Key x')) {
    var itemName = getProgressiveItemName(curReq);
    var reqCount = getProgressiveNumRequired(curReq);
    if (expressionType == 'OR') { // if the expression type is OR, we add higher level children
      for (var j = reqCount + 1; j <= 4; j++) {
        var newItemName = getProgressiveRequirementName(itemName, j);
        newItems.push({ items: newItemName });
      }
    } else { // if the expression type is AND, we add lower level children
      for (var j = reqCount - 1; j >= 1; j--) {
        var newItemName = getProgressiveRequirementName(itemName, j);
        newItems.push({ items: newItemName });
      }
    }
  }
}

// we want to remove any expression that subsumes another expression at the same level
// a subsuming expression is one that includes every item from another expression
function removeSubsumingExpressions(expression) {
  if (!expression || (!expression.type)) {
    return expression;
  }
  var itemsReq = expression.items;
  var newItems = [];
  for (var i = 0; i < itemsReq.length; i++) {
    var curItem = itemsReq[i];
    if (curItem.type) {
      if (!isSubsumingExpression(curItem, itemsReq, i)) {
        var subExpression = removeSubsumingExpressions(curItem);
        if (subExpression.items) {
          newItems.push(subExpression);
        }
      }
    } else {
      newItems.push(curItem);
    }
  }
  return getFlatSubexpression(newItems, expression.type);
}

function isSubsumingExpression(expression, itemsReq, index) {
  for (var i = 0; i < itemsReq.length; i++) {
    if (i != index) {
      var otherExpression = itemsReq[i];
      if (otherExpression.type && expressionSubsumes(expression, otherExpression, i < index)) {
        return true;
      }
    }
  }
  return false;
}

function expressionSubsumes(firstExpression, secondExpression, tiebreaker) {
  if (firstExpression.type != secondExpression.type) {
    return false;
  }
  if (firstExpression.items.length < secondExpression.items.length) {
    return false;
  }
  if (firstExpression.items.length == secondExpression.items.length && tiebreaker) {
    return false; // if two expressions are identical, we only want to keep the first one
  }
  for (var i = 0; i < secondExpression.items.length; i++) {
    var curItem = secondExpression.items[i];
    if (indexOfItem(firstExpression.items, curItem) == -1) {
      return false;
    }
  }
  return true;
}

function replaceItemNames(expression, isParentExprTrue) {
  if (!expression || !expression.items) {
    return;
  }
  if (!expression.type) {
    expression.items = getNameForItem(expression.items);
  } else {
    var itemsReq = expression.items;
    var isExprTrue = isParentExprTrue || expression.eval;
    for (var i = 0; i < itemsReq.length; i++) {
      var curItem = itemsReq[i];
      replaceItemNames(curItem, isExprTrue);
    }
    sortItems(itemsReq, isExprTrue);
  }
}

// we want to put expressions with missing items at the top
function sortItems(itemsReq, isExprTrue) {
  var indices = {}; // dictionary with the original order of the requirements
  for (var i = 0; i < itemsReq.length; i++) {
    var curItem = itemsReq[i];
    indices[curItem] = i;
  }
  itemsReq.sort(function (a, b) {
    var itemSort = 0;
    if (!a.eval && b.eval) {
      itemSort = -1;
    } else if (a.eval && !b.eval) {
      itemSort = 1;
    }
    if (itemSort != 0) {
      if (isExprTrue) {
        var exprSort = -1; // if the expression is true, we want to put items we have first
      } else {
        var exprSort = 1; // if the expression is false, we want to put items we're missing first
      }
      return exprSort * itemSort;
    }
    var aIndex = indices[a];
    var bIndex = indices[b];
    if (aIndex < bIndex) { // otherwise, we maintain the original order
      return -1;
    }
    if (aIndex > bIndex) {
      return 1;
    }
  });
}

function itemsRequiredForExpression(locationRequirements) {
  var itemsReq = itemsRequiredForLogicalExpression(locationRequirements);
  for (var i = 1; i <= 3; i++) { // repeat so we can catch new duplicates that appear as we simplify
    itemsReq = removeDuplicateItems(itemsReq);
    itemsReq = removeChildren(itemsReq);
    itemsReq = removeSubsumingExpressions(itemsReq);
  }
  replaceItemNames(itemsReq, false);
  return itemsReq;
}
