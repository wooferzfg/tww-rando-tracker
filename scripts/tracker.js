var flagParam = getParameterByName('f');
var flags = [];
var disableMap = false;
var imagedir = 'images/';
var currentGeneralLocation = '';
var currentLocationIsDungeon = false;

var isRandomEntrances = false;
var showNonProgressLocations = false;
var singleColorBackground = false;

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
    if (flagParam.indexOf("GF1") > -1) {
        flags.push("Great Fairy");
    }
    if (flagParam.indexOf("PSC1") > -1) {
        flags.push("Puzzle Secret Cave");
    }
    if (flagParam.indexOf("CSC1") > -1) {
        flags.push("Combat Secret Cave");
    }
    if (flagParam.indexOf("SSQ1") > -1) {
        flags.push("Short Sidequest");
    }
    if (flagParam.indexOf("LSQ1") > -1) {
        flags.push("Long Sidequest");
    }
    if (flagParam.indexOf("ST1") > -1) {
        flags.push("Spoils Trading");
    }
    if (flagParam.indexOf("MG1") > -1) {
        flags.push("Minigame");
    }
    if (flagParam.indexOf("FG1") > -1) {
        flags.push("Free Gift");
    }
    if (flagParam.indexOf("MAI1") > -1) {
        flags.push("Mail");
    }
    if (flagParam.indexOf("PR1") > -1) {
        flags.push("Platform");
        flags.push("Raft");
    }
    if (flagParam.indexOf("SUB1") > -1) {
        flags.push("Submarine");
    }
    if (flagParam.indexOf("ERC1") > -1) {
        flags.push("Eye Reef Chest");
    }
    if (flagParam.indexOf("BOG1") > -1) {
        flags.push("Big Octo");
        flags.push("Gunboat");
    }
    if (flagParam.indexOf("TRI1") > -1) {
        flags.push("Sunken Triforce"); // need to account for this case separately
    }
    if (flagParam.indexOf("TRE1") > -1) {
        flags.push("Sunken Treasure")
    }
    if (flagParam.indexOf("EP1") > -1) {
        flags.push("Expensive Purchase");
    }
    if (flagParam.indexOf("MIS1") > -1) {
        flags.push("Other Chest");
        flags.push("Misc");
    }
    if (flagParam.indexOf("RDE1") > -1) {
        isRandomEntrances = true;
    }

    items["Progressive Sword"] = 1;
    items["Hero's Shield"] = 1;
    items["Wind Waker"] = 1;
    items["Boat's Sail"] = 1;
    items["Wind's Requiem"] = 1;
    items["Ballad of Gales"] = 1;
}

function loadProgress() {
    var progressString = getParameterByName("p");
    if (parseInt(progressString) == 0) return;

    Object.keys(items).forEach(function (itemName) {
        items[itemName] = parseInt(localStorage.getItem(itemName));
    });
    Object.keys(locationsChecked).forEach(function (generalLocation) {
        Object.keys(locationsChecked[generalLocation]).forEach(function (detailedLocation) {
            var locationName = generalLocation + " - " + detailedLocation;
            locationsChecked[generalLocation][detailedLocation] = localStorage.getItem(locationName) == "true";
        });
    })
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
    Object.keys(locationsChecked).forEach(function (generalLocation) {
        Object.keys(locationsChecked[generalLocation]).forEach(function (detailedLocation) {
            var locationName = generalLocation + " - " + detailedLocation;
            var locationValue = locationsChecked[generalLocation][detailedLocation];
            localStorage.setItem(locationName, locationValue);
        });
    })
    localStorage.setItem(drcMacro, macros[drcMacro]);
    localStorage.setItem(fwMacro, macros[fwMacro]);
    localStorage.setItem(totgMacro, macros[totgMacro]);
    localStorage.setItem(etMacro, macros[etMacro]);
    localStorage.setItem(wtMacro, macros[wtMacro]);

    localStorage.setItem("rando-flags", flagParam);
}

