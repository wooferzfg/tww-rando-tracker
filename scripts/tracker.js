const imageDir = 'images/';
const flagParam = getParameterByName('f');
const versionParam = getParameterByName('v');
const progressParam = getParameterByName('p');
const isCurrentVersionParam = getParameterByName('c');

var disableMap = false;
var currentGeneralLocation = '';
var currentLocationIsDungeon = false;
var showNonProgressLocations = false;
var singleColorBackground = false;
var loadingErrorShown = false;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function showLoadingError() {
    if (!loadingErrorShown) {
        if (versionParam) {
            var notificationMessage = "Logic for Wind Waker Randomizer " + versionParam + " could not be loaded.";
        } else {
            var notificationMessage = "Logic could not be loaded. Version not specified.";
        }
        $.notify(notificationMessage, {
            autoHideDelay: 5000,
            className: "error",
            position: "top left"
        });
        loadingErrorShown = true;
    }
}

function loadFlags() {
    if (progressParam == "1" && getLocalStorageBool("progress")) {
        var flagString = localStorage.getItem("flags");
        if (flagString) {
            flags = flagString.split(',');
        }
        isKeyLunacy = getLocalStorageBool("isKeyLunacy");
        isRandomEntrances = getLocalStorageBool("isRandomEntrances");
        return;
    }

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
    if (flagParam.indexOf("KL1") > -1) {
        isKeyLunacy = true;
    }
    if (flagParam.indexOf("RDE1") > -1) {
        isRandomEntrances = true;
    }
}

function loadProgress() {
    if (progressParam == "1") {
        if (getLocalStorageBool("progress")) {
            Object.keys(items).forEach(function (itemName) {
                var itemCount = parseInt(localStorage.getItem(itemName));
                if (!isNaN(itemCount)) {
                    items[itemName] = itemCount;
                }
            });
            Object.keys(keys).forEach(function (keyName) {
                var keyCount = parseInt(localStorage.getItem(keyName));
                if (!isNaN(keyCount)) {
                    keys[keyName] = keyCount;
                }
            });
            Object.keys(locationsChecked).forEach(function (generalLocation) {
                Object.keys(locationsChecked[generalLocation]).forEach(function (detailedLocation) {
                    var locationName = generalLocation + " - " + detailedLocation;
                    locationsChecked[generalLocation][detailedLocation] = getLocalStorageBool(locationName);
                });
            });

            if (isCurrentVersionParam == '1') {
                var notificationMessage = "Progress loaded.";
            } else {
                var notificationMessage = "Progress loaded for Wind Waker Randomizer " + versionParam + "."
            }
            $.notify(notificationMessage, {
                autoHideDelay: 5000,
                className: "success",
                position: "top left"
            });
        } else {
            $.notify("Progress could not be loaded.", {
                autoHideDelay: 5000,
                className: "error",
                position: "top left"
            });
        }
    }
}

function getLocalStorageBool(itemName) {
    return localStorage.getItem(itemName) == "true";
}

