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