function toggleNonProgressLocations(button) {
    showNonProgressLocations = !showNonProgressLocations;
    if (showNonProgressLocations) {
        button.innerText = "Hide Non-Progress Locations";
    } else {
        button.innerText = "Show Non-Progress Locations";
    }

    if (document.getElementById("zoommap").style.display == "block") {
        if (currentLocationIsDungeon) {
            ToggleMap(dungeons.indexOf(currentGeneralLocation), true);
        } else {
            ToggleMap(islands.indexOf(currentGeneralLocation), false);
        }
    }
    locationsChanged();
}

function toggleSingleColorBackground(button) {
    var itemTracker = document.getElementsByClassName("item-tracker")[0];
    var extraLocations = document.getElementsByClassName("extra-locations")[0];
    singleColorBackground = !singleColorBackground;
    if (singleColorBackground) {
        itemTracker.classList.add("single-color");
        extraLocations.classList.add("single-color");
        button.innerText = "Hide Single Color Background";
    } else {
        itemTracker.classList.remove("single-color");
        extraLocations.classList.remove("single-color");
        button.innerText = "Show Single Color Background";
    }
}

function refreshAllImagesAndCounts() {
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
    for (var i = 0; i < 27; i++) {
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

    //SHIELDS
    var l = 'shield';
    if (items["Mirror Shield"] > 0) {
        document.getElementById(l).src = imagedir + 'mirrorshield.png'
    } else if (items["Hero's Shield"] > 0) {
        document.getElementById(l).src = imagedir + 'herosshield.png'
    } else {
        document.getElementById(l).src = imagedir + 'noshield.png'
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
                if (items[entryName] === 0) {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'dungeon_noentry.png\')';
                } else {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'dungeon_entered.png\')';
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
        if (chartName.includes("Triforce")) {
            if (chartCount === 1) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'triforcechartopen.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'triforcechart.png\')';
            }
        }
        else {
            if (chartCount === 1) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'chartopen.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imagedir + 'chart.png\')';
            }
        }
    }

    //LOCATIONS
    for (var i = 0; i < islands.length; i++) {
        var l = 'mapchests' + i.toString();
        var curLocation = islands[i];
        var curProgress = progressIslandChests[curLocation];
        var curAvailable = availableIslandChests[curLocation];
        var curTotal = totalIslandChests[curLocation];
        setChestsForElement(document.getElementById(l), curProgress, curAvailable, curTotal);
    }
    for (var i = 0; i < dungeons.length; i++) {
        var l = 'dungeonchests' + i.toString();
        var curLocation = dungeons[i];
        var curProgress = progressDungeonChests[curLocation];
        var curAvailable = availableDungeonChests[curLocation];
        var curTotal = totalDungeonChests[curLocation];
        setChestsForElement(document.getElementById(l), curProgress, curAvailable, curTotal);
    }
}

function setChestsForElement(element, progress, available, total) {
    element.innerHTML = available + '/' + total;
    if (total === 0) {
        element.style.color = "#000000"; // black
    } else {
        if (available === 0) {
            element.style.color = "#CC2929"; // red
        } else {
            if (progress === 0) {
                element.style.color = "#808000"; // yellow
            } else {
                element.style.color = "#2929CC"; // blue
            }
        }
    }
}

function ClearItemInfo() {
    document.getElementById('iteminfo').innerText = '';
}

function ItemInfo(element) {
    var text = element.name;
    if (text == "Progressive Shield") {
        if (items["Mirror Shield"] == 1) {
            text = "Mirror Shield";
        } else {
            text = "Hero's Shield";
        }
    }
    else if (text.startsWith("Progressive")) {
        var itemCount = items[text];
        var textWithCount = text + " x" + itemCount;
        text = getNameForItem(textWithCount);
    } else if (text == "Triforce") {
        for (var i = 1; i <= 8; i++) {
            var curShard = "Triforce Shard " + i;
            if (items[curShard] == 0) {
                text = "Triforce Shard (" + (i - 1).toString() + "/8)";
                break;
            } else if (i == 8) {
                text = "Triforce";
            }
        }
    }
    document.getElementById('iteminfo').innerText = text;
}

