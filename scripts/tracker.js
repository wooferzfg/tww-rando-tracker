const imageDir = 'images/';
const arrow = " \u2192 ";
const totalDetailedLocations = 39;

var disableMap = false;
var currentGeneralLocation = '';
var currentLocationIsDungeon = false;
var currentExit = ''; // The full name of the exit; for example, 'Dragon Roost Cavern'
var currentEntryName = ''; // The name of the entry item; for example, 'Entered DRC'
var showNonProgressLocations = false;
var singleColorBackground = false;
var hideLocationLogic = false;

function toggleNonProgressLocations(button) {
  showNonProgressLocations = !showNonProgressLocations;
  if (showNonProgressLocations) {
    button.innerText = 'Hide Non-Progress Locations';
  } else {
    button.innerText = 'Show Non-Progress Locations';
  }

  if (document.getElementById('zoommap').style.display == 'block') {
    if (currentLocationIsDungeon) {
      toggleMap(dungeons.indexOf(currentGeneralLocation), true);
    } else {
      toggleMap(islands.indexOf(currentGeneralLocation), false);
    }
  }
  dataChanged();
}

function toggleSingleColorBackground(button) {
  singleColorBackground = !singleColorBackground;
  if (singleColorBackground) {
    $('.canUseSingleColor').addClass('single-color');
    button.innerText = 'Hide Single Color Background';
  } else {
    $('.canUseSingleColor').removeClass('single-color');
    button.innerText = 'Show Single Color Background';
  }
}

function toggleLocationLogic(button) {
  hideLocationLogic = !hideLocationLogic;
  if (hideLocationLogic) {
    button.innerText = 'Show Location Logic';
    $('.requireLocationLogic').addClass('hide');
  } else {
    button.innerText = 'Hide Location Logic';
    $('.requireLocationLogic').removeClass('hide');
  }
  dataChanged();
}

