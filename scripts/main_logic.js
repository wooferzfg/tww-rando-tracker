var macros; // contents of macros.txt
var itemLocations; // contents of item_locations.txt
var macrosLoaded = false;
var itemLocationsLoaded = false;

const islands = [
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
    'Mailbox',
    'The Great Sea'
];
const charts = [
    'Treasure Chart 25',
    'Treasure Chart 7',
    'Treasure Chart 24',
    'Triforce Chart 2',
    'Treasure Chart 11',
    'Triforce Chart 7',
    'Treasure Chart 13',
    'Treasure Chart 41',
    'Treasure Chart 29',
    'Treasure Chart 22',
    'Treasure Chart 18',
    'Treasure Chart 30',
    'Treasure Chart 39',
    'Treasure Chart 19',
    'Treasure Chart 8',
    'Treasure Chart 2',
    'Treasure Chart 10',
    'Treasure Chart 26',
    'Treasure Chart 3',
    'Treasure Chart 37',
    'Treasure Chart 27',
    'Treasure Chart 38',
    'Triforce Chart 1',
    'Treasure Chart 21',
    'Treasure Chart 6',
    'Treasure Chart 14',
    'Treasure Chart 34',
    'Treasure Chart 5',
    'Treasure Chart 28',
    'Treasure Chart 35',
    'Triforce Chart 3',
    'Triforce Chart 6',
    'Treasure Chart 1',
    'Treasure Chart 20',
    'Treasure Chart 36',
    'Treasure Chart 23',
    'Treasure Chart 12',
    'Treasure Chart 16',
    'Treasure Chart 4',
    'Treasure Chart 17',
    'Treasure Chart 31',
    'Triforce Chart 5',
    'Treasure Chart 9',
    'Triforce Chart 4',
    'Treasure Chart 40',
    'Triforce Chart 8',
    'Treasure Chart 15',
    'Treasure Chart 32',
    'Treasure Chart 33',
];
const dungeons = [
    'Dragon Roost Cavern',
    'Forbidden Woods',
    'Tower of the Gods',
    'Forsaken Fortress',
    'Earth Temple',
    'Wind Temple',
    "Ganon's Tower"
];
const caves = [
    'Savage Labyrinth',
    'Dragon Roost Island Secret Cave',
    'Fire Mountain Secret Cave',
    'Ice Ring Isle Secret Cave',
    'Cabana Labyrinth',
    'Needle Rock Isle Secret Cave',
    'Angular Isles Secret Cave',
    'Boating Course Secret Cave',
    'Stone Watcher Island Secret Cave',
    'Overlook Island Secret Cave',
    "Bird's Peak Rock Secret Cave",
    'Pawprint Isle Chuchu Cave',
    'Pawprint Isle Wizzrobe Cave',
    'Diamond Steppe Island Warp Maze Cave',
    'Bomb Island Secret Cave',
    'Rock Spire Isle Secret Cave',
    'Shark Island Secret Cave',
    'Cliff Plateau Isles Secret Cave',
    'Horseshoe Island Secret Cave',
    'Star Island Secret Cave'
];
const shortDungeonNames = [
    'DRC',
    'FW',
    'TotG',
    'FF',
    'ET',
    'WT',
    'GT'
];
const dungeonEntrances = [
    'On Dragon Roost Island',
    'In Forest Haven Sector',
    'In Tower of the Gods Sector',
    'On Headstone Island',
    'On Gale Isle'
];
const caveEntrances = [
    'Outset Island',
    'Dragon Roost Island',
    'Fire Mountain',
    'Ice Ring Isle',
    'Private Oasis',
    'Needle Rock Isle',
    'Angular Isles',
    'Boating Course',
    'Stone Watcher Island',
    'Overlook Island',
    "Bird's Peak Rock",
    'Pawprint Isle',
    'Pawprint Isle Side Isle',
    'Diamond Steppe Island',
    'Bomb Island',
    'Rock Spire Isle',
    'Shark Island',
    'Cliff Plateau Isles',
    'Horseshoe Island',
    'Star Island'
];