function ToggleItem(element, maxItems) {
    var itemName = element.name;
    toggleItem(itemName, maxItems);
    ItemInfo(element);
}

function ToggleShield(element) {
    if (items["Hero's Shield"] == 0) {
        items["Hero's Shield"] = 1;
    } else if (items["Mirror Shield"] == 0) {
        items["Mirror Shield"] = 1;
    } else {
        items["Hero's Shield"] = 0;
        items["Mirror Shield"] = 0;
    }
    itemsChanged();
    ItemInfo(element);
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
    ItemInfo(document.getElementById('triforce'));
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
}

function ToggleKey(element, maxKeys) {
    disableMap = true;
    var keyName = element.innerText;
    toggleItem(keyName, maxKeys);
    SmallKeyInfo(element, maxKeys);
}

function ToggleEntry(element) {
    disableMap = true;
    var entryName = element.innerText;
    toggleItem(entryName, 1);
    MapItemInfo(element);
}

function ShrinkMap() {
    removeVisibleTooltips();
    document.getElementById('chartmap').style.display = "block";
    document.getElementById('zoommap').style.display = "none";
    currentGeneralLocation = "";
    recreateTooltips();
}

function getTextForExpression(expression) {
    if (expression.type == "OR") {
        var separator = " or ";
    } else {
        var separator = " and ";
    }
    var items = expression.items;
    var result = "";
    for (var i = 0; i < items.length; i++) {
        var curItem = items[i];
        if (curItem.type) {
            var subResult = getTextForExpression(curItem);
            result += "(" + subResult + ")";
        } else {
            result += curItem;
        }
        if (i < items.length - 1) {
            result += separator;
        }
    }
    return result;
}

function setTooltipText(generalLocation, detailedLocation) {
    var itemsMissing = itemsMissingForLocation(generalLocation, detailedLocation);
    var list = document.createElement("ul");
    if (itemsMissing.type == "AND") {
        var items = itemsMissing.items;
    } else {
        var items = [itemsMissing];
    }
    for (var i = 0; i < items.length; i++) {
        var listItem = document.createElement("li");
        var curItem = items[i];
        if (curItem.type) {
            listItem.innerText = getTextForExpression(curItem);
        } else {
            listItem.innerText = curItem;
        }
        list.appendChild(listItem);
    }
    $(".tool-tip-text").html(list.outerHTML);
}

function addTooltipToElement(element) {
    var detailedLocation = element.innerText;
    if (!locationsChecked[currentGeneralLocation][detailedLocation]
        && !locationsAreAvailable[currentGeneralLocation][detailedLocation]) {
        setTooltipText(currentGeneralLocation, detailedLocation);
        $(element).qtip({
            content: {
                text: $(".tool-tip-text").clone(),
                title: "Missing Items"
            },
            position: {
                target: 'mouse',
                adjust: {
                    x: 15
                }
            }
        });
    }
}