function refreshAllImagesAndCounts() {
  // bosses
  var bosses = [];
  bosses[0] = locationsChecked['Dragon Roost Cavern']['Gohma Heart Container'];
  bosses[1] = locationsChecked['Forbidden Woods']['Kalle Demos Heart Container'];
  bosses[2] = locationsChecked['Tower of the Gods']['Gohdan Heart Container'];
  bosses[3] = locationsChecked['Forsaken Fortress']['Helmaroc King Heart Container'];
  bosses[4] = locationsChecked['Earth Temple']['Jalhalla Heart Container'];
  bosses[5] = locationsChecked['Wind Temple']['Molgera Heart Container'];
  bosses[6] = locationsChecked["Ganon's Tower"]['Defeat Ganondorf'];

  for (var i = 0; i < bosses.length; i++) {
    var l = 'extralocation' + i.toString();
    if (bosses[i]) {
      setImage(l, 'boss' + i + '_d.png');
    } else {
      setImage(l, 'boss' + i + '.png');
    }
  }

  // triforce pieces
  var shardCount = items['Triforce Shard'];
  setImage('triforce', 'triforce' + shardCount + '.png');

  // items
  for (var i = 0; i <= 31; i++) {
    var l = 'item' + i.toString();
    var itemName = document.getElementById(l).name;
    var itemCount = items[itemName];

    if (itemCount === 0) {
      setImage(l, 'item' + i + '.png');
    } else if (itemCount === 1) {
      setImage(l, 'item' + i + '_a.png');
    } else {
      setImage(l, 'item' + i + '_' + itemCount + '_a.png');
    }
  }

  // sword mode
  if (options.sword_mode == 'Swordless') {
    var swordElement = document.getElementById('item21');
    swordElement.classList.add('hide');
    var hurricaneSpinElement = document.getElementById('item30');
    hurricaneSpinElement.classList.add('hide');
  }

  // shields
  var l = 'shield';
  if (items['Mirror Shield'] > 0) {
    setImage(l, 'mirrorshield.png');
  } else if (items["Hero's Shield"] > 0) {
    setImage(l, 'herosshield.png');
  } else {
    setImage(l, 'noshield.png');
  }

  // songs
  for (var i = 0; i < 6; i++) {
    var l = 'song' + i.toString();
    var songName = document.getElementById(l).name;

    if (items[songName] === 0) {
      setImage(l, 'song' + i + '.png');
    } else {
      setImage(l, 'song' + i + '_a.png');
    }
  }

  // pearls
  for (var i = 0; i < 3; i++) {
    var l = 'pearl' + i.toString();
    var pearlName = document.getElementById(l).name;

    if (items[pearlName] === 0) {
      setImage(l, 'pearl' + i + '.png');
    } else {
      setImage(l, 'pearl' + i + '_a.png');
    }
  }

  for (var i = 0; i < dungeons.length; i++) {
    if (isMainDungeon(dungeons[i])) {
      // small keys
      var l = 'smallkey' + i.toString();
      var smallKeyName = document.getElementById(l).innerText;
      var smallKeyCount = keys[smallKeyName];
      if (smallKeyCount === 0) {
        setBackgroundUrl(l, 'smallkey.png');
      } else {
        setBackgroundUrl(l, 'smallkey_' + smallKeyCount + '.png');
      }

      // dungeon entry
      var l = 'entry' + i.toString();
      if (isRandomEntrances()) {
        var entryName = getDungeonEntryName(i);
        if (items[entryName] === 0) {
          setBackgroundUrl(l, 'dungeon_noentry.png');
        } else {
          setBackgroundUrl(l, 'dungeon_entered.png');
        }
      } else {
        document.getElementById(l).style.display = 'none';
      }

      // boss keys
      var l = 'bosskey' + i.toString();
      var bigKeyName = document.getElementById(l).innerText;
      var bigKeyCount = keys[bigKeyName];
      if (bigKeyCount === 0) {
        setBackgroundUrl(l, 'bosskey.png');
      } else {
        setBackgroundUrl(l, 'bosskey_a.png');
      }
    }
  }

  // charts
  for (var i = 0; i < charts.length; i++) {
    var l = 'chart' + i.toString();
    var chartName = charts[i];
    var chartCount = items[chartName];
    if (!options.randomize_charts && chartName.includes('Triforce')) {
      if (chartCount === 1) {
        setBackgroundUrl(l, 'triforcechartopen.png');
      } else {
        setBackgroundUrl(l, 'triforcechart.png');
      }
    }
    else {
      if (chartCount === 1) {
        setBackgroundUrl(l, 'chartopen.png');
      } else {
        setBackgroundUrl(l, 'chart.png');
      }
    }
  }

  // cave entry
  for (var i = 0; i < caves.length; i++) {
    var l = 'caveentry' + i.toString();
    if (isRandomCaves()) {
      var entryName = getCaveEntryName(i);
      if (items[entryName] === 0) {
        setBackgroundUrl(l, 'cave_noentry.png');
      } else {
        setBackgroundUrl(l, 'cave_entered.png');
      }
    } else {
      document.getElementById(l).style.display = 'none';
    }
  }

  // locations
  for (var i = 0; i < islands.length; i++) {
    var l = 'mapchests' + i.toString();
    var chests = getChestCountsForLocation(islands[i], false);
    setChestsForElement(document.getElementById(l), chests.progress, chests.available, chests.total);
  }
  for (var i = 0; i < dungeons.length; i++) {
    var l = 'dungeonchests' + i.toString();
    var chests = getChestCountsForLocation(dungeons[i], true);
    setChestsForElement(document.getElementById(l), chests.progress, chests.available, chests.total);
  }

  // entrances
  if (isRandomEntrances() || isRandomCaves()) {
    document.getElementById('view-entrances-button').removeAttribute('disabled');
  }
}

function setImage(id, path) {
  document.getElementById(id).src = imageDir + path;
}

function setBackgroundUrl(id, path) {
  document.getElementById(id).style.backgroundImage = 'url(\'' + imageDir + path + '\')';
}

function setChestsForElement(element, progress, available, total) {
  if (hideLocationLogic) {
    element.innerHTML = total;
  } else {
    element.innerHTML = available + '/' + total;
  }
  if (total === 0) {
    setElementColor(element, 'black-text');
  } else {
    if (available === 0) {
      setElementColor(element, 'red-text');
    } else {
      if (progress === 0) {
        setElementColor(element, 'yellow-text');
      } else {
        setElementColor(element, 'blue-text');
      }
    }
  }
}

function setElementColor(element, color) {
  element.classList.remove('black-text');
  element.classList.remove('black-text-strikethrough');
  element.classList.remove('red-text');
  element.classList.remove('yellow-text');
  element.classList.remove('blue-text');
  element.classList.add(color);
}

function clearItemInfo() {
  document.getElementById('item-info').innerText = '';
}

