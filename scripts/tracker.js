var flagParam = getParameterByName('f');
var flags = [];
var isRandomEntrances = false;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadFlagsAndStartingItems() {
    if (flagParam.indexOf("D1") > -1) {
        flags.push("Dungeon");
    }
    if (flagParam.indexOf("SC1") > -1) {
        flags.push("Secret Cave");
    }
    if (flagParam.indexOf("SQ1") > -1) {
        flags.push("Sidequest");
    }
    if (flagParam.indexOf("M1") > -1) {
        flags.push("Minigame");
    }
    if (flagParam.indexOf("LR1") > -1) {
        flags.push("Platform");
        flags.push("Raft");
    }
    if (flagParam.indexOf("S1") > -1) {
        flags.push("Submarine");
    }
    if (flagParam.indexOf("ER1") > -1) {
        flags.push("Eye Reef Chest");
    }
    if (flagParam.indexOf("B1") > -1) {
        flags.push("Big Octo");
        flags.push("Gunboat");
    }
    if (flagParam.indexOf("STRI1") > -1) {
        flags.push("Sunken Triforce"); // need to account for this case separately
    }
    if (flagParam.indexOf("STRE1") > -1) {
        flags.push("Sunken Treasure")
    }
    if (flagParam.indexOf("G1") > -1) {
        flags.push("Free Gift");
    }
    if (flagParam.indexOf("MA1") > -1) {
        flags.push("Mail");
    }
    if (flagParam.indexOf("EP1") > -1) {
        flags.push("Expensive Purchase");
    }
    if (flagParam.indexOf("EV1") > -1) {
        flags.push("Misc");
        flags.push("Other Chest");
    }
    if (flagParam.indexOf("ENTRY1") > -1) {
        isRandomEntrances = true;
    }

    items["Progressive Sword"] = 1;
    items["Progressive Shield"] = 1;
    items["Wind Waker"] = 1;
    items["Boat's Sail"] = 1;
    items["Wind's Requiem"] = 1;
    items["Ballad of Gales"] = 1;

    document.getElementById('mapinfo').innerHTML = '';
    document.getElementById('iteminfo').innerHTML = '';
}

function loadProgress() {
    var progressString = getParameterByName("p");
    if (parseInt(progressString) == 0) return;

    Object.keys(items).forEach(function (itemName) {
        items[itemName] = parseInt(localStorage.getItem(itemName));
    });
    for (var i = 0; i < generalLocations.length; i++) {
        var generalLocation = generalLocations[i];
        Object.keys(locationsChecked[generalLocation]).forEach(function (detailedLocation) {
            var locationName = generalLocation + " - " + detailedLocation;
            locationsChecked[generalLocation][detailedLocation] = localStorage.getItem(locationName) == "true";
        });
    }
    macros[drcMacro] = localStorage.getItem(drcMacro);
    macros[fwMacro] = localStorage.getItem(fwMacro);
    macros[totgMacro] = localStorage.getItem(totgMacro);
    macros[etMacro] = localStorage.getItem(etMacro);
    macros[wtMacro] = localStorage.getItem(wtMacro);
}

function saveProgress() {
    Object.keys(items).forEach(function (itemName) {
        localStorage.setItem(itemName, items[itemName]);
    });
    for (var i = 0; i < generalLocations.length; i++) {
        var generalLocation = generalLocations[i];
        Object.keys(locationsChecked[generalLocation]).forEach(function (detailedLocation) {
            var locationName = generalLocation + " - " + detailedLocation;
            var locationValue = locationsChecked[generalLocation][detailedLocation];
            localStorage.setItem(locationName, locationValue);
        });
    }
    localStorage.setItem(drcMacro, macros[drcMacro]);
    localStorage.setItem(fwMacro, macros[fwMacro]);
    localStorage.setItem(totgMacro, macros[totgMacro]);
    localStorage.setItem(etMacro, macros[etMacro]);
    localStorage.setItem(wtMacro, macros[wtMacro]);
}

