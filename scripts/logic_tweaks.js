function updateMacrosAndLocations() {
    addDefeatGanondorf();
    updateDungeonEntranceMacros();
    updateCaveEntranceMacros();
    updateChartMacros();
    updateRematchBossesMacros();
    updateSwordModeMacros();
    updateTriforceMacro();
    updateTingleStatueReward();
}

function addDefeatGanondorf() {
    flags.push('Finish Game');
    itemLocations["Ganon's Tower - Defeat Ganondorf"] = {
        Need: 'Can Reach and Defeat Ganondorf',
        Types: 'Finish Game'
    };
}

function updateDungeonEntranceMacros() {
    if (isRandomEntrances) {
        for (var i = 0; i < dungeons.length; i++) {
            var dungeonName = dungeons[i];
            if (isMainDungeon(dungeonName)) {
                var macroName = 'Can Access ' + dungeonName;
                var entryName = getDungeonEntryName(i);
                macros[macroName] = entryName;
                items[entryName] = 0;
            }
        }
    }
}

function updateCaveEntranceMacros() {
    if (isRandomCaves) {
        for (var i = 0; i < caves.length; i++) {
            var macroName = 'Can Access ' + caves[i];
            var entryName = getCaveEntryName(i);
            macros[macroName] = entryName;
            items[entryName] = 0;
        }
    }
}

function updateChartMacros() {
    for (var i = 0; i < charts.length; i++) {
        var chartName = charts[i];
        items[chartName] = 0;
        if (isRandomCharts) {
            var macroName = 'Chart for Island ' + (i + 1);
            macros[macroName] = chartName; // we assume everything is a Treasure Chart and clear any additional requirements like wallet upgrades
        }
    }
}

function updateRematchBossesMacros() {
    if (skipRematchBosses) {
        macros["Can Unlock Ganon's Tower Four Boss Door"] = 'Nothing';
    }
}

function updateSwordModeMacros() {
    if (swordMode == 'swordless') {
        macros['Can Sword Fight with Orca'] = 'Can Sword Fight with Orca in Swordless';
        macros['Can Defeat Phantom Ganon'] = 'Can Defeat Phantom Ganon in Swordless';
        macros['Can Access Hyrule'] = 'Can Access Hyrule in Swordless';
        macros['Can Defeat Ganondorf'] = 'Can Defeat Ganondorf in Swordless';
    }
}

function updateTriforceMacro() {
    macros['All 8 Triforce Shards'] = 'Triforce Shard x8';
}

function updateTingleStatueReward() {
    var tingleStatueReward = itemLocations['Tingle Island - Ankle - Reward for All Tingle Statues'];
    if (tingleStatueReward) {
        tingleStatueReward.Need = 'Tingle Statue x5';
    }
}

function clearRaceModeBannedLocations() {
    var mailbox = locationsChecked["Mailbox"];
    if (currentGeneralLocation == "Forbidden Woods") {
        mailbox["Letter from Orca"] = true;
    } else if (currentGeneralLocation == "Forsaken Fortress") {
        mailbox["Letter from Aryll"] = true;
        mailbox["Letter from Tingle"] = true;
        Object.keys(itemLocations).forEach(function (locationName) {
            if (itemLocations[locationName].Types.includes("Eye Reef Chest")) {
                var splitName = getSplitLocationName(locationName);
                locationsChecked[splitName.general][splitName.detailed] = true;
            }
        });
    } else if (currentGeneralLocation == "Earth Temple") {
        mailbox["Letter from Baito"] = true;
    }
}