function itemInfo(element) {
  var text = element.name;
  if (text.startsWith('Progressive')) {
    var itemCount = items[text];
    var textWithCount = text + ' x' + itemCount;
    text = getNameForItem(textWithCount);
  } else if (text == "Hero's Shield") {
    if (items['Mirror Shield'] == 1) {
      text = 'Mirror Shield';
    }
  } else if (text == 'Triforce Shard') {
    var shardCount = items['Triforce Shard'];
    if (shardCount == 8) {
      text = 'Triforce of Courage';
    } else {
      text = 'Triforce Shard (' + shardCount + '/8)';
    }
  } else if (text == 'Empty Bottle') {
    var itemCount = items[text];
    text = 'Empty Bottle (' + itemCount + '/4)';
  } else if (text == 'Tingle Statue') {
    var itemCount = items[text];
    text = 'Tingle Statue (' + itemCount + '/5)';
  } else {
    text = getNameForItem(text);
  }
  document.getElementById('item-info').innerText = text;
}

function toggleInventoryItem(element, maxItems) {
  var itemName = element.name;
  toggleItem(itemName, maxItems);
  itemInfo(element);
}

function toggleShield(element) {
  incrementShield();
  dataChanged();
  itemInfo(element);
}

function toggleItem(itemName, maxItems) {
  var curCount = items[itemName];
  curCount++;
  if (curCount > maxItems) {
    curCount = 0;
  }
  items[itemName] = curCount;
  dataChanged();
}

function toggleKey(element, maxKeys, dungeonIndex) {
  disableMap = true;
  var keyName = element.innerText;
  var keyCount = keys[keyName];
  keyCount++;
  if (keyCount > maxKeys) {
    keyCount = 0;
  }
  keys[keyName] = keyCount;
  dataChanged();
  if (keyName.includes('Small')) {
    smallKeyInfo(element, maxKeys);
  }
  dungeonMapInfo(dungeonIndex);
}

function shrinkMap() {
  removeVisibleTooltips();
  document.getElementById('chartmap').style.display = 'block';
  document.getElementById('zoommap').style.display = 'none';
  currentGeneralLocation = '';
  currentExit = '';
  currentEntryName = '';
  recreateTooltips();
}

function getHtmlForItem(itemExpr, isParentExprTrue) {
  var element = document.createElement('span');
  element.innerText = itemExpr.items;
  if (itemExpr.eval) {
    setElementColor(element, 'blue-text');
  } else if (isParentExprTrue) {
    setElementColor(element, 'gray-text');
  } else {
    setElementColor(element, 'red-text');
  }
  return element.outerHTML;
}

function getTextForExpression(expression, isParentExprTrue) {
  var itemsReq = expression.items;
  if (!Array.isArray(itemsReq)) {
    return getHtmlForItem(expression, isParentExprTrue);
  }

  if (expression.type == 'OR') {
    var separator = ' or ';
  } else {
    var separator = ' and ';
  }

  var result = '';
  for (var i = 0; i < itemsReq.length; i++) {
    var curItem = itemsReq[i];
    var subResult = getTextForExpression(curItem, isParentExprTrue || expression.eval);
    if (curItem.type) {
      subResult = '(' + subResult + ')';
    }
    result += subResult;
    if (i < itemsReq.length - 1) {
      result += separator;
    }
  }
  return result;
}

function setTooltipTextForLocation(locationRequirements) {
  var itemsRequiredExpr = itemsRequiredForExpression(locationRequirements);
  if (!itemsRequiredExpr || !itemsRequiredExpr.items || itemsRequiredExpr.items == 'None') {
    var element = document.createElement('span');
    element.innerText = 'None';
    setElementColor(element, 'gray-text');
    $('.tool-tip-text').html(element.outerHTML);
    return;
  }
  if (itemsRequiredExpr.items == 'Impossible') {
    var element = document.createElement('span');
    element.innerText = 'Impossible';
    setElementColor(element, 'red-text');
    $('.tool-tip-text').html(element.outerHTML);
    return;
  }

  if (itemsRequiredExpr.type == 'AND') {
    var itemsRequired = itemsRequiredExpr.items;
  } else {
    var itemsRequired = [itemsRequiredExpr];
  }
  var list = document.createElement('ul');
  for (var i = 0; i < itemsRequired.length; i++) {
    var listItem = document.createElement('li');
    var curItem = itemsRequired[i];
    listItem.innerHTML = getTextForExpression(curItem, curItem.eval);
    list.appendChild(listItem);
  }
  $('.tool-tip-text').html(list.outerHTML);
}