function refreshAllImagesAndCounts() {
    var imagedir = 'images/';

    //CHECK BOSSES
    var bosses = [];
    bosses[0] = locationsChecked["Dragon Roost Cavern"]["Gohma Heart Container"];
    bosses[1] = locationsChecked["Forbidden Woods"]["Kalle Demos Heart Container"];
    bosses[2] = locationsChecked["Tower of the Gods"]["Gohdan Heart Container"];
    bosses[3] = locationsChecked["Forsaken Fortress"]["Helmaroc King Heart Container"];
    bosses[4] = locationsChecked["Earth Temple"]["Jalhalla Heart Container"];
    bosses[5] = locationsChecked["Wind Temple"]["Molgera Heart Container"];

    for (var i = 0; i < 6; i++) {
        var l = 'extralocation' + i.toString();
        if (bosses[i]) {
            document.getElementById(l).src = imagedir + 'boss' + i + '_d.png';
        } else {
            document.getElementById(l).src = imagedir + 'boss' + i + '.png';
        }
    }

    //TRIFORCE PIECES
    var triforce = 0;
    for (var i = 1; i <= 8; i++) {
        if (items["Triforce Shard " + i] > 0) {
            triforce++;
        }
        else break;
    }
    document.getElementById('triforce').src = imagedir + 'triforce' + triforce + '.png'

    //ITEMS
    for (var i = 0; i < 28; i++) {
        var l = 'item' + i.toString();
        var itemName = document.getElementById(l).name;
        var itemCount = items[itemName];

        if (itemCount === 0) {
            document.getElementById(l).src = imagedir + 'item' + i + '.png'
        } else if (itemCount === 1) {
            document.getElementById(l).src = imagedir + 'item' + i + '_a.png'
        } else {
            document.getElementById(l).src = imagedir + 'item' + i + '_' + itemCount + '_a.png'
        }
    }

    //SONGS
    for (var i = 0; i < 6; i++) {
        var l = 'song' + i.toString();
        var songName = document.getElementById(l).name;

        if (items[songName] === 0) {
            document.getElementById(l).src = imagedir + 'song' + i + '.png'
        } else
            document.getElementById(l).src = imagedir + 'song' + i + '_a.png'
    }

    //PEARLS
    for (var i = 0; i < 3; i++) {
        var l = 'pearl' + i.toString();
        var pearlName = document.getElementById(l).name;

        if (items[pearlName] === 0) {
            document.getElementById(l).src = imagedir + 'pearl' + i + '.png'
        } else
            document.getElementById(l).src = imagedir + 'pearl' + i + '_a.png'
    }

    for (var i = 0; i < 6; i++) {
        //FF does not have keys
        if (i != 3) {
            //SMALL KEYS
            var l = 'smallkey' + i.toString();
            var smallKeyName = document.getElementById(l).innerText;
            var smallKeyCount = items[smallKeyName];
            if (smallKeyCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'smallkey.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'smallkey_' + smallKeyCount + '.png\')';
            }

            //ENTRY
            var l = 'entry' + i.toString();

            if (isRandomEntrances) {
                var entryName = document.getElementById(l).innerText;
                var curMacro = macros[entryName];
                if (curMacro == "Nothing") {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'dungeon_entered.png\')';
                } else {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'dungeon_noentry.png\')';
                }
            } else {
                document.getElementById(l).style.display = "none";
            }

            //BOSS KEYS
            var l = 'bosskey' + i.toString();
            var bigKeyName = document.getElementById(l).innerText;
            var bigKeyCount = items[bigKeyName];
            if (bigKeyCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'bosskey.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'bosskey_a.png\')';
            }
        }
    }

    //CHARTS
    for (var i = 0; i < 49; i++) {
        var l = 'chart' + i.toString();
        var chartName = document.getElementById(l).innerText;
        var chartCount = items[chartName];
        if (chartCount === 1) {
            document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'chartopen.png\')';
        } else {
            document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'chart.png\')';
        }
    }

    //LOCATIONS
    for (var i = 0; i < 58; i++) {
        var l = 'mapchests' + i.toString();
        var curLocation = generalLocations[i];
        var curAvailable = availableChests[curLocation];
        var curTotal = totalChests[curLocation];
        document.getElementById(l).innerHTML = curAvailable + '/' + curTotal;
        if (curTotal === 0) {
            document.getElementById(l).style.color = "#000000"; // black
        } else {
            if (curAvailable === 0) {
                document.getElementById(l).style.color = "#CC2929"; // red
            } else {
                document.getElementById(l).style.color = "#2929CC"; // blue
            }
        }
    }
}

function ClearItemInfo() {
    document.getElementById('iteminfo').innerText = '';
}

function ItemInfo(element) {
    document.getElementById('iteminfo').innerText = element.name;
}

function ToggleItem(element, maxItems) {
    var itemName = element.name;
    toggleItem(itemName, maxItems);
}

function ToggleTriforce() {
    for (var i = 1; i <= 8; i++) {
        var curShard = "Triforce Shard " + i;
        if (items[curShard] == 0) {
            items[curShard] = 1;
            break;
        }
        else if (i == 8) {
            resetAllShards();
        }
    }

    itemsChanged();
}

function resetAllShards() {
    for (var i = 1; i <= 8; i++) {
        items["Triforce Shard " + i] = 0;
    }
}

function toggleItem(itemName, maxItems) {
    var curCount = items[itemName];
    curCount++;
    if (curCount > maxItems) {
        curCount = 0;
    }
    items[itemName] = curCount;

    itemsChanged();

    // TODO: Disable Map here!
}

function ToggleKey(element, maxKeys) {
    var keyName = element.innerText;
    toggleItem(keyName, maxKeys);
}

function ToggleEntry(element) {
    var macroName = element.innerText;
    var macroVal = macros[macroName];
    if (macroVal == "Impossible") {
        macros[macroName] = "Nothing";
    }
    else {
        macros[macroName] = "Impossible";
    }

    itemsChanged();
}

function ToggleMap(index) {

}

function MapInfo(i) {
    let generalLocation = generalLocations[i];
    var curAvailable = availableChests[generalLocation];
    var curTotal = totalChests[generalLocation];
    document.getElementById('mapinfo').innerHTML = generalLocation + ' (' + curAvailable + '/' + curTotal + ')';
}

function ToggleChart(element) {
    toggleItem(element.innerText, 1);
}
