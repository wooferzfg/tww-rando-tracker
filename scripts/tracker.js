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

function parseProgressString(progressString) {
    /* TODO */
}

function ApplyModes() {
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

    var progressString = getParameterByName("p");
    parseProgressString(progressString);

    trackerLoaded = true;
    afterLoad();
}

function SetAllImagesAndCounts() {

}
