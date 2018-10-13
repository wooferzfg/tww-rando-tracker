const flagParam = getParameterByName('f');
const versionParam = getParameterByName('v');
const progressParam = getParameterByName('p');
const isCurrentVersionParam = getParameterByName('c');

var loadingErrorShown = false;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function showLoadingError() {
    if (!loadingErrorShown) {
        if (versionParam) {
            var notificationMessage = 'Logic for Wind Waker Randomizer ' + versionParam + ' could not be loaded.';
        } else {
            var notificationMessage = 'Logic could not be loaded. Version not specified.';
        }
        $.notify(notificationMessage, {
            autoHideDelay: 5000,
            className: 'error',
            position: 'top left'
        });
        loadingErrorShown = true;
    }
}

function loadFlags() {
    if (progressParam == '1' && getLocalStorageBool('progress', false)) {
        var flagString = localStorage.getItem('flags');
        if (flagString) {
            flags = flagString.split(',');
        }
        isKeyLunacy = getLocalStorageBool('isKeyLunacy', isKeyLunacy);
        isRandomEntrances = getLocalStorageBool('isRandomEntrances', isRandomEntrances);
        isRandomCharts = getLocalStorageBool('isRandomCharts', isRandomCharts);
        swordMode = getLocalStorageItem('swordMode', swordMode);
        skipRematchBosses = getLocalStorageBool('skipRematchBosses', skipRematchBosses);
        startingTriforceShards = getLocalStorageInt('startingTriforceShards', startingTriforceShards);
        return;
    }

    isKeyLunacy = getParamBool('KL', isKeyLunacy);
    isRandomEntrances = getParamBool('RDE', isRandomEntrances);
    isRandomCharts = getParamBool('RCH', isRandomCharts);
    skipRematchBosses = getParamBool('SRB', skipRematchBosses);
    startingTriforceShards = getParamValue('STS', startingTriforceShards);

    var swordValue = getParamValue('SWO', 0);
    if (swordValue == 2) {
        swordMode = 'swordless';
    } else if (swordValue == 1) {
        swordMode = 'swordless-start';
    }

    if (getParamBool('TRI', false)) {
        if (isRandomCharts) {
            flags.push('Sunken Treasure');
        } else {
            flags.push('Sunken Triforce'); // need to account for this case separately
        }
    }

    checkAddFlags('D', ['Dungeon']);
    checkAddFlags('GF', ['Great Fairy']);
    checkAddFlags('PSC', ['Puzzle Secret Cave']);
    checkAddFlags('CSC', ['Combat Secret Cave']);
    checkAddFlags('SSQ', ['Short Sidequest']);
    checkAddFlags('LSQ', ['Long Sidequest']);
    checkAddFlags('ST', ['Spoils Trading']);
    checkAddFlags('MG', ['Minigame']);
    checkAddFlags('FG', ['Free Gift']);
    checkAddFlags('MAI', ['Mail']);
    checkAddFlags('PR', ['Platform', 'Raft']);
    checkAddFlags('SUB', ['Submarine']);
    checkAddFlags('ERC', ['Eye Reef Chest']);
    checkAddFlags('BOG', ['Big Octo', 'Gunboat']);
    checkAddFlags('TRE', ['Sunken Treasure']);
    checkAddFlags('EP', ['Expensive Purchase']);
    checkAddFlags('MIS', ['Other Chest', 'Misc']);
    checkAddFlags('TIN', ['Tingle Chest']);
}

function getParamBool(param, defaultVal) {
    return getParamValue(param, defaultVal) == 1;
}

function getParamValue(param, defaultVal) {
    var regex = new RegExp(`${param}(\\d)`);
    var match = flagParam.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return defaultVal;
}

function checkAddFlags(param, flagsToAdd) {
    if (getParamBool(param, false)) {
        for (var i = 0; i < flagsToAdd.length; i++) {
            var curFlag = flagsToAdd[i];
            if (!flags.includes(curFlag)) {
                flags.push(curFlag);
            }
        }
    }
}

function loadProgress() {
    if (progressParam == '1') {
        if (getLocalStorageBool('progress', false)) {
            Object.keys(items).forEach(function (itemName) {
                items[itemName] = getLocalStorageInt(itemName, items[itemName]);
            });
            Object.keys(keys).forEach(function (keyName) {
                keys[keyName] = getLocalStorageInt(keyName, keys[keyName]);
            });
            Object.keys(locationsChecked).forEach(function (generalLocation) {
                Object.keys(locationsChecked[generalLocation]).forEach(function (detailedLocation) {
                    var locationName = getFullLocationName(generalLocation, detailedLocation);
                    locationsChecked[generalLocation][detailedLocation] = getLocalStorageBool(locationName, false);
                });
            });

            if (isCurrentVersionParam == '1') {
                var notificationMessage = 'Progress loaded.';
            } else {
                var notificationMessage = 'Progress loaded for Wind Waker Randomizer ' + versionParam + '.'
            }
            $.notify(notificationMessage, {
                autoHideDelay: 5000,
                className: 'success',
                position: 'top left'
            });
        } else {
            $.notify('Progress could not be loaded.', {
                autoHideDelay: 5000,
                className: 'error',
                position: 'top left'
            });
        }
    }
}

function getLocalStorageInt(itemName, defaultVal) {
    return parseInt(getLocalStorageItem(itemName, defaultVal));
}

function getLocalStorageBool(itemName, defaultVal) {
    return getLocalStorageItem(itemName, defaultVal) == 'true';
}

function getLocalStorageItem(itemName, defaultVal) {
    var itemValue = localStorage.getItem(itemName);
    if (itemValue) {
        return itemValue;
    }
    return defaultVal.toString();
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
                var locationName = getFullLocationName(generalLocation, detailedLocation);
                var locationValue = locationsChecked[generalLocation][detailedLocation];
                localStorage.setItem(locationName, locationValue);
            });
        })
        localStorage.setItem('flags', flags.join(','));
        localStorage.setItem('isKeyLunacy', isKeyLunacy);
        localStorage.setItem('isRandomEntrances', isRandomEntrances);
        localStorage.setItem('isRandomCharts', isRandomCharts);
        localStorage.setItem('swordMode', swordMode);
        localStorage.setItem('skipRematchBosses', skipRematchBosses);
        localStorage.setItem('startingTriforceShards', startingTriforceShards);
        localStorage.setItem('version', versionParam);
        localStorage.setItem('progress', 'true');

        $(element).notify('Progress saved.', {
            autoHideDelay: 5000,
            className: 'success',
            position: 'top left'
        });
    }
    catch (err) {
        $(element).notify('Progress could not be saved.', {
            autoHideDelay: 5000,
            className: 'error',
            position: 'top left'
        });
    }
}
