var macros; // contents of macros.txt
var itemLocations; // contents of item_locations.txt
var macrosLoaded = false;
var itemLocationsLoaded = false;
var trackerLoaded = false;

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
};
var locationsChecked = {};

var locationsAreProgress = {};

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

loadMacros();
loadItemLocations();

function afterLoad() {
    if (macrosLoaded && itemLocationsLoaded && trackerLoaded) {
        setLocationsAreProgress();
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

function setLocationsAreProgress() {
    locationsAreProgress = setLocations(isLocationProgress);
}

function checkRequirementMet(reqName) {
    if (reqName.startsWith('Progressive'))
        return checkNumberReq(reqName);
    if (reqName.includes('Small Key x'))
        return checkNumberReq(reqName);
    if (reqName.startsWith('Can Access Other Location "'))
        return checkOtherLocationReq(reqName);
    if (reqName in items)
        return items[reqName] > 0;
    if (reqName in macros)
        return checkLogicalExpressionReq(macros[reqName]);
    if (reqName == "Nothing")
        return true;
    if (reqName == "Impossible")
        return false;
}

function checkNumberReq(reqName) {
    var itemName = reqName.substring(0, reqName.length - 3);
    var numRequired = parseInt(reqName.charAt(reqName.length - 1));
    return items[itemName] >= numRequired;
}

function checkOtherLocationReq(reqName) {
    var otherLocation = reqName.substring('Can Access Other Location "'.length, reqName.length - 1);
    return checkLogicalExpressionReq(itemLocations[otherLocation].Need);
}

function checkLogicalExpressionReq(expression) {
    var splitExpression = expression.split(/([(&\|)])/g);
    var result = "";
    for (var i = 0; i < splitExpression.length; i++) {
        var cur = splitExpression[i].trim();
        if (cur.length > 0) {
            if (cur == "(" || cur == ")")
                result += cur;
            else if (cur == "|")
                result += "||";
            else if (cur == "&")
                result += "&&";
            else {
                if (checkRequirementMet(cur))
                    result += "true";
                else
                    result += "false";
            }
        }
    }
    return eval(result);
}

function isLocationAvailable(locationName) {
    return checkLogicalExpressionReq(itemLocations[locationName].Need);
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
