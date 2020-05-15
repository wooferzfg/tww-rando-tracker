const flagParam = getParameterByName('f');
const gearParam = getParameterByName('g');
const versionParam = getParameterByName('v');
var loadingProgress = getParameterByName('p') == '1';
const isCurrentVersionParam = getParameterByName('c');

var loadingErrorShown = false;
var autoSaveInterval;

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
  if (loadingProgress) {
    return;
  }

  options.key_lunacy = getParamBool('KL', options.key_lunacy);
  options.randomize_charts = getParamBool('RCH', options.randomize_charts);
  options.skip_rematch_bosses = getParamBool('SRB', options.skip_rematch_bosses);
  options.num_starting_triforce_shards = getParamInt('STS', options.num_starting_triforce_shards);
  options.race_mode = getParamBool('RM', options.race_mode);
  options.starting_gear = parseInt(gearParam);

  var entrancesValue = getParamInt('REN', 0);
  switch (entrancesValue) {
    case 0:
      options.randomize_entrances = 'Disabled';
      break;
    case 1:
      options.randomize_entrances = 'Dungeons';
      break;
    case 2:
      options.randomize_entrances = 'Secret Caves';
      break;
    case 3:
      options.randomize_entrances = 'Dungeons & Secret Caves (Separately)';
      break;
    case 4:
      options.randomize_entrances = 'Dungeons & Secret Caves (Together)';
      break;
  }

  var swordValue = getParamInt('SWO', 0);
  switch (swordValue) {
    case 0:
      options.sword_mode = 'Start with Sword';
      break;
    case 1:
      options.sword_mode = 'Randomized Sword';
      break;
    case 2:
      options.sword_mode = 'Swordless';
      break;
  }

  if (getParamBool('TRI', false)) {
    if (options.randomize_charts) {
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
  checkAddFlags('SAV', ['Savage Labyrinth']);
  checkAddFlags('BSM', ['Battlesquid']);
  checkAddFlags('IP', ['Island Puzzle']);
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

function getParamInt(param, defaultVal) {
  return parseInt(getParamValue(param, defaultVal));
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

function loadSaveData(saveDataString) {
  var saveData = JSON.parse(saveDataString);
  items = saveData.items;
  keys = saveData.keys;
  locationsChecked = saveData.locationsChecked;
  macros = saveData.macros;
  entrances = saveData.entrances;
  flags = saveData.flags;
  options = saveData.options;
}

function loadProgress() {
  if (loadingProgress) {
    try {
      var saveData = localStorage.getItem('saveData');
      loadSaveData(saveData);

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
    } catch (err) {
      loadingProgress = false;
      $.notify('Progress could not be loaded.', {
        autoHideDelay: 5000,
        className: 'error',
        position: 'top left'
      });
    }
  }
}

function getSaveData() {
  var saveData = {};

  saveData.items = items;
  saveData.keys = keys;
  saveData.locationsChecked = locationsChecked;
  saveData.macros = macros;
  saveData.entrances = entrances;
  saveData.flags = flags;
  saveData.options = options;
  saveData.version = versionParam;

  return JSON.stringify(saveData);
}

function saveProgress() {
  if (dataHasChanged) {
    localStorage.setItem('saveData', getSaveData());
    localStorage.setItem('version', versionParam);
  } else {
    dataHasChanged = true;
  }
}

function exportProgress() {
  saveTextAs(getSaveData(), 'tww_rando_tracker_progress.json');
}
