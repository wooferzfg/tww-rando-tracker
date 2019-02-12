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

function getDungeonEntryName(index) {
    return 'Entered ' + shortDungeonNames[index];
}

function getCaveName(index) {
    return caves[index]
        .replace('Secret ', '')
        .replace('Warp Maze ', '');
}

function getCaveEntryName(index) {
    return 'Entered ' + getCaveName(index);
}

function getRandomEntrances(isCaveExit, showAllEntrances) {
    var entrancesList = [];
    if (isRandomEntrances && (!isCaveExit || showAllEntrances)) {
        for (var i = 0; i < dungeons.length; i++) {
            var dungeonName = dungeons[i];
            if (isMainDungeon(dungeonName)) {
                entrancesList.push(dungeonName);
            }
        }
    }
    if (isRandomCaves && (isCaveExit || showAllEntrances)) {
        for (var i = 0; i < caves.length; i++) {
            var caveName = getCaveName(i);
            entrancesList.push(caveName);
        }
    }
    return entrancesList;
}

function getMacroForEntranceName(entranceName) {
    var dungeonIndex = dungeons.indexOf(entranceName);
    if (dungeonIndex >= 0) {
        return "Can Access Dungeon Entrance " + dungeonEntrances[dungeonIndex];
    }

    for (var i = 0; i < caves.length; i++) {
        var caveName = getCaveName(i);
        if (caveName == entranceName) {
            return "Can Access Secret Cave Entrance on " + caveEntrances[i];
        }
    }
}

function getExitForEntrance(entranceName) {
    for (var [exit, entrance] of Object.entries(entrances)) {
        if (entrance == entranceName) {
            return exit;
        }
    }
}