function saveProgress(element) {
    try {
        Object.keys(items).forEach(function (itemName) {
            localStorage.setItem(itemName, items[itemName]);
        });
        Object.keys(keys).forEach(function (keyName) {
            localStorage.setItem(keyName, keys[keyName]);
        });
        Object.keys(locationsChecked).forEach(function (generalLocation) {
            Object.keys(locationsChecked[generalLocation]).forEach(function (detailedLocation) {
                var locationName = generalLocation + " - " + detailedLocation;
                var locationValue = locationsChecked[generalLocation][detailedLocation];
                localStorage.setItem(locationName, locationValue);
            });
        })
        localStorage.setItem("flags", flags.join(','));
        localStorage.setItem("isKeyLunacy", isKeyLunacy);
        localStorage.setItem("isRandomEntrances", isRandomEntrances);
        localStorage.setItem("version", versionParam);
        localStorage.setItem("progress", "true");

        $(element).notify("Progress saved.", {
            autoHideDelay: 5000,
            className: "success",
            position: "top left"
        });
    }
    catch {
        $(element).notify("Progress could not be saved.", {
            autoHideDelay: 5000,
            className: "error",
            position: "top left"
        });
    }
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
            toggleMap(dungeons.indexOf(currentGeneralLocation), true);
        } else {
            toggleMap(islands.indexOf(currentGeneralLocation), false);
        }
    }
    dataChanged();
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
    // bosses
    var bosses = [];
    bosses[0] = locationsChecked["Dragon Roost Cavern"]["Gohma Heart Container"];
    bosses[1] = locationsChecked["Forbidden Woods"]["Kalle Demos Heart Container"];
    bosses[2] = locationsChecked["Tower of the Gods"]["Gohdan Heart Container"];
    bosses[3] = locationsChecked["Forsaken Fortress"]["Helmaroc King Heart Container"];
    bosses[4] = locationsChecked["Earth Temple"]["Jalhalla Heart Container"];
    bosses[5] = locationsChecked["Wind Temple"]["Molgera Heart Container"];
    bosses[6] = locationsChecked["Ganon's Tower"]["Defeat Ganondorf"];

    for (var i = 0; i < bosses.length; i++) {
        var l = 'extralocation' + i.toString();
        if (bosses[i]) {
            document.getElementById(l).src = imageDir + 'boss' + i + '_d.png';
        } else {
            document.getElementById(l).src = imageDir + 'boss' + i + '.png';
        }
    }

    // triforce pieces
    var triforce = 0;
    for (var i = 1; i <= 8; i++) {
        if (items["Triforce Shard " + i] > 0) {
            triforce++;
        }
        else break;
    }
    document.getElementById('triforce').src = imageDir + 'triforce' + triforce + '.png'

    // items
    for (var i = 0; i < 31; i++) {
        var l = 'item' + i.toString();
        var itemName = document.getElementById(l).name;
        var itemCount = items[itemName];

        if (itemCount === 0) {
            document.getElementById(l).src = imageDir + 'item' + i + '.png'
        } else if (itemCount === 1) {
            document.getElementById(l).src = imageDir + 'item' + i + '_a.png'
        } else {
            document.getElementById(l).src = imageDir + 'item' + i + '_' + itemCount + '_a.png'
        }
    }

    // shields
    var l = 'shield';
    if (items["Mirror Shield"] > 0) {
        document.getElementById(l).src = imageDir + 'mirrorshield.png'
    } else if (items["Hero's Shield"] > 0) {
        document.getElementById(l).src = imageDir + 'herosshield.png'
    } else {
        document.getElementById(l).src = imageDir + 'noshield.png'
    }

    // songs
    for (var i = 0; i < 6; i++) {
        var l = 'song' + i.toString();
        var songName = document.getElementById(l).name;

        if (items[songName] === 0) {
            document.getElementById(l).src = imageDir + 'song' + i + '.png'
        } else
            document.getElementById(l).src = imageDir + 'song' + i + '_a.png'
    }

    // pearls
    for (var i = 0; i < 3; i++) {
        var l = 'pearl' + i.toString();
        var pearlName = document.getElementById(l).name;

        if (items[pearlName] === 0) {
            document.getElementById(l).src = imageDir + 'pearl' + i + '.png'
        } else
            document.getElementById(l).src = imageDir + 'pearl' + i + '_a.png'
    }

    for (var i = 0; i < dungeons.length; i++) {
        if (isMainDungeon(dungeons[i])) {
            // small keys
            var l = 'smallkey' + i.toString();
            var smallKeyName = document.getElementById(l).innerText;
            var smallKeyCount = keys[smallKeyName];
            if (smallKeyCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'smallkey.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'smallkey_' + smallKeyCount + '.png\')';
            }

            // dungeon entry
            var l = 'entry' + i.toString();
            if (isRandomEntrances) {
                var entryName = document.getElementById(l).innerText;
                if (items[entryName] === 0) {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'dungeon_noentry.png\')';
                } else {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'dungeon_entered.png\')';
                }
            } else {
                document.getElementById(l).style.display = "none";
            }

            // boss keys
            var l = 'bosskey' + i.toString();
            var bigKeyName = document.getElementById(l).innerText;
            var bigKeyCount = keys[bigKeyName];
            if (bigKeyCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'bosskey.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'bosskey_a.png\')';
            }
        }
    }

    // charts
    for (var i = 0; i < 49; i++) {
        var l = 'chart' + i.toString();
        var chartName = document.getElementById(l).innerText;
        var chartCount = items[chartName];
        if (chartName.includes("Triforce")) {
            if (chartCount === 1) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'triforcechartopen.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'triforcechart.png\')';
            }
        }
        else {
            if (chartCount === 1) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'chartopen.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'chart.png\')';
            }
        }
    }

    // locations
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

function clearItemInfo() {
    document.getElementById('iteminfo').innerText = '';
}