function addTooltipToLocationElement(element) {
  var detailedLocation = element.innerText;
  if (!locationsChecked[currentGeneralLocation][detailedLocation]) {
    var fullLocationName = getFullLocationName(currentGeneralLocation, detailedLocation);
    var locationRequirements = getLocationRequirements(fullLocationName);
    setTooltipTextForLocation(locationRequirements);
    createTooltip(element, $('.tool-tip-text').clone(), 'Items Required');
  }
}

function addTooltipToEntranceElement(element) {
  var entranceName = element.innerText;
  var macroName = getMacroForEntranceName(entranceName);
  var exitName = getExitForEntrance(entranceName);
  if (exitName) {
    createTooltip(element, exitName, 'Entrance Leads To');
  } else if (!hideLocationLogic) {
    var requirements = getSplitExpression(macroName);
    setTooltipTextForLocation(requirements);
    createTooltip(element, $('.tool-tip-text').clone(), 'Items Required');
  }
}

function addSongTooltip(element) {
  var id = '#' + element.id + '-notes';
  var songName = element.name;
  createTooltip(element, $(id).clone(), songName);
}

function createTooltip(element, text, title) {
  $(element).qtip({
    content: {
      text: text,
      title: title
    },
    position: {
      target: 'mouse',
      adjust: {
        x: 15
      }
    }
  });
}

function removeTooltipFromElement(element) {
  $(element).qtip('destroy', true);
}

function recreateTooltips() {
  if (document.getElementById('zoommap').style.display == 'block') {
    removeVisibleTooltips();
    for (var i = 0; i < totalDetailedLocations; i++) {
      var element = getDetailedLocationElement(i);
      removeTooltipFromElement(element);
      if (element.parentElement.style.display == 'table-cell') {
        if (currentGeneralLocation.length > 0) {
          if (!hideLocationLogic) {
            addTooltipToLocationElement(element);
          }
        } else if (currentExit.length > 0) {
          addTooltipToEntranceElement(element);
        }
      }
    }
  }

  for (var i = 0; i < 6; i++) {
    var l = 'song' + i.toString();
    var element = document.getElementById(l);
    var songName = element.name;

    if (items[songName] === 0) {
      removeTooltipFromElement(element);
    } else {
      addSongTooltip(element)
    }
  }
}

function removeVisibleTooltips() {
  $('.qtip').each(function () {
    var element = $(this);
    if (element.data('qtip')) {
      element.qtip('destroy', true);
      element.removeData('hasqtip');
      element.removeAttr('data-hasqtip');
    }
  });
}

function toggleMap(index, isDungeon) {
  if (disableMap) {
    disableMap = false;
    return;
  }

  currentExit = '';
  currentEntryName = '';
  openZoomMap();
  setHeaderTexts("X Close", "", true);

  if (isDungeon) {
    currentGeneralLocation = dungeons[index];
    currentLocationIsDungeon = true;
    setBackgroundUrl('zoommap-background', 'dungeon_mapfull' + index + '.png');
  } else {
    currentGeneralLocation = islands[index];
    currentLocationIsDungeon = false;
    setBackgroundUrl('zoommap-background', 'mapfull' + index + '.png');
  }

  if (options.race_mode && isDungeon && dungeons[index] != "Ganon's Tower") {
    setFullClearStyle('table-cell');
  } else {
    setFullClearStyle('none');
  }

  var detailedLocations = getDetailedLocations(currentGeneralLocation, isDungeon);
  setLocationsList(detailedLocations, true);

  refreshLocationColors();
  recreateTooltips();
}

function viewEntrances(choosingEntrance, isCaveExit) {
  currentGeneralLocation = '';
  if (!choosingEntrance) {
    currentExit = 'ViewEntrances';
    currentEntryName = '';
  }

  openZoomMap();

  if (choosingEntrance) {
    setHeaderTexts('Choose Entrance', 'X Cancel', false);
  } else {
    setHeaderTexts('Randomized Entrances', 'X Close', false);
  }

  setBackgroundUrl('zoommap-background', 'mapempty.png');
  setFullClearStyle('none');

  var showAllEntrances = !choosingEntrance || isRandomTogether();
  var entrancesList = getRandomEntrancesToShow(isCaveExit, showAllEntrances);
  setLocationsList(entrancesList, choosingEntrance);

  refreshEntranceColors();
  recreateTooltips();
}

