import _ from 'lodash';

import CHARTS from '../data/charts.json';
import HAS_ACCESSED_LOCATION_TWEAKS from '../data/has-accessed-location-tweaks.json';
import ISLANDS from '../data/islands.json';

import Locations from './locations';
import LogicHelper from './logic-helper';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';

/**
 * This class handles modifications that must be made to the randomizer logic
 * in order for it to work correctly with the tracker.
 *
 * @class
 */
class LogicTweaks {
  /**
   * This method makes the necessary modifications to the `Locations` and
   * `Macros` for the tracker to function correctly.
   */
  static applyTweaks() {
    this._updateLocations();
    this._updateMacros();
  }

  static _updateLocations() {
    this._addDefeatGanondorf();
    this._updateTingleStatueReward();
    this._updateSunkenTriforceTypes();
    this._applyHasAccessedLocationTweaksForLocations();
  }

  static _updateMacros() {
    this._updateDungeonEntranceMacros();
    this._updateCaveEntranceMacros();
    this._updateBossEntranceMacros();
    this._updateMinibossEntranceMacros();
    this._updateChartMacros();
    this._updateTriforceMacro();
    this._applyHasAccessedLocationTweaksForMacros();
  }

  static _addDefeatGanondorf() {
    Locations.setLocation(
      LogicHelper.DUNGEONS.GANONS_TOWER,
      LogicHelper.DEFEAT_GANONDORF_LOCATION,
      Locations.KEYS.NEED,
      'Can Reach and Defeat Ganondorf',
    );
  }

  static _updateTingleStatueReward() {
    Locations.setLocation(
      LogicHelper.ISLANDS.TINGLE_ISLAND,
      'Ankle - Reward for All Tingle Statues',
      Locations.KEYS.NEED,
      'Tingle Statue x5',
    );
  }

  static _updateSunkenTriforceTypes() {
    if (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
      return;
    }

    _.forEach(ISLANDS, (islandName) => {
      const originalItem = Locations.getLocation(
        islandName,
        'Sunken Treasure',
        Locations.KEYS.ORIGINAL_ITEM,
      );

      if (_.startsWith(originalItem, 'Triforce Shard')) {
        Locations.setLocation(
          islandName,
          'Sunken Treasure',
          Locations.KEYS.TYPES,
          Settings.FLAGS.SUNKEN_TRIFORCE,
        );
      }
    });
  }

  static _replaceCanAccessOtherLocation(requirements) {
    return requirements.replace(/Can Access Item Location/g, 'Has Accessed Other Location');
  }

  static _applyHasAccessedLocationTweaksForLocations() {
    const itemLocationTweaks = HAS_ACCESSED_LOCATION_TWEAKS.itemLocations;
    _.forEach(itemLocationTweaks, (generalLocationInfo, generalLocation) => {
      _.forEach(generalLocationInfo, (detailedLocation) => {
        const requirements = Locations.getLocation(
          generalLocation,
          detailedLocation,
          Locations.KEYS.NEED,
        );
        const newNeeds = this._replaceCanAccessOtherLocation(requirements);

        Locations.setLocation(
          generalLocation,
          detailedLocation,
          Locations.KEYS.NEED,
          newNeeds,
        );
      });
    });
  }

  static _applyHasAccessedLocationTweaksForMacros() {
    const macrosTweaks = HAS_ACCESSED_LOCATION_TWEAKS.macros;
    _.forEach(macrosTweaks, (macroName) => {
      const macroValue = Macros.getMacro(macroName);
      const newMacro = this._replaceCanAccessOtherLocation(macroValue);
      Macros.setMacro(macroName, newMacro);
    });
  }

  static _updateDungeonEntranceMacros() {
    if (!Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES)) {
      return;
    }

    _.forEach(LogicHelper.MAIN_DUNGEONS, (dungeon) => {
      const macroName = `Can Access ${dungeon}`;
      const entryName = LogicHelper.entryName(dungeon);
      Macros.setMacro(macroName, entryName);
    });
  }

  static _updateCaveEntranceMacros() {
    _.forEach(LogicHelper.allIslandEntrances(), (cave) => {
      const macroName = `Can Access ${cave}`;
      const entryName = LogicHelper.entryName(cave);
      Macros.setMacro(macroName, entryName);
    });
  }

  static _updateBossEntranceMacros() {
    if (!Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES)) {
      return;
    }

    _.forEach(LogicHelper.RACE_MODE_DUNGEONS, (dungeonName) => {
      const bossName = LogicHelper.bossForDungeon(dungeonName);
      const macroName = `Can Access ${bossName} Boss Arena`;
      const entryName = LogicHelper.entryName(bossName);
      Macros.setMacro(macroName, entryName);
    });
  }

  static _updateMinibossEntranceMacros() {
    if (!Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES)) {
      return;
    }

    _.forEach(LogicHelper.RANDOM_MINIBOSS_DUNGEONS, (dungeonName) => {
      const minibossName = LogicHelper.minibossForDungeon(dungeonName);
      const macroName = `Can Access ${dungeonName} Miniboss Arena`;
      const entryName = LogicHelper.entryName(minibossName);
      Macros.setMacro(macroName, entryName);
    });
  }

  static _updateChartMacros() {
    if (!Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
      return;
    }

    _.forEach(CHARTS, (chart, index) => {
      // assume everything is a Treasure Chart and clear any additional requirements like
      // wallet upgrades
      const island = LogicHelper.islandForChart(chart);
      const macroName = `Chart for Island ${index + 1}`;
      Macros.setMacro(macroName, LogicHelper.chartForIslandName(island));
    });
  }

  static _updateTriforceMacro() {
    Macros.setMacro('All 8 Triforce Shards', 'Triforce Shard x8');
  }
}

export default LogicTweaks;