function addSongTooltip(element) {
    var id = "#" + element.id + "-notes";
    var songName = element.name;
    $(element).qtip({
        content: {
            text: $(id).clone(),
            title: songName
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
    if (document.getElementById('zoommap').style.display == "block") {
        removeVisibleTooltips();
        for (var i = 0; i < 36; i++) {
            var l = 'detaillocation' + i.toString();
            var element = document.getElementById(l);
            removeTooltipFromElement(element);
            if (element.style.display == "block") {
                addTooltipToElement(element);
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
        if (element.data("qtip")) {
            element.qtip("destroy", true);
            element.removeData("hasqtip");
            element.removeAttr("data-hasqtip");
        }
    });
}

function ToggleMap(index, isDungeon) {
    if (disableMap) {
        disableMap = false;
        return;
    }

    document.getElementById('chartmap').style.display = "none";
    document.getElementById('zoommap').style.display = "block";

    if (isDungeon) {
        currentGeneralLocation = dungeons[index];
        currentLocationIsDungeon = true;
        document.getElementById('zoommap-background').style.backgroundImage = 'url(\'' + imagedir + 'dungeon_mapfull' + index + '.png\')';
    } else {
        currentGeneralLocation = islands[index];
        currentLocationIsDungeon = false;
        document.getElementById('zoommap-background').style.backgroundImage = 'url(\'' + imagedir + 'mapfull' + index + '.png\')';
    }

    var detailedLocations = getDetailedLocations(currentGeneralLocation, isDungeon);

    var fontSize = 'normal';
    if (detailedLocations.length > 24) { // Windfall Island
        fontSize = 'smallest';
    }
    else if (detailedLocations.length > 12) { // Dungeons
        fontSize = 'small';
    }

    for (var i = 0; i < 36; i++) {
        var l = 'detaillocation' + i.toString();
        var element = document.getElementById(l);
        if (i < detailedLocations.length) {
            element.style.display = "block";
            element.innerText = detailedLocations[i];
            element.classList.remove("detail-small");
            element.classList.remove("detail-smallest");
            if (fontSize == "small") {
                element.classList.add("detail-small");
            } else if (fontSize == "smallest") {
                element.classList.add("detail-smallest");
            }
        } else {
            element.style.display = "none";
        }
    }

    refreshLocationColors();
    recreateTooltips();
}

function refreshLocationColors() {
    if (currentGeneralLocation.length === 0) {
        return;
    }

    for (var i = 0; i < 36; i++) {
        var l = 'detaillocation' + i.toString();
        var element = document.getElementById(l);
        var detailedLocation = element.innerText;
        if (locationsChecked[currentGeneralLocation][detailedLocation]) {
            element.style.color = "#000000"; // black
            element.style.setProperty("text-decoration", "line-through");
        } else {
            element.style.setProperty("text-decoration", "none");
            if (locationsAreAvailable[currentGeneralLocation][detailedLocation]) {
                if (locationsAreProgress[currentGeneralLocation][detailedLocation]) {
                    element.style.color = "#2929CC"; // blue
                } else {
                    element.style.color = "#808000"; // yellow
                }
            } else {
                element.style.color = "#CC2929"; // red
            }
        }
    }
}

function ToggleLocation(element) {
    var detailedLocation = element.innerText;
    var newLocationChecked = !locationsChecked[currentGeneralLocation][detailedLocation];
    locationsChecked[currentGeneralLocation][detailedLocation] = newLocationChecked;
    locationsChanged();
}

function ClearMapInfo() {
    document.getElementById('mapinfo').innerText = '';
}

function MapInfo(i) {
    let generalLocation = islands[i];
    var curAvailable = availableIslandChests[generalLocation];
    var curTotal = totalIslandChests[generalLocation];
    document.getElementById('mapinfo').innerText = generalLocation + ' (' + curAvailable + '/' + curTotal + ')';
}

function ClearMapItemInfo() {
    document.getElementById('mapiteminfo').innerText = '';
}

function MapItemInfo(element) {
    document.getElementById('mapiteminfo').innerText = element.innerText;
}

function SmallKeyInfo(element, maxKeys) {
    var keyName = element.innerText;
    var numKeys = items[keyName];
    document.getElementById('mapiteminfo').innerText = keyName + ' (' + numKeys + '/' + maxKeys + ')';
}

function DungeonMapInfo(i) {
    let generalLocation = dungeons[i];
    var curAvailable = availableDungeonChests[generalLocation];
    var curTotal = totalDungeonChests[generalLocation];
    document.getElementById('mapinfo').innerText = generalLocation + ' (' + curAvailable + '/' + curTotal + ')';
}

function ToggleChart(element) {
    disableMap = true;
    toggleItem(element.innerText, 1);
    MapItemInfo(element);
}