function openZoomMap() {
  document.getElementById('chartmap').style.display = 'none';
  document.getElementById('zoommap').style.display = 'block';
}

function setHeaderTexts(firstText, secondText, firstPointer) {
  var firstHeader = document.getElementById('first-header');
  var secondHeader = document.getElementById('second-header');

  firstHeader.innerText = firstText;
  if (firstPointer) {
    firstHeader.style.cursor = 'pointer';
    firstHeader.style.pointerEvents = 'auto';
  } else {
    firstHeader.style.cursor = 'default';
    firstHeader.style.pointerEvents = 'none';
  }

  if (secondText) {
    secondHeader.innerText = secondText;
    secondHeader.parentElement.style.display = 'block';
  } else {
    secondHeader.parentElement.style.display = 'none';
  }
}

function setFullClearStyle(styleText) {
  var fullClear = document.getElementById('full-clear').parentElement;
  fullClear.style.display = styleText;
}

function setLocationsList(locationsList, isInteractive) {
  var needToExpandLocations = false;
  var fontSize = 'normal';
  if (locationsList.length > totalDetailedLocations * 2 / 3) { // 3 columns
    fontSize = 'smallest';
  } else if (locationsList.length > totalDetailedLocations / 3) { // 2 columns
    fontSize = 'small';
  } else {
    needToExpandLocations = true;
  }

  for (var i = 0; i < totalDetailedLocations; i++) {
    var element = getDetailedLocationElement(i);
    if (i < locationsList.length) {
      element.parentElement.style.display = 'table-cell';
      element.parentElement.colSpan = 1;
      element.innerText = locationsList[i];
      element.classList.remove('detail-small');
      element.classList.remove('detail-smallest');
      element.classList.remove('detail-not-interactive');
      if (fontSize == 'small') {
        element.classList.add('detail-small');
      } else if (fontSize == 'smallest') {
        element.classList.add('detail-smallest');
      }
      if (!isInteractive) {
        element.classList.add('detail-not-interactive');
      }
    } else {
      element.parentElement.style.display = 'none';
    }
  }

  if (needToExpandLocations) {
    expandLocationsIfNecessary();
  }
}

function getDetailedLocationElement(i) {
  var l = 'detaillocation' + i.toString();
  return document.getElementById(l);
}

function expandLocationsIfNecessary() {
  var fullClear = document.getElementById('full-clear').parentElement;
  var secondHeader = document.getElementById('second-header').parentElement;
  if (fullClear.style.display == 'table-cell' || secondHeader.style.display == 'table-cell') {
    for (var i = 0; i < totalDetailedLocations / 3; i++) {
      var element = getDetailedLocationElement(i);
      element.parentElement.colSpan = 2;
    }
  }
}

function refreshLocationColors() {
  if (currentGeneralLocation.length === 0) {
    return;
  }

  for (var i = 0; i < totalDetailedLocations; i++) {
    var element = getDetailedLocationElement(i);
    if (element.parentElement.style.display == 'table-cell') {
      var detailedLocation = element.innerText;
      if (locationsChecked[currentGeneralLocation][detailedLocation]) {
        setElementColor(element, 'black-text-strikethrough');
      } else {
        if (locationsAreAvailable[currentGeneralLocation][detailedLocation]) {
          if (locationsAreProgress[currentGeneralLocation][detailedLocation]) {
            setElementColor(element, 'blue-text');
          } else {
            setElementColor(element, 'yellow-text');
          }
        } else {
          setElementColor(element, 'red-text');
        }
      }
    }
  }
}

function refreshEntranceColors() {
  if (currentExit.length === 0) {
    return;
  }

  for (var i = 0; i < totalDetailedLocations; i++) {
    var element = getDetailedLocationElement(i);
    if (element.parentElement.style.display == 'table-cell') {
      var entranceName = element.innerText;
      var exitName = getExitForEntrance(entranceName);
      if (exitName) {
        setElementColor(element, 'black-text-strikethrough');
      } else {
        var macroName = getMacroForEntranceName(entranceName);
        var requirements = getSplitExpression(macroName);
        if (hideLocationLogic || checkLogicalExpressionReq(requirements)) {
          setElementColor(element, 'blue-text');
        } else {
          setElementColor(element, 'red-text');
        }
      }
    }
  }
}