function itemInfo(element) {
    var text = element.name;
    if (text.startsWith("Progressive")) {
        var itemCount = items[text];
        var textWithCount = text + " x" + itemCount;
        text = getNameForItem(textWithCount);
    } else if (text == "Hero's Shield") {
        if (items["Mirror Shield"] == 1) {
            text = "Mirror Shield";
        }
    } else if (text == "Triforce") {
        for (var i = 1; i <= 8; i++) {
            var curShard = "Triforce Shard " + i;
            if (items[curShard] == 0) {
                text = "Triforce Shard (" + (i - 1).toString() + "/8)";
                break;
            }
        }
    } else if (text == "Empty Bottle") {
        var itemCount = items[text];
        text = "Empty Bottle (" + itemCount + "/4)";
    } else {
        text = getNameForItem(text);
    }
    document.getElementById('iteminfo').innerText = text;
}

function toggleInventoryItem(element, maxItems) {
    var itemName = element.name;
    toggleItem(itemName, maxItems);
    itemInfo(element);
}

function toggleShield(element) {
    if (items["Hero's Shield"] == 0) {
        items["Hero's Shield"] = 1;
    } else if (items["Mirror Shield"] == 0) {
        items["Mirror Shield"] = 1;
    } else {
        items["Hero's Shield"] = 0;
        items["Mirror Shield"] = 0;
    }
    dataChanged();
    itemInfo(element);
}

function toggleTriforce() {
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
    dataChanged();
    itemInfo(document.getElementById('triforce'));
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
    dataChanged();
}

function toggleKey(element, maxKeys) {
    disableMap = true;
    var keyName = element.innerText;
    var keyCount = keys[keyName];
    keyCount++;
    if (keyCount > maxKeys) {
        keyCount = 0;
    }
    keys[keyName] = keyCount;
    dataChanged();
    if (keyName.includes("Small")) {
        smallKeyInfo(element, maxKeys);
    }
}

function toggleEntry(element) {
    disableMap = true;
    var entryName = element.innerText;
    toggleItem(entryName, 1);
    mapItemInfo(element);
}

function shrinkMap() {
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

function toggleMap(index, isDungeon) {
    if (disableMap) {
        disableMap = false;
        return;
    }

    document.getElementById('chartmap').style.display = "none";
    document.getElementById('zoommap').style.display = "block";

    if (isDungeon) {
        currentGeneralLocation = dungeons[index];
        currentLocationIsDungeon = true;
        document.getElementById('zoommap-background').style.backgroundImage = 'url(\'' + imageDir + 'dungeon_mapfull' + index + '.png\')';
    } else {
        currentGeneralLocation = islands[index];
        currentLocationIsDungeon = false;
        document.getElementById('zoommap-background').style.backgroundImage = 'url(\'' + imageDir + 'mapfull' + index + '.png\')';
    }

    var detailedLocations = getDetailedLocations(currentGeneralLocation, isDungeon);

    var fontSize = 'normal';
    if (detailedLocations.length > 24) { // 3 columns
        fontSize = 'smallest';
    }
    else if (detailedLocations.length > 12) { // 2 columns
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

function toggleLocation(element) {
    var detailedLocation = element.innerText;
    var newLocationChecked = !locationsChecked[currentGeneralLocation][detailedLocation];
    locationsChecked[currentGeneralLocation][detailedLocation] = newLocationChecked;
    dataChanged();
}

function clearMapInfo() {
    document.getElementById('mapinfo').innerText = '';
}

function mapInfo(i) {
    let generalLocation = islands[i];
    var curAvailable = availableIslandChests[generalLocation];
    var curTotal = totalIslandChests[generalLocation];
    document.getElementById('mapinfo').innerText = generalLocation + ' (' + curAvailable + '/' + curTotal + ')';
}

function clearMapItemInfo() {
    document.getElementById('mapiteminfo').innerText = '';
}

function mapItemInfo(element) {
    document.getElementById('mapiteminfo').innerText = element.innerText;
}

function smallKeyInfo(element, maxKeys) {
    var keyName = element.innerText;
    var numKeys = keys[keyName];
    document.getElementById('mapiteminfo').innerText = keyName + ' (' + numKeys + '/' + maxKeys + ')';
}

function dungeonMapInfo(i) {
    let generalLocation = dungeons[i];
    var curAvailable = availableDungeonChests[generalLocation];
    var curTotal = totalDungeonChests[generalLocation];
    document.getElementById('mapinfo').innerText = generalLocation + ' (' + curAvailable + '/' + curTotal + ')';
}

function toggleChart(element) {
    disableMap = true;
    toggleItem(element.innerText, 1);
    mapItemInfo(element);
}
