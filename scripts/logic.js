var macros; // contents of macros.txt
var itemLocations; // contents of item_locations.txt
var macrosLoaded = false;
var itemLocationsLoaded = false;

const drcMacro = "Can Access Dragon Roost Cavern";
const fwMacro = "Can Access Forbidden Woods";
const totgMacro = "Can Access Tower of the Gods";
const etMacro = "Can Access Earth Temple";
const wtMacro = "Can Access Wind Temple";

var generalLocations = [
    'Forsaken Fortress',
    'Star Island',
    'Northern Fairy Island',
    'Gale Isle',
    'Crescent Moon Island',
    'Seven-Star Isles',
    'Overlook Island',
    'Four-Eye Reef',
    'Mother and Child Isles',
    'Spectacle Island',
    'Windfall Island',
    'Pawprint Isle',
    'Dragon Roost Island',
    'Flight Control Platform',
    'Western Fairy Island',
    'Rock Spire Isle',
    'Tingle Island',
    'Northern Triangle Island',
    'Eastern Fairy Island',
    'Fire Mountain',
    'Star Belt Archipelago',
    'Three-Eye Reef',
    'Greatfish Isle',
    'Cyclops Reef',
    'Six-Eye Reef',
    'Tower of the Gods',
    'Eastern Triangle Island',
    'Thorned Fairy Island',
    'Needle Rock Isle',
    'Islet of Steel',
    'Stone Watcher Island',
    'Southern Triangle Island',
    'Private Oasis',
    'Bomb Island',
    'Bird\'s Peak Rock',
    'Diamond Steppe Island',
    'Five-Eye Reef',
    'Shark Island',
    'Southern Fairy Island',
    'Ice Ring Isle',
    'Forest Haven',
    'Cliff Plateau Isles',
    'Horseshoe Island',
    'Outset Island',
    'Headstone Island',
    'Two-Eye Reef',
    'Angular Isles',
    'Boating Course',
    'Five-Star Isles',

    'Dragon Roost Cavern',
    'Forbidden Woods',
    'Tower of the Gods',
    'Forsaken Fortress',
    'Earth Temple',
    'Wind Temple',
    'Mailbox',
    'The Great Sea',
    'Ganon\'s Tower'];

