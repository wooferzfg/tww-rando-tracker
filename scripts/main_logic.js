var macros; // contents of macros.txt
var itemLocations; // contents of item_locations.txt
var macrosLoaded = false;
var itemLocationsLoaded = false;
var dataHasChanged = false;

$(document).ready(function () {
  loadMacros();
  loadItemLocations();
});

function loadMacros() {
  $.ajax(
    {
      url: getLogicFilesUrl() + 'macros.txt',
      success: function (data) {
        macros = jsyaml.load(data);
        macrosLoaded = true;
        afterLoad();
      },
      error: function () {
        showLoadingError();
      }
    }
  )
}

function loadItemLocations() {
  $.ajax(
    {
      url: getLogicFilesUrl() + 'item_locations.txt',
      success: function (data) {
        itemLocations = jsyaml.load(data);
        itemLocationsLoaded = true;
        afterLoad();
      },
      error: function () {
        showLoadingError();
      }
    }
  )
}

function getLogicFilesUrl() {
  return 'https://raw.githubusercontent.com/LagoLunatic/wwrando/' + versionParam + '/logic/';
}

function afterLoad() {
  if (macrosLoaded && itemLocationsLoaded) {
    updateLocations();
    initializeLocationsChecked();
    loadProgress();
    loadFlags();
    loadStartingItems();
    updateMacros();
    setLocationsAreProgress();
    dataChanged();
  }
}

// tracker should call this after changing 'items', 'keys', or 'locationsChecked'
function dataChanged() {
  setLocationsAreAvailable();
  refreshAllImagesAndCounts();
  refreshLocationColors();
  refreshEntranceColors();
  recreateTooltips();
  updateStatistics();
  saveProgress();
}

function loadStartingItems() {
  startingItems["Hero's Shield"] = 1;
  startingItems['Wind Waker'] = 1;
  startingItems["Boat's Sail"] = 1;
  startingItems["Wind's Requiem"] = 1;
  startingItems['Ballad of Gales'] = 1;
  startingItems['Song of Passing'] = 1;
  startingItems['Triforce Shard'] = options.num_starting_triforce_shards;

  var gearRemaining = options.starting_gear;
  for (var i = 0; i < regularItems.length; i++) {
    var itemName = regularItems[i];
    startingItems[itemName] = gearRemaining % 2;
    gearRemaining = Math.floor(gearRemaining / 2);
  }
  for (var i = 0; i < progressiveItems.length; i++) {
    var itemName = progressiveItems[i];
    startingItems[itemName] = gearRemaining % 4;
    gearRemaining = Math.floor(gearRemaining / 4);
  }

  if (options.sword_mode == 'Start with Sword') {
    startingItems['Progressive Sword'] += 1;
  } else if (options.sword_mode == 'Swordless') {
    impossibleItems.push('Progressive Sword x1');
    impossibleItems.push('Progressive Sword x2');
    impossibleItems.push('Progressive Sword x3');
    impossibleItems.push('Progressive Sword x4');
    impossibleItems.push('Hurricane Spin');
  }

  if (!loadingProgress) {
    Object.keys(startingItems).forEach(function (item) {
      items[item] = startingItems[item];
    });
  }
}

function isMainDungeon(dungeonName) {
  if (dungeonName == 'Forsaken Fortress' || dungeonName == "Ganon's Tower") {
    return false;
  }
  return dungeons.includes(dungeonName);
}

function getNameForItem(itemName) {
  if (isProgressiveRequirement(itemName)) {
    var item = getProgressiveItemName(itemName);
    var numRequired = getProgressiveNumRequired(itemName);
    if (item == 'Progressive Sword') {
      if (numRequired <= 1) {
        return "Hero's Sword";
      }
      if (numRequired == 2) {
        return 'Master Sword';
      }
      if (numRequired == 3) {
        return 'Master Sword (Half Power)';
      }
      if (numRequired == 4) {
        return 'Master Sword (Full Power)';
      }
    } else if (item == 'Progressive Bow') {
      if (numRequired <= 1) {
        return "Hero's Bow";
      }
      if (numRequired == 2) {
        return "Hero's Bow (Fire & Ice Arrows)";
      }
      if (numRequired == 3) {
        return "Hero's Bow (All Arrows)";
      }
    } else if (item == 'Progressive Picto Box') {
      if (numRequired <= 1) {
        return 'Picto Box';
      }
      if (numRequired == 2) {
        return 'Deluxe Picto Box';
      }
    } else if (item == 'Progressive Wallet') {
      if (numRequired <= 1) {
        return 'Wallet (1000 Rupees)';
      }
      if (numRequired == 2) {
        return 'Wallet (5000 Rupees)';
      }
    } else if (item == 'Progressive Quiver') {
      if (numRequired <= 1) {
        return 'Quiver (60 Arrows)'
      }
      if (numRequired == 2) {
        return 'Quiver (99 Arrows)';
      }
    } else if (item == 'Progressive Bomb Bag') {
      if (numRequired <= 1) {
        return 'Bomb Bag (60 Bombs)'
      }
      if (numRequired == 2) {
        return 'Bomb Bag (99 Bombs)';
      }
    } else if (item == 'Triforce Shard') {
      return 'Triforce of Courage';
    }
  } else if (itemName == "Boat's Sail") {
    return 'Swift Sail';
  } else if (options.randomize_charts && (itemName.startsWith('Triforce Chart') || itemName.startsWith('Treasure Chart'))) {
    var islandIndex = charts.indexOf(itemName);
    return 'Chart for ' + islands[islandIndex];
  }
  return itemName;
}

function incrementShield() {
  if (items["Hero's Shield"] == 0) {
    items["Hero's Shield"] = 1;
  } else if (items['Mirror Shield'] == 0) {
    items['Mirror Shield'] = 1;
  } else {
    items["Hero's Shield"] = 0;
    items['Mirror Shield'] = 0;
  }
}