function toggleLocation(element) {
  if (currentGeneralLocation.length > 0) {
    var detailedLocation = element.innerText;
    var newLocationChecked = !locationsChecked[currentGeneralLocation][detailedLocation];
    locationsChecked[currentGeneralLocation][detailedLocation] = newLocationChecked;
  } else if (currentEntryName.length > 0) {
    var entranceName = element.innerText;
    if (!getExitForEntrance(entranceName)) {
      items[currentEntryName] = 1;
      entrances[currentExit] = entranceName;
      shrinkMap();
    }
  }
  dataChanged();
}

function clearMapInfo() {
  document.getElementById('map-info').innerText = '';
  document.getElementById('chest-counts').style.visibility = 'hidden';
}

function mapInfo(index) {
  var generalLocation = islands[index];
  var chests = getChestCountsForLocation(generalLocation, false);
  setMapInfoText(generalLocation, chests.available, chests.total);
}

function dungeonMapInfo(index) {
  var generalLocation = dungeons[index];
  var chests = getChestCountsForLocation(dungeons[index], true);
  setMapInfoText(generalLocation, chests.available, chests.total);
}

function setMapInfoText(generalLocation, curAvailable, curTotal) {
  document.getElementById('map-info').innerText = generalLocation;
  document.getElementById('chest-counts').style.visibility = 'visible';
  document.getElementById('chests-total').innerText = curTotal;
  var chestsAvailContainer = document.getElementById('chests-avail-container');
  if (hideLocationLogic) {
    chestsAvailContainer.style.display = 'none';
  } else {
    chestsAvailContainer.style.display = 'inline';
    document.getElementById('chests-avail').innerText = curAvailable;
  }
}

function clearMapItemInfo() {
  document.getElementById('map-item-info').innerText = '';
}

function mapItemInfo(element) {
  document.getElementById('map-item-info').innerText = element.innerText;
}

function smallKeyInfo(element, maxKeys) {
  var keyName = element.innerText;
  var numKeys = keys[keyName];
  document.getElementById('map-item-info').innerText = keyName + ' (' + numKeys + '/' + maxKeys + ')';
}

function toggleChart(index) {
  disableMap = true;
  var chartName = charts[index];
  toggleItem(chartName, 1);
  chartInfo(index);
  mapInfo(index);
}

function chartInfo(index) {
  var chartName = getNameForItem(charts[index]);
  document.getElementById('map-item-info').innerText = chartName;
}

function toggleDungeonEntry(index) {
  disableMap = true;
  var entryName = getDungeonEntryName(index);
  var exitName = dungeons[index];
  if (items[entryName] === 0) {
    currentExit = exitName;
    currentEntryName = entryName;
    viewEntrances(true, false);
  } else {
    items[entryName] = 0;
    entrances[exitName] = null;
    dungeonEntryInfo(index);
    dungeonMapInfo(index);
    dataChanged();
  }
}

function dungeonEntryInfo(index) {
  var entryName = getDungeonEntryName(index);
  if (items[entryName] > 0) {
    var dungeonName = dungeons[index];
    var text = entrances[dungeonName] + arrow + shortDungeonNames[index];
  } else {
    var text = entryName;
  }
  document.getElementById('map-item-info').innerText = text;
}

function toggleCaveEntry(caveIndex, islandIndex) {
  disableMap = true;
  var entryName = getCaveEntryName(caveIndex);
  var exitName = getCaveName(caveIndex);
  if (items[entryName] === 0) {
    currentExit = exitName;
    currentEntryName = entryName;
    viewEntrances(true, true);
  } else {
    items[entryName] = 0;
    entrances[exitName] = null;
    caveEntryInfo(caveIndex);
    mapInfo(islandIndex);
    dataChanged();
  }
}

function caveEntryInfo(index) {
  var entryName = getCaveEntryName(index);
  if (items[entryName] > 0) {
    var caveName = getCaveName(index);
    var text = entrances[caveName] + arrow + caveName;
  } else {
    var text = entryName;
  }
  document.getElementById('map-item-info').innerText = text;
}

function fullClear() {
  var detailedLocations = getDetailedLocations(currentGeneralLocation, true);
  for (var i = 0; i < detailedLocations.length; i++) {
    var detailedLocation = detailedLocations[i];
    locationsChecked[currentGeneralLocation][detailedLocation] = true;
  }
  clearRaceModeBannedLocations();
  dataChanged();
}