var items = {
    "Tingle Tuner": 0,
    "Wind Waker": 0,
    "Spoils Bag": 0,
    "Grappling Hook": 0,
    "Power Bracelets": 0,
    "Iron Boots": 0,
    "Bait Bag": 0,
    "Boomerang": 0,
    "Hookshot": 0,
    "Delivery Bag": 0,
    "Bombs": 0,
    "Skull Hammer": 0,
    "Deku Leaf": 0,
    "Hero's Shield": 0,
    "Mirror Shield": 0,

    "Triforce Shard 1": 0,
    "Triforce Shard 2": 0,
    "Triforce Shard 3": 0,
    "Triforce Shard 4": 0,
    "Triforce Shard 5": 0,
    "Triforce Shard 6": 0,
    "Triforce Shard 7": 0,
    "Triforce Shard 8": 0,

    "Nayru's Pearl": 0,
    "Din's Pearl": 0,
    "Farore's Pearl": 0,

    "Wind's Requiem": 0,
    "Ballad of Gales": 0,
    "Command Melody": 0,
    "Earth God's Lyric": 0,
    "Wind God's Aria": 0,
    "Song of Passing": 0,

    "Boat's Sail": 0,

    "Note to Mom": 0,
    "Maggie's Letter": 0,
    "Moblin's Letter": 0,
    "Cabana Deed": 0,

    "Magic Meter Upgrade": 0,

    "Ghost Ship Chart": 0,

    "Progressive Sword": 0,
    "Progressive Bow": 0,
    "Progressive Wallet": 0,
    "Progressive Picto Box": 0,
    "Empty Bottle": 0,

    "DRC Big Key": 0,
    "DRC Small Key": 0,
    "FW Big Key": 0,
    "FW Small Key": 0,
    "TotG Big Key": 0,
    "TotG Small Key": 0,
    "FF Big Key": 0,
    "FF Small Key": 0,
    "ET Big Key": 0,
    "ET Small Key": 0,
    "WT Big Key": 0,
    "WT Small Key": 0,

    "Treasure Chart 1": 0,
    "Treasure Chart 2": 0,
    "Treasure Chart 3": 0,
    "Treasure Chart 4": 0,
    "Treasure Chart 5": 0,
    "Treasure Chart 6": 0,
    "Treasure Chart 7": 0,
    "Treasure Chart 8": 0,
    "Treasure Chart 9": 0,
    "Treasure Chart 10": 0,
    "Treasure Chart 11": 0,
    "Treasure Chart 12": 0,
    "Treasure Chart 13": 0,
    "Treasure Chart 14": 0,
    "Treasure Chart 15": 0,
    "Treasure Chart 16": 0,
    "Treasure Chart 17": 0,
    "Treasure Chart 18": 0,
    "Treasure Chart 19": 0,
    "Treasure Chart 20": 0,
    "Treasure Chart 21": 0,
    "Treasure Chart 22": 0,
    "Treasure Chart 23": 0,
    "Treasure Chart 24": 0,
    "Treasure Chart 25": 0,
    "Treasure Chart 26": 0,
    "Treasure Chart 27": 0,
    "Treasure Chart 28": 0,
    "Treasure Chart 29": 0,
    "Treasure Chart 30": 0,
    "Treasure Chart 31": 0,
    "Treasure Chart 32": 0,
    "Treasure Chart 33": 0,
    "Treasure Chart 34": 0,
    "Treasure Chart 35": 0,
    "Treasure Chart 36": 0,
    "Treasure Chart 37": 0,
    "Treasure Chart 38": 0,
    "Treasure Chart 39": 0,
    "Treasure Chart 40": 0,
    "Treasure Chart 41": 0,

    "Triforce Chart 1": 0,
    "Triforce Chart 2": 0,
    "Triforce Chart 3": 0,
    "Triforce Chart 4": 0,
    "Triforce Chart 5": 0,
    "Triforce Chart 6": 0,
    "Triforce Chart 7": 0,
    "Triforce Chart 8": 0,

    "Telescope": 0,
    "Magic Armor": 0
};
var locationsChecked = {};

var locationsAreProgress = {};
var locationsAreAvailable = {};
var availableChests = {};
var totalChests = {};

function loadMacros() {
    $.ajax(
        {
            url: './rando_files/macros.txt',
            success: function (data) {
                macros = jsyaml.load(data);
                macrosLoaded = true;
                afterLoad();
            }
        }
    )
}

function loadItemLocations() {
    $.ajax(
        {
            url: './rando_files/item_locations.txt',
            success: function (data) {
                itemLocations = jsyaml.load(data);
                itemLocationsLoaded = true;
                afterLoad();
            }
        }
    )
}

function afterLoad() {
    if (macrosLoaded && itemLocationsLoaded) {
        loadFlagsAndStartingItems();
        setLocationsAreProgress();
        initializeLocationsChecked();
        initializeRandomDungeonEntrances();
        loadProgress();
        setLocationsAreAvailable();
        setChestCounts();
        refreshAllImagesAndCounts();
    }
}

function itemsChanged() {
    setLocationsAreAvailable();
    setChestCounts();
    refreshAllImagesAndCounts();
    refreshLocationColors();
}

function locationsChanged() {
    setChestCounts();
    refreshAllImagesAndCounts();
    refreshLocationColors();
}

function getDetailedLocations(generalLocation) {
    var result = [];
    var allDetailedLocations = locationsAreProgress[generalLocation];
    Object.keys(allDetailedLocations).forEach(function (detailedLocation) {
        if (locationsAreProgress[generalLocation][detailedLocation]) {
            result.push(detailedLocation);
        }
    })
    return result;
}

function setLocationsAreProgress() {
    locationsAreProgress = setLocations(isLocationProgress);
}

function setLocationsAreAvailable() {
    locationsAreAvailable = setLocations(isLocationAvailable);
}

function initializeLocationsChecked() {
    locationsChecked = setLocations(() => false);
}