// tracker should modify these
var items = {
    'Tingle Tuner': 0,
    'Wind Waker': 0,
    'Spoils Bag': 0,
    'Grappling Hook': 0,
    'Power Bracelets': 0,
    'Iron Boots': 0,
    'Bait Bag': 0,
    'Boomerang': 0,
    'Hookshot': 0,
    'Delivery Bag': 0,
    'Bombs': 0,
    'Skull Hammer': 0,
    'Deku Leaf': 0,
    "Hero's Shield": 0,
    'Mirror Shield': 0,

    'Triforce Shard': 0,

    "Nayru's Pearl": 0,
    "Din's Pearl": 0,
    "Farore's Pearl": 0,

    "Wind's Requiem": 0,
    'Ballad of Gales': 0,
    'Command Melody': 0,
    "Earth God's Lyric": 0,
    "Wind God's Aria": 0,
    'Song of Passing': 0,

    "Boat's Sail": 0,

    'Note to Mom': 0,
    "Maggie's Letter": 0,
    "Moblin's Letter": 0,
    'Cabana Deed': 0,

    'Tingle Statue': 0,

    'Magic Meter Upgrade': 0,

    'Ghost Ship Chart': 0,

    'Progressive Sword': 0,
    'Progressive Bow': 0,
    'Progressive Wallet': 0,
    'Progressive Picto Box': 0,
    'Empty Bottle': 0,

    'Telescope': 0,
    'Magic Armor': 0,
    "Hero's Charm": 0,
    'Progressive Quiver': 0,
    'Progressive Bomb Bag': 0,
    'Hurricane Spin': 0
};
var startingItems = {}; // the items you get at the start of a new playthrough
var impossibleItems = []; // the items that are missing from the item pool and are impossible to obtain
var keys = {
    'DRC Big Key': 0,
    'DRC Small Key': 0,
    'FW Big Key': 0,
    'FW Small Key': 0,
    'TotG Big Key': 0,
    'TotG Small Key': 0,
    'ET Big Key': 0,
    'ET Small Key': 0,
    'WT Big Key': 0,
    'WT Small Key': 0,
};
var locationsChecked = {};
var entrances = {};
var flags = [];
var isKeyLunacy = false;
var isRandomEntrances = false;
var isRandomCaves = false;
var isRandomTogether = false;
var isRandomCharts = false;
var swordMode = 'sword';
var skipRematchBosses = false; // on by default in settings, but we set it to false for backwards compatibility
var startingTriforceShards = 0;
var isRaceMode = false;

// tracker should use these without modifying them
var locationsAreProgress = {};
var locationsAreAvailable = {};

$(document).ready(function () {
    loadFlags();
    loadStartingItems();
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
        updateMacrosAndLocations();
        setLocationsAreProgress();
        initializeLocationsChecked();
        loadProgress();
        dataChanged();
    }
}

// tracker should call this after changing 'items', 'keys', or 'locationsChecked'
function dataChanged() {
    setLocationsAreAvailable();
    refreshAllImagesAndCounts();
    refreshLocationColors();
    recreateTooltips();
    updateStatistics();
}

function loadStartingItems() {
    if (swordMode == 'sword') {
        startingItems['Progressive Sword'] = 1;
    } else if (swordMode == 'swordless') {
        impossibleItems.push('Progressive Sword x1');
        impossibleItems.push('Progressive Sword x2');
        impossibleItems.push('Progressive Sword x3');
        impossibleItems.push('Progressive Sword x4');
        impossibleItems.push('Hurricane Spin');
    }
    startingItems["Hero's Shield"] = 1;
    startingItems['Wind Waker'] = 1;
    startingItems["Boat's Sail"] = 1;
    startingItems["Wind's Requiem"] = 1;
    startingItems['Ballad of Gales'] = 1;
    startingItems['Song of Passing'] = 1;
    startingItems['Triforce Shard'] = startingTriforceShards;

    Object.keys(startingItems).forEach(function (item) {
        items[item] = startingItems[item];
    });
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
    } else if (isRandomCharts && (itemName.startsWith('Triforce Chart') || itemName.startsWith('Treasure Chart'))) {
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

function getCaveEntryName(index) {
    return 'Entered ' + caves[index]
        .replace('Secret ', '')
        .replace('Warp Maze ', '');
}