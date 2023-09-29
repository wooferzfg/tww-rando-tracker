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
    this._updateRandomEntranceMacros();
    this._updateChartMacros();
    this._updateTriforceMacro();
    this._applyHasAccessedLocationTweaksForMacros();
    this._updateRequiredBossesModeMacro();
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

  static _updateRandomEntranceMacros() {
    _.forEach(LogicHelper.allRandomEntrances(), (exitMacroName) => {
      const macroName = `Can Access ${exitMacroName}`;
      const entryName = LogicHelper.entryName(exitMacroName);
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

  static _updateRequiredBossesModeMacro() {
    if (!Settings.getOptionValue(Permalink.OPTIONS.REQUIRED_BOSSES)) {
      return;
    }

    const bossRequirements = _.map(
      LogicHelper.REQUIRED_BOSSES_MODE_DUNGEONS,
      (dungeonName) => (
        this._hasAccessedOtherLocationMacro(
          dungeonName,
          LogicHelper.bossLocation(dungeonName),
        )
      ),
    );
    const macroValue = _.join(bossRequirements, ` ${LogicHelper.TOKENS.AND} `);
    Macros.setMacro('Can Defeat All Required Bosses', macroValue);
  }

  static _replaceCanAccessOtherLocation(requirements) {
    return requirements.replace(/Can Access Item Location/g, 'Has Accessed Other Location');
  }

  static _hasAccessedOtherLocationMacro(generalLocation, detailedLocation) {
    return `(Has Accessed Other Location "${generalLocation} - ${detailedLocation}")`;
  }
}

export default LogicTweaks;