function initializeRandomDungeonEntrances() {
    if (isRandomEntrances) { // we rely on the tracker to change these macros later
        macros[drcMacro] = "Impossible";
        macros[fwMacro] = "Impossible";
        macros[totgMacro] = "Impossible";
        macros[etMacro] = "Impossible";
        macros[wtMacro] = "Impossible";
    }
}

function setChestCounts() {
    for (var i = 0; i < generalLocations.length; i++) {
        var generalLocation = generalLocations[i];
        var curAvailable = 0;
        var curTotal = 0;
        var curLocation = locationsChecked[generalLocation];
        Object.keys(curLocation).forEach(function (detailedLocation) {
            if ((!curLocation[detailedLocation])
                && locationsAreProgress[generalLocation][detailedLocation]) {
                curTotal++;
                if (locationsAreAvailable[generalLocation][detailedLocation]) {
                    curAvailable++;
                }
            }
        });
        availableChests[generalLocation] = curAvailable;
        totalChests[generalLocation] = curTotal;
    }
}

function setLocations(valueCallback) {
    result = {};
    Object.keys(itemLocations).forEach(function (locationName) {
        var split = locationName.indexOf(' - ');
        var generalLocation = locationName.substring(0, split);
        var detailedLocation = locationName.substring(split + 3);
        if (!(generalLocation in result)) {
            result[generalLocation] = {};
        }
        var locationValue = valueCallback(locationName);
        result[generalLocation][detailedLocation] = locationValue;
    });
    return result;
}

function checkRequirementMet(reqName) {
    if (reqName.startsWith('Progressive')) {
        return checkNumberReq(reqName);
    }
    if (reqName.includes('Small Key x')) {
        return checkNumberReq(reqName);
    }
    if (reqName.startsWith('Can Access Other Location "')) {
        return checkOtherLocationReq(reqName);
    }
    if (reqName in items) {
        return items[reqName] > 0;
    }
    if (reqName in macros) {
        var macro = macros[reqName];
        var splitExpression = getSplitExpression(macro);
        return checkLogicalExpressionReq(splitExpression);
    }
    if (reqName == "Nothing") {
        return true;
    }
    if (reqName == "Impossible") {
        return false;
    }
}

function checkNumberReq(reqName) {
    var itemName = reqName.substring(0, reqName.length - 3);
    var numRequired = parseInt(reqName.charAt(reqName.length - 1));
    return items[itemName] >= numRequired;
}

function checkOtherLocationReq(reqName) {
    var otherLocation = reqName.substring('Can Access Other Location "'.length, reqName.length - 1);
    var splitExpression = getSplitExpression(itemLocations[otherLocation].Need)
    return checkLogicalExpressionReq(splitExpression);
}

function getSplitExpression(expression) {
    return expression.split(/([(&\|)])/g);
}

function checkLogicalExpressionReq(splitExpression) {
    var expressionType = "";
    var subexpressionResults = [];
    while (splitExpression.length > 0) {
        var cur = splitExpression[0].trim();
        splitExpression.shift();
        if (cur && cur.length > 0) {
            if (cur == "|") {
                expressionType = "OR";
            }
            else if (cur == "&") {
                expressionType = "AND";
            }
            else if (cur == "(") {
                var result = checkLogicalExpressionReq(splitExpression);
                subexpressionResults.push(result);
                splitExpression.shift(); // ')'
            } else if (cur == ')') {
                break;
            } else {
                result = checkRequirementMet(cur);
                subexpressionResults.push(result);
            }
        }
    }
    if (expressionType == "OR") {
        return subexpressionResults.some(element => element);
    }
    return subexpressionResults.every(element => element);
}

function isLocationAvailable(locationName) {
    var splitExpression = getSplitExpression(itemLocations[locationName].Need)
    return checkLogicalExpressionReq(splitExpression);
}

function isLocationProgress(locationName) {
    var types = itemLocations[locationName].Types.split(',').map(x => x.trim());
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        if (type == "Sunken Treasure"
            && itemLocations[locationName]["Original item"].startsWith("Triforce Shard")) {
            if (!flags.includes("Sunken Triforce"))
                return false;
            continue;
        }
        if (!(flags.includes(type))) {
            return false;
        }
    }
    return true;
}
